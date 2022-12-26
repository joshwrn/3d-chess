import type { FC } from 'react'

import { css } from '@emotion/react'

import type { ThreeMouseEvent } from '../../pages'
import type { Board, Position, Tile } from '../logic/board'

export const MiniMap: FC<{
  board: Board
  selected: Tile | null
  moves: Position[]
  handleMove: (e: ThreeMouseEvent, tile: Tile) => void
  handleSelect: (e: ThreeMouseEvent, tile: Tile | null) => void
}> = ({ board, selected, moves, handleMove, handleSelect }) => {
  return (
    <div
      css={css`
        display: flex;
        position: absolute;
        flex-direction: column;
        top: 0;
        left: 0;
        z-index: 1;
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
                onClick={(e) =>
                  canMove ? handleMove(e, tile) : handleSelect(e, tile)
                }
                css={css`
                  height: 25px;
                  width: 25px;
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
                      {tile.piece?.type.charAt(0)}
                    </p>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
