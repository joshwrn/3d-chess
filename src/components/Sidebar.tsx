import type { FC } from 'react'
import React from 'react'

import { css } from '@emotion/react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs'

import type { Board } from '../logic/board'
import type { Move, Piece } from '../logic/pieces'
import type { History } from './History'
import { HistoryPanel } from './History'
import { MiniMap } from './MiniMap'

export const Sidebar: FC<{
  board: Board
  history: History[]
  moves: Move[]
  selected: Piece | null
}> = ({ board, history, moves, selected }) => {
  const [show, setShow] = React.useState<boolean>(false)
  return (
    <>
      {!show && (
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
            <HistoryPanel history={history} />
          </>
        )}
      </div>
    </>
  )
}
