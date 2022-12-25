import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'

import type { Board, Position, Tile } from '../src/logic/board'
import { DEFAULT_BOARD } from '../src/logic/board'
import { movesForPiece } from '../src/logic/pieces'
import { isPawn } from '../src/logic/pieces/pawn'

const copyBoard = (board: Board) => {
  return [
    ...board.map((row) => {
      return [
        ...row.map((tile) => {
          return { ...tile }
        }),
      ]
    }),
  ]
}

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(DEFAULT_BOARD)

  const [selected, setSelected] = useState<Tile | null>(null)
  const [moves, setMoves] = useState<Position[]>([])

  const handleSelect = (tile: Tile | null) => {
    if (!tile?.piece?.type && !selected) return
    if (!tile?.piece) {
      setSelected(null)
      return
    }

    setMoves(movesForPiece(tile.piece, board))
    setSelected(tile)
  }

  const handleMove = (tile: Tile) => {
    if (!selected) return
    setBoard((prev) => {
      const newBoard = copyBoard(prev)
      const selectedTile = newBoard[selected.position.y][selected.position.x]
      const tileToMoveTo = newBoard[tile.position.y][tile.position.x]
      if (isPawn(selectedTile.piece)) {
        selectedTile.piece.firstMove = false
      }

      tileToMoveTo.piece = selected.piece
        ? Object.assign({}, { ...selected.piece, position: tile.position })
        : null
      selectedTile.piece = null

      return [...newBoard]
    })

    setMoves([])
    setSelected(null)
  }

  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        background-color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      {board.map((row, i) => (
        <div
          key={i}
          css={css`
            display: flex;
          `}
        >
          {row.map((tile, j) => {
            const bg = `${(i + j) % 2 === 0 ? `#a8968b` : `#5e3d1e`}`
            const isSelected = selected?.piece?.getId() === tile.piece?.getId?.()
            const canMoveTo = () => {
              if (!selected?.piece) return false

              let canMove = false
              for (const move of moves) {
                const pos = selected.position || { x: 0, y: 0 }

                if (
                  pos.x + move.x === tile.position.x &&
                  pos.y + move.y === tile.position.y
                ) {
                  canMove = true
                  break
                }
              }
              return canMove
            }

            const canMove = canMoveTo()

            return (
              <div
                key={j}
                onClick={() => (canMove ? handleMove(tile) : handleSelect(tile))}
                css={css`
                  height: 50px;
                  width: 50px;
                  background-color: ${canMove ? `red` : bg};
                  border: 1px solid #000;
                  cursor: ${canMove || tile.piece ? `pointer` : `default`};
                `}
              >
                {tile && (
                  <>
                    <p
                      style={{
                        color: isSelected ? `#f00` : tile.piece?.color,
                        fontWeight: `bold`,
                      }}
                    >
                      {tile.piece?.type}
                    </p>
                    <p style={{ color: `#fdc064`, fontSize: 12 }}>
                      x:{tile.position.x} y:{tile.position.y}
                    </p>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
      {/* <Canvas>
        <OrbitControls enableZoom={false} />
        <ambientLight intensity={0.25} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <pointLight position={[10, 10, 10]} />
      </Canvas> */}
    </div>
  )
}

export default Home
