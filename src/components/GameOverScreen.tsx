import type { FC } from 'react'

import { css } from '@emotion/react'
import { VscDebugRestart } from 'react-icons/vsc'

import type { GameOver } from '@/pages/index'
import { usePlayerState } from '@/state/player'
import { useSocketState } from '@/utils/socket'

export const GameOverScreen: FC<{
  gameOver: GameOver | null
}> = ({ gameOver }) => {
  const socket = useSocketState((state) => state.socket)
  const { room } = usePlayerState((state) => state)
  const reset = () => {
    socket?.emit(`resetGame`, { room })
  }
  return (
    <>
      {gameOver && (
        <div
          css={css`
            position: absolute;
            width: 50vw;
            min-width: 300px;
            height: 300px;
            background-color: #00000067;
            backdrop-filter: blur(10px);
            border: 1px solid #ffffff12;
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
