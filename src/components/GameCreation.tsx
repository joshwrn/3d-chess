import type { FC } from 'react'

import { css } from '@emotion/react'

import { usePlayerState } from '@/state/player'
import { useSocketState } from '@/utils/socket'

export type JoinRoomClient = {
  room: string
  username: string
}

export const GameCreation: FC = () => {
  const { room, username, setJoinedRoom, joinedRoom, setUsername, setRoom } =
    usePlayerState((state) => ({
      room: state.room,
      username: state.username,
      setJoinedRoom: state.setJoinedRoom,
      joinedRoom: state.joinedRoom,
      setUsername: state.setUsername,
      setRoom: state.setRoom,
    }))
  const { socket } = useSocketState((state) => ({
    socket: state.socket,
  }))
  const sendRoom = async () => {
    if (!socket) return
    const data: JoinRoomClient = { room, username }
    socket.emit(`joinRoom`, data)
    socket.emit(`fetchPlayers`, { room })
    setJoinedRoom(true)
  }
  return (
    <>
      {!joinedRoom && (
        <>
          <div
            css={css`
              width: 300px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 100;
              backdrop-filter: blur(30px);
              background-color: #ffffff8d;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              border-radius: 10px;
              padding: 25px 40px;
              gap: 20px;
              p {
                font-size: 12px;
                color: #00000092;
                padding-top: 10px;
              }
              div {
                width: 100%;
              }
              input {
                padding-bottom: 10px;
                width: 100%;
                border-color: #000000;
                color: #000000;
                ::placeholder {
                  color: #000000;
                }
              }
            `}
          >
            <input
              type="text"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div>
              <input
                type="text"
                placeholder="Room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
              <p>If no room exists one will be created.</p>
            </div>
            <button onClick={sendRoom}>Join Room</button>
          </div>
          <div
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: #00000021;
              z-index: 99;
            `}
          />
        </>
      )}
    </>
  )
}
