import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'
import { BsMap } from 'react-icons/bs'
import {
  FaChessPawn,
  FaChessKnight,
  FaChessBishop,
  FaChessRook,
  FaChessQueen,
  FaChessKing,
} from 'react-icons/fa'

import type { Board, Position, Tile } from '../logic/board'

export const MiniMap: FC<{
  board: Board
  selected: Tile | null
  moves: Position[]
}> = ({ board, selected, moves }) => {
  const [show, setShow] = useState<boolean>(false)
  return (
    <>
      <div
        css={css`
          position: absolute;
          top: 50px;
          left: 50px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          svg {
            color: #ffffff;
          }
        `}
        onClick={() => setShow(!show)}
      >
        <BsMap size={30} />
      </div>
      {show && (
        <div
          css={css`
            display: flex;
            position: absolute;
            flex-direction: column;
            top: 50px;
            left: 150px;
            z-index: 1;
            width: 200px;
            height: 200px;
            flex-shrink: 0;
            overflow: hidden;
            border-radius: 7px;
            pointer-events: none;
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
                const bg = `${(i + j) % 2 === 0 ? `#a5a5a5` : `#676767`}`
                const isSelected =
                  selected?.piece?.getId() === tile.piece?.getId?.()
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
                    css={css`
                      height: 25px;
                      width: 25px;
                      background-color: ${canMove ? `red` : bg};
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      svg {
                        color: ${isSelected ? `red` : tile.piece?.color};
                      }
                    `}
                  >
                    {tile && (
                      <>
                        {tile.piece?.type === `pawn` && <FaChessPawn />}
                        {tile.piece?.type === `knight` && <FaChessKnight />}
                        {tile.piece?.type === `bishop` && <FaChessBishop />}
                        {tile.piece?.type === `rook` && <FaChessRook />}
                        {tile.piece?.type === `queen` && <FaChessQueen />}
                        {tile.piece?.type === `king` && <FaChessKing />}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
