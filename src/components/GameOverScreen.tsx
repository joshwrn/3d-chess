import type { FC } from 'react'
import React from 'react'

import { css } from '@emotion/react'
import type { GameOver } from '@pages/index'
import { VscDebugRestart } from 'react-icons/vsc'

export const GameOverScreen: FC<{
  gameOver: GameOver | null
  reset: () => void
}> = ({ gameOver, reset }) => {
  return (
    <>
      {gameOver && (
        <div
          css={css`
            position: absolute;
            width: 50vw;
            min-width: 300px;
            height: 300px;
            background-color: #ffffff2c;
            backdrop-filter: blur(10px);
            border: 1px solid #ffffff29;
            border-radius: 10px;
            display: flex;
            gap: 1rem;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            top: 50%;
            left: 50%;
            z-index: 100;
            transform: translate(-50%, -50%);
            h1 {
              color: #fff;
            }
            button {
              background-color: #fff;
              font-size: 2rem;
            }
          `}
        >
          <h1>
            {gameOver.type === `checkmate`
              ? `Checkmate! ${gameOver.winner} wins!`
              : `Stalemate!`}
          </h1>
          <button onClick={reset}>
            <VscDebugRestart />
          </button>
        </div>
      )}
    </>
  )
}
