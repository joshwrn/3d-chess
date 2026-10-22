import type { FC } from 'react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Button } from '@components/ui/button'
import { Card, CardContent } from '@components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Slider } from '@components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@components/ui/toggle-group'
import type { IconType } from 'react-icons'
import { FaChessBishop, FaChessKing, FaChessKnight, FaChessPawn, FaChessQueen, FaChessRook } from 'react-icons/fa'

const DemoBoard = dynamic(
  () => import('@components/DemoBoard').then((module) => module.DemoBoard),
  { ssr: false, loading: () => <div className="demo-board-loading">Đang dựng bàn cờ 3D…</div> },
)

type BoardMode = '3d' | '2d'
type BoardView = 'isometric' | 'top' | 'white'
type BoardColors = { light: string; dark: string }

const BOARD_THEMES: Record<string, BoardColors> = {
  classic: { light: '#EEEED2', dark: '#769656' },
  walnut: { light: '#F0D9B5', dark: '#B58863' },
  blue: { light: '#DEE3E6', dark: '#6B8FA3' },
  purple: { light: '#E6D9F2', dark: '#9270AD' },
}

const FEN_PIECES: Record<string, IconType> = {
  K: FaChessKing, Q: FaChessQueen, R: FaChessRook, B: FaChessBishop, N: FaChessKnight, P: FaChessPawn,
  k: FaChessKing, q: FaChessQueen, r: FaChessRook, b: FaChessBishop, n: FaChessKnight, p: FaChessPawn,
}

const Board2D: FC<{ fen: string; lastMove?: string | null; colors: BoardColors }> = ({ fen, lastMove, colors }) => {
  const squares = useMemo(() => {
    const ranks = fen.split(' ')[0].split('/')
    return ranks.flatMap((row, rowIndex) => {
      let file = 0
      const pieces: { key: string; piece?: string; file: number; rank: number }[] = []
      for (const symbol of row) {
        if (/\d/.test(symbol)) {
          for (let empty = 0; empty < Number(symbol); empty += 1) {
            pieces.push({ key: `${file}-${rowIndex}`, file, rank: rowIndex })
            file += 1
          }
        } else {
          pieces.push({ key: `${file}-${rowIndex}`, piece: symbol, file, rank: rowIndex })
          file += 1
        }
      }
      return pieces
    })
  }, [fen])
  const lastSquares = lastMove ? [lastMove.slice(0, 2), lastMove.slice(2, 4)] : []
  return <div className="demo-board-2d" role="img" aria-label="Bàn cờ vua 2D">
    {squares.map(({ key, piece, file, rank }) => {
      const square = `${'abcdefgh'[file]}${8 - rank}`
      const isLight = (file + rank) % 2 === 0
      const PieceIcon = piece ? FEN_PIECES[piece] : null
      return <div className={`demo-square ${isLight ? 'is-light' : 'is-dark'} ${lastSquares.includes(square) ? 'is-last' : ''}`} style={{ backgroundColor: lastSquares.includes(square) ? '#BACB48' : isLight ? colors.light : colors.dark }} key={key}>
        {PieceIcon && <span className={`demo-piece ${piece === piece?.toUpperCase() ? 'is-white' : 'is-black'}`}><PieceIcon aria-hidden="true" /></span>}
        {file === 0 && <small className="demo-rank-label">{8 - rank}</small>}
        {rank === 7 && <small className="demo-file-label">{'abcdefgh'[file]}</small>}
      </div>
    })}
  </div>
}

type GameState = {
  fen: string
  turn: 'white' | 'black'
  status: string | null
  san: string[]
  last_move: string | null
  in_check: boolean
}

type Search = {
  agent: string
  move: string
  san: string
  score_white_cp: number
  depth: number
  nodes: number
  nps: number
  time_s: number
  pv_san: string
  extra: {
    iterations?: number
    nodes_per_depth?: number[]
    tt_entries?: number
    top_moves?: { san: string; visits: number; q: number }[]
  }
}

type Comparison = Search & { move: string }

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const PRETTY: Record<string, string> = {
  alphabeta: 'Alpha-Beta',
  mcts: 'MCTS · UCT',
  mcts_eval: 'MCTS · PUCT',
  mcts_solver: 'MCTS · Solver',
  mcts_hybrid: 'MCTS · Hybrid',
  mcts_hybrid_d1: 'MCTS · Hybrid d1',
  mcts_truncated: 'MCTS · Truncated',
  minimax: 'Minimax',
  alphabeta_plain: 'Alpha-Beta · Plain',
  alphabeta_ordered: 'Alpha-Beta · Ordered',
  alphabeta_selective: 'Alpha-Beta · Selective',
  random: 'Random',
}

