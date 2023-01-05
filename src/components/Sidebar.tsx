import type { FC } from 'react'
import React from 'react'

import { css } from '@emotion/react'
import type { Board } from '@logic/board'
import type { Move, Piece } from '@logic/pieces'
import { AiFillCloseCircle } from 'react-icons/ai'
import { BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs'

import { HistoryPanel } from './History'
import { MiniMap } from './MiniMap'
import { useGameSettingsState } from '@/state/game'
import { useHistoryState } from '@/state/history'
import { usePlayerState } from '@/state/player'

export const Sidebar: FC<{
  board: Board
  moves: Move[]
  selected: Piece | null
  setBoard: (board: Board) => void
  reset: () => void
}> = ({ board, moves, selected, reset, setBoard }) => {
  const [show, setShow] = React.useState<boolean>(false)
  const setTurn = useGameSettingsState((state) => state.setTurn)
  const joinedGame = usePlayerState((state) => state.joinedRoom)
  const [history, undoHistory] = useHistoryState((state) => [
    state.history,
    state.undo,
  ])
  const gameType = useGameSettingsState((state) => state.gameType)
  const undo = () => {
    if (history.length > 0) {
      const last = history[history.length - 1]
      setBoard(last.board)
      setTurn()
      undoHistory()
    }
  }
  return (
    <>
      {!show && joinedGame && (
        <BsReverseLayoutSidebarInsetReverse
          onClick={() => setShow(!show)}
          css={css`
            position: absolute;
            top: 30px;
            left: 30px;
            z-index: 100;
            color: rgba(255, 255, 255, 0.8);
            font-size: 30px;
            cursor: pointer;
          `}
        />
      )}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          position: absolute;
          gap: 30px;
          top: 0;
          left: 0;
          width: fit-content;
          padding: 30px 30px;
          height: 100%;
          z-index: 1;
          user-select: none;
          backdrop-filter: blur(10px);
          > svg {
            position: absolute;
            top: 30px;
            right: -15px;
            z-index: 100;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            font-size: 20px;
          }
        `}
      >
        {show && (
          <>
            <AiFillCloseCircle onClick={() => setShow(!show)} />
            <MiniMap board={board} selected={selected} moves={moves} />
            <HistoryPanel />
            <div
              css={css`
                display: flex;
                gap: 30px;
                width: 100%;
                justify-content: center;
                height: 100%;
                align-items: flex-end;
                button {
                  width: 100%;
                }
              `}
            >
              {gameType === `local` && (
                <>
                  <button onClick={reset}>Reset</button>
                  <button onClick={() => undo()}>Undo</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
