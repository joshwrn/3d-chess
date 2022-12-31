import type { FC } from 'react'

import { css } from '@emotion/react'
import type { Board } from '@logic/board'
import type { Move, Piece } from '@logic/pieces'
import { checkIfSelectedPieceCanMoveHere } from '@logic/pieces'
import {
  FaChessPawn,
  FaChessKnight,
  FaChessBishop,
  FaChessRook,
  FaChessQueen,
  FaChessKing,
} from 'react-icons/fa'

export const MiniMap: FC<{
  board: Board
  selected: Piece | null
  moves: Move[]
}> = ({ board, selected, moves }) => {
  return (
    <div
      css={css`
        display: flex;
        position: relative;
        flex-direction: column;
        z-index: 1;
        width: 200px;
        height: 200px;
        flex-shrink: 0;
        overflow: hidden;
        border-radius: 7px;
        opacity: 0.8;
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
            const isSelected = selected?.getId() === tile.piece?.getId?.()
            const canMove = checkIfSelectedPieceCanMoveHere({
              selected,
              moves,
              tile,
            })

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
  )
}
