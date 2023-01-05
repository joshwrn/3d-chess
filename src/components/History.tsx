import type { FC } from 'react'

import { css } from '@emotion/react'
import type { Board, Position } from '@logic/board'
import type { MoveTypes, Piece } from '@logic/pieces'

import { useHistoryState } from '@/state/history'
import { uppercaseFirstLetter } from '@/utils/upperCaseFirstLetter'

export type History = {
  board: Board
  from: Position
  to: Position
  capture: Piece | null
  type: MoveTypes
  steps: Position
  piece: Piece
}

const convertCoords = (x: number, y: number) => {
  return { y: y + 1, x: numberMap[x] }
}

const numberMap: {
  [key: number]: string
} = {
  0: `a`,
  1: `b`,
  2: `c`,
  3: `d`,
  4: `e`,
  5: `f`,
  6: `g`,
  7: `h`,
}

const getLastFive = (arr: History[]) => {
  if (arr.length < 5) return arr
  return arr.slice(arr.length - 5, arr.length)
}

export const HistoryPanel: FC = () => {
  const history = useHistoryState((state) => state.history)
  return (
    <div
      css={css`
        position: relative;
        width: fit-content;
        z-index: 100;
        height: 180px;
        width: 210px;
        gap: 5px;
        display: flex;
        flex-direction: column;
        h1 {
          margin-bottom: 5px;
        }
        p,
        h1 {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
        }
        span {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 400;
        }
      `}
    >
      <h1>History</h1>
      {getLastFive(history).map((h, i) => {
        const from = convertCoords(h.from.x, h.from.y)
        const to = convertCoords(h.to.x, h.to.y)
        return (
          <p key={i}>
            {uppercaseFirstLetter(h.piece?.color)}
            {` `}
            {uppercaseFirstLetter(h.piece?.type)}
            <span>
              {` `}from{` `}
            </span>
            {from.x + from.y}
            <span>
              {` `}to{` `}
            </span>
            {to.x + to.y}
          </p>
        )
      })}
    </div>
  )
}
