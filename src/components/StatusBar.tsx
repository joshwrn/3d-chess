import type { FC } from 'react'

import { css } from '@emotion/react'

import { useGameSettingsState } from '@/state/game'
import { usePlayerState } from '@/state/player'

export const StatusBar: FC = () => {
  const { room, joinedRoom, playerColor } = usePlayerState((state) => ({
    room: state.room,
    joinedRoom: state.joinedRoom,
    playerColor: state.playerColor,
  }))
  const { gameStarted } = useGameSettingsState((state) => ({
    gameStarted: state.gameStarted,
  }))
  return (
    <div
      css={css`
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: #ffffff8d;
        font-size: 20px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      `}
    >
      {joinedRoom && (
        <p>
          room: {room} player: {playerColor}
        </p>
      )}
      {!gameStarted && joinedRoom && <p>Waiting for opponent...</p>}
    </div>
  )
}
