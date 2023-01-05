import type { FC } from 'react'

import { css } from '@emotion/react'

import { usePlayerState } from '@/state/player'

export const StatusBar: FC = () => {
  const { room, totalPlayers, joinedRoom } = usePlayerState((state) => ({
    room: state.room,
    totalPlayers: state.totalPlayers,
    joinedRoom: state.joinedRoom,
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
      {joinedRoom && <p>{room}</p>}
      {totalPlayers < 2 && joinedRoom && <p>Waiting for opponent...</p>}
    </div>
  )
}