async function api<T>(path: string, body?: object): Promise<T> {
  const response = await fetch(`/api/${path}`, body ? {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  } : {})
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`)
  return data as T
}

const fmt = (value: number) => value.toLocaleString('vi-VN')
const score = (cp: number) => Math.abs(cp) >= 90000
  ? `${cp > 0 ? '+' : '−'}MATE`
  : `${cp > 0 ? '+' : ''}${(cp / 100).toFixed(2)}`

const resultReason = (reason: string) => ({
  checkmate: 'Chiếu hết',
  stalemate: 'Hết nước đi hợp lệ',
  'insufficient material': 'Không đủ quân chiếu hết',
  'seventyfive moves': 'Luật 75 nước',
  'fifty moves': 'Luật 50 nước',
  'fivefold repetition': 'Lặp lại thế cờ 5 lần',
  'threefold repetition': 'Lặp lại thế cờ 3 lần',
}[reason.toLowerCase()] || reason)

const describeResult = (status: string | null | undefined) => {
  if (!status) return null
  const winner = status.match(/^(White|Black) wins by (.+)$/i)
  if (winner) {
    const side = winner[1].toLowerCase() === 'white' ? 'white' : 'black'
    return {
      side,
      title: `${side === 'white' ? 'Trắng' : 'Đen'} thắng`,
      detail: resultReason(winner[2]),
    }
  }
  const draw = status.match(/^Draw by (.+)$/i)
  return { side: 'draw', title: 'Hòa cờ', detail: draw ? resultReason(draw[1]) : status }
}

const DemoPage: FC = () => {
  const [agents, setAgents] = useState<string[]>(['alphabeta', 'mcts', 'mcts_eval'])
  const [whiteAgent, setWhiteAgent] = useState('alphabeta')
  const [blackAgent, setBlackAgent] = useState('mcts_eval')
  const [time, setTime] = useState(0.5)
  const [state, setState] = useState<GameState | null>(null)
  const [moves, setMoves] = useState<string[]>([])
  const [lastSearch, setLastSearch] = useState<Search | null>(null)
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [busy, setBusy] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')
  const [boardMode, setBoardMode] = useState<BoardMode>('3d')
  const [boardView, setBoardView] = useState<BoardView>('isometric')
  const [boardTheme, setBoardTheme] = useState('classic')
  const [boardColors, setBoardColors] = useState<BoardColors>(BOARD_THEMES.classic)
  const playingRef = useRef(false)
  const movesRef = useRef<string[]>([])
  const stateRef = useRef<GameState | null>(null)

  const reset = useCallback(async () => {
    playingRef.current = false
    setPlaying(false)
    setBusy(false)
    setLastSearch(null)
    setComparisons([])
    setError('')
    movesRef.current = []
    setMoves([])
    try {
      const next = await api<GameState>('state', { start_fen: DEFAULT_FEN, moves: [] })
      stateRef.current = next
      setState(next)
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Không kết nối được AI server.')
    }
  }, [])

  useEffect(() => {
    void api<{ agents: string[]; default_time_s: number; max_time_s: number }>('config')
      .then((config) => {
        setAgents(config.agents)
        setTime(Math.min(0.5, config.max_time_s))
        if (!config.agents.includes('alphabeta')) setWhiteAgent(config.agents[0])
        if (!config.agents.includes('mcts_eval')) setBlackAgent(config.agents[1] || config.agents[0])
      })
      .catch((issue: unknown) => setError(issue instanceof Error ? issue.message : 'Không kết nối được AI server.'))
    void reset()
  }, [reset])

  const step = useCallback(async () => {
    if (!stateRef.current || stateRef.current.status || busy) return
    setBusy(true)
    setError('')
    try {
      const agent = stateRef.current.turn === 'white' ? whiteAgent : blackAgent
      const result = await api<{ search: Search; state: GameState }>('move', {
        start_fen: DEFAULT_FEN,
        moves: movesRef.current,
        agent,
        time_s: time,
      })
      const nextMoves = [...movesRef.current, result.search.move]
      movesRef.current = nextMoves
      setMoves(nextMoves)
      stateRef.current = result.state
      setState(result.state)
      setLastSearch(result.search)
      setComparisons([])
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Không thể chạy lượt AI.')
      playingRef.current = false
      setPlaying(false)
    } finally {
      setBusy(false)
    }
  }, [blackAgent, busy, time, whiteAgent])

  const run = useCallback(async () => {
    if (busy || !stateRef.current || stateRef.current.status) return
    await step()
    if (stateRef.current?.status) {
      playingRef.current = false
      setPlaying(false)
      return
    }
    if (playingRef.current) window.setTimeout(() => void run(), 180)
  }, [busy, step])

  const togglePlay = () => {
    if (playingRef.current) {
      playingRef.current = false
      setPlaying(false)
      return
    }
    playingRef.current = true
    setPlaying(true)
    void run()
  }

  useEffect(() => () => { playingRef.current = false }, [])

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('introai-board-colors')
      if (saved) {
        const parsed = JSON.parse(saved) as BoardColors
        if (/^#[0-9a-f]{6}$/i.test(parsed.light) && /^#[0-9a-f]{6}$/i.test(parsed.dark)) {
          setBoardColors(parsed)
          setBoardTheme(Object.keys(BOARD_THEMES).find((key) => BOARD_THEMES[key].light === parsed.light && BOARD_THEMES[key].dark === parsed.dark) || 'custom')
        }
      }
    } catch { /* Ignore invalid local board theme data. */ }
  }, [])

  const updateBoardTheme = (theme: string) => {
    setBoardTheme(theme)
    if (BOARD_THEMES[theme]) setBoardColors(BOARD_THEMES[theme])
  }

  const updateBoardColor = (key: keyof BoardColors, value: string) => {
    const next = { ...boardColors, [key]: value }
    setBoardTheme('custom')
    setBoardColors(next)
    window.localStorage.setItem('introai-board-colors', JSON.stringify(next))
  }

  useEffect(() => {
    window.localStorage.setItem('introai-board-colors', JSON.stringify(boardColors))
  }, [boardColors])

  const compare = async () => {
    if (!state || busy) return
    setBusy(true)
    setError('')
    try {
      const result = await api<{ results: Comparison[] }>('compare', {
        start_fen: DEFAULT_FEN,
        moves,
        agents: Array.from(new Set([whiteAgent, blackAgent])),
        time_s: time,
      })
      setComparisons(result.results)
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Không thể so sánh thuật toán.')
    } finally {
      setBusy(false)
    }
  }

  const analysisBars = lastSearch?.extra.nodes_per_depth?.map((nodes, index) => ({
    label: `Độ sâu ${index + 1}`,
    value: nodes,
  })) || lastSearch?.extra.top_moves?.map((move) => ({ label: move.san, value: move.visits })) || []
  const maxBar = Math.max(1, ...analysisBars.map((bar) => bar.value))
  const gameResult = describeResult(state?.status)

  return (
    <main className="demo-shell">
      <Head><title>Chess AI Search Lab · IntroAI</title><meta name="description" content="Mô phỏng 2D/3D và quan sát Alpha-Beta, Monte-Carlo Tree Search trên bàn cờ." /></Head>
      <header className="demo-topbar">
        <a className="demo-brand" href="/demo"><span className="demo-brand-mark">♞</span> INTRO AI <span className="demo-brand-divider">/</span> CHESS LAB</a>
        <div className="demo-top-meta"><span className="demo-live-dot" /> SEARCH PLAYGROUND <span className="demo-version">HW2 · 2026</span></div>
      </header>
      <div className="demo-layout">
        <aside className="demo-sidebar">
          <div className="demo-kicker">HOMEWORK 02 <span>·</span> TOPIC 02</div>
          <h1>Chess AI<br /><em>Search Lab</em></h1>
          <p className="demo-intro">Quan sát hai chiến lược tìm kiếm cùng chơi trên một bàn cờ.</p>

          <section className="demo-section">
            <div className="demo-section-title"><span>01</span> THIẾT LẬP TRẬN ĐẤU</div>
            <label className="demo-field"><span>TRẮNG</span><Select value={whiteAgent} onValueChange={setWhiteAgent}><SelectTrigger className="demo-select" aria-label="Thuật toán quân trắng"><SelectValue /></SelectTrigger><SelectContent>{agents.map((agent) => <SelectItem key={agent} value={agent}>{PRETTY[agent] || agent}</SelectItem>)}</SelectContent></Select></label>
            <label className="demo-field"><span>ĐEN</span><Select value={blackAgent} onValueChange={setBlackAgent}><SelectTrigger className="demo-select" aria-label="Thuật toán quân đen"><SelectValue /></SelectTrigger><SelectContent>{agents.map((agent) => <SelectItem key={agent} value={agent}>{PRETTY[agent] || agent}</SelectItem>)}</SelectContent></Select></label>
            <label className="demo-field"><span>NGÂN SÁCH / LƯỢT</span><div className="demo-range-row"><Slider min={0.1} max={2} step={0.1} value={[time]} onValueChange={([value]) => setTime(value)} aria-label="Ngân sách thời gian mỗi lượt" /><b>{time.toFixed(1)}s</b></div></label>
            <div className="demo-actions">
              <Button onClick={togglePlay} disabled={!state || busy || !!state.status} className="demo-button-primary">{playing ? 'Ⅱ  TẠM DỪNG' : '▶  TỰ ĐỘNG'}</Button>
              <Button variant="outline" onClick={() => void step()} disabled={!state || busy || playing || !!state.status}>BƯỚC TIẾP →</Button>
              <Button variant="ghost" onClick={() => void reset()} disabled={busy} className="demo-button-quiet">↺  VÁN MỚI</Button>
            </div>
          </section>

          <section className="demo-section demo-analysis">
            <div className="demo-section-title"><span>02</span> SEARCH TRACE <Button variant="ghost" size="sm" className="demo-compare" onClick={() => void compare()} disabled={!state || busy}>SO SÁNH ↗</Button></div>
            {lastSearch ? <>
              <div className="demo-search-name"><span className="demo-live-dot" /> {PRETTY[lastSearch.agent] || lastSearch.agent}<span className="demo-search-move">{lastSearch.san}</span></div>
              <Card className="demo-stat-card"><CardContent className="demo-stat-grid">
                <div><small>ĐIỂM (TRẮNG)</small><strong>{score(lastSearch.score_white_cp)}</strong></div>
                <div><small>ĐỘ SÂU</small><strong>{lastSearch.depth}<i> ply</i></strong></div>
                <div><small>NODES</small><strong>{fmt(lastSearch.nodes)}</strong></div>
                <div><small>TỐC ĐỘ</small><strong>{fmt(lastSearch.nps)}<i> /s</i></strong></div>
              </CardContent></Card>
              <div className="demo-chart-title">{lastSearch.extra.iterations !== undefined ? `MCTS · ${fmt(lastSearch.extra.iterations)} SIMULATIONS` : 'ALPHA-BETA · NODES TÍCH LŨY THEO ĐỘ SÂU'}</div>
              <div className="demo-bars">{analysisBars.map((bar) => <div className="demo-bar-row" key={bar.label}><span>{bar.label}</span><div className="demo-bar-track"><i style={{ width: `${Math.max(3, (bar.value / maxBar) * 100)}%` }} /></div><b>{fmt(bar.value)}</b></div>)}{analysisBars.length === 0 && <div className="demo-empty">Chưa có dữ liệu tìm kiếm.</div>}</div>
              <div className="demo-pv"><small>PRINCIPAL VARIATION</small><p>{lastSearch.pv_san || '—'}</p></div>
              {lastSearch.extra.top_moves && <div className="demo-topmoves">{lastSearch.extra.top_moves.map((move) => <span key={move.san}>{move.san}<b>{fmt(move.visits)}</b></span>)}</div>}
            </> : <div className="demo-empty demo-empty-tall">Chạy một lượt để xem dấu vết tìm kiếm của AI.</div>}
          </section>

          {comparisons.length > 0 && <section className="demo-section"><div className="demo-section-title"><span>03</span> KẾT QUẢ SO SÁNH</div>{comparisons.map((item) => <div className="demo-compare-row" key={item.agent}><b>{PRETTY[item.agent] || item.agent}</b><span>{item.san}</span><span>{score(item.score_white_cp)}</span><small>{fmt(item.nodes)} nodes</small></div>)}</section>}

          <footer className="demo-sidebar-footer"><span>ALPHA-BETA PRUNING</span><span className="demo-footer-vs">VS</span><span>MONTE-CARLO TREE SEARCH</span></footer>
        </aside>
        <section className="demo-stage">
          <div className="demo-stage-heading"><div><span className="demo-eyebrow">LIVE MATCH</span><h2>Phòng thí nghiệm tìm kiếm</h2></div><div className="demo-turn-chip"><span className={state?.turn === 'white' ? 'turn-white' : 'turn-black'} />{gameResult ? 'Ván đấu đã kết thúc' : `${state?.turn === 'white' ? 'Lượt trắng' : 'Lượt đen'}${state?.in_check ? ' · Chiếu' : ''}`}</div></div>
          {gameResult && <div className={`demo-result-banner is-${gameResult.side}`} role="status" aria-live="polite"><span className="demo-result-mark">{gameResult.side === 'draw' ? '=' : '♛'}</span><div><small>VÁN ĐẤU ĐÃ KẾT THÚC</small><strong>{gameResult.title}</strong></div><span className="demo-result-detail">{gameResult.detail}</span></div>}
          <div className="demo-board-toolbar">
            <ToggleGroup type="single" value={boardMode} onValueChange={(value) => value && setBoardMode(value as BoardMode)} aria-label="Chế độ bàn cờ">
              <ToggleGroupItem value="3d" aria-label="Bàn cờ 3D">3D</ToggleGroupItem>
              <ToggleGroupItem value="2d" aria-label="Bàn cờ 2D">2D</ToggleGroupItem>
            </ToggleGroup>
            {boardMode === '3d' && <ToggleGroup type="single" value={boardView} onValueChange={(value) => value && setBoardView(value as BoardView)} aria-label="Góc nhìn bàn cờ">
              <ToggleGroupItem value="isometric" aria-label="Góc chéo">Góc chéo</ToggleGroupItem>
              <ToggleGroupItem value="top" aria-label="Nhìn từ trên">Từ trên</ToggleGroupItem>
              <ToggleGroupItem value="white" aria-label="Góc quân trắng">Phía trắng</ToggleGroupItem>
            </ToggleGroup>}
            <div className="demo-board-colors" aria-label="Tùy chỉnh màu bàn cờ">
              <Select value={boardTheme} onValueChange={updateBoardTheme}>
                <SelectTrigger className="demo-theme-select" aria-label="Chọn bảng màu"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Chess.com · Xanh lá</SelectItem>
                  <SelectItem value="walnut">Gỗ ấm</SelectItem>
                  <SelectItem value="blue">Xanh đại dương</SelectItem>
                  <SelectItem value="purple">Tím khói</SelectItem>
                  <SelectItem value="custom">Tùy chỉnh</SelectItem>
                </SelectContent>
              </Select>
              <label className="demo-color-swatch" style={{ backgroundColor: boardColors.light }} title="Chọn màu ô sáng"><span>S</span><input aria-label="Màu ô sáng" type="color" value={boardColors.light} onChange={(event) => updateBoardColor('light', event.target.value)} /></label>
              <label className="demo-color-swatch is-dark" style={{ backgroundColor: boardColors.dark }} title="Chọn màu ô tối"><span>T</span><input aria-label="Màu ô tối" type="color" value={boardColors.dark} onChange={(event) => updateBoardColor('dark', event.target.value)} /></label>
            </div>
          </div>
          <div className={`demo-board-frame ${boardMode === '2d' ? 'is-2d' : 'is-3d'}`}>{boardMode === '3d' ? <DemoBoard key={boardView} fen={state?.fen || DEFAULT_FEN} lastMove={state?.last_move} view={boardView} colors={boardColors} /> : <Board2D fen={state?.fen || DEFAULT_FEN} lastMove={state?.last_move} colors={boardColors} />}{busy && <div className="demo-thinking" role="status" aria-live="polite"><span className="demo-spinner" />ĐANG TÌM KIẾM</div>}</div>
          <div className="demo-board-footer"><span><i className="legend-light" /> Alpha-Beta <small>· iterative deepening + pruning</small></span><span><i className="legend-dark" /> MCTS <small>· UCT / PUCT</small></span><span className="demo-move-count">{String(Math.ceil(moves.length / 2)).padStart(2, '0')} <small>nước</small></span></div>
          <div className="demo-moves"><span className="demo-moves-label">BIÊN BẢN</span><div>{state?.san.length ? state.san.map((san, index) => <span className="demo-move-pair" key={`${index}-${san}`}><b>{Math.floor(index / 2) + 1}.</b>{san}</span>) : <span className="demo-opening">Trận đấu sẵn sàng · nhấn “Bước tiếp” để bắt đầu.</span>}</div></div>
          {error && <div className="demo-error">{error.includes('Failed to fetch') || error.includes('Unexpected token') ? 'Chưa kết nối được AI server. Hãy chạy `chess-ai serve` trong thư mục hw2_introAI.' : error}</div>}
        </section>
      </div>
    </main>
  )
}

export default DemoPage
