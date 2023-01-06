import type { FC } from 'react'

import { css } from '@emotion/react'

import { useGameSettingsState } from '@/state/game'
import { usePlayerState } from '@/state/player'
import { uppercaseFirstLetter } from '@/utils/upperCaseFirstLetter'

export const StatusBar: FC = () => {
  const { room, joinedRoom, playerColor } = usePlayerState((state) => ({
    room: state.room,
    joinedRoom: state.joinedRoom,
    playerColor: state.playerColor,
  }))
  const { gameStarted, turn } = useGameSettingsState((state) => ({
    gameStarted: state.gameStarted,
    turn: state.turn,
  }))
  return (
    <div
      css={css`
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: #ffffff8d;
        font-size: 14px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        span {
          color: #ffffffba;
          font-weight: 600;
        }
      `}
    >
      {joinedRoom && (
        <p>
          Room{` `}
          <span>{room}</span>
          {` | `}Player{` `}
          <span>{uppercaseFirstLetter(playerColor)}</span>
          {` | `}Turn{` `}
          <span>{uppercaseFirstLetter(turn)}</span>
        </p>
      )}
      {!gameStarted && joinedRoom && (
        <p>Share your room name to invite another player.</p>
      )}
    </div>
  )
}
