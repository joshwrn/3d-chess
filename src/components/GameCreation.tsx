import type { ChangeEvent, FC } from 'react'

import { css } from '@emotion/react'
import { toast } from 'react-toastify'

import { usePlayerState } from '@/state/player'
import { useSocketState } from '@/utils/socket'

export type JoinRoomClient = {
  room: string
  username: string
}

const filter = (
  e: ChangeEvent<HTMLInputElement>,
  set: (str: string) => void,
) => {
  const str = e.target.value
  const filtered = str.replace(/[^a-zA-Z0-9]/g, ``)
  set(filtered)
}

export const GameCreation: FC = () => {
  const { room, username, joinedRoom, setUsername, setRoom, id } =
    usePlayerState((state) => state)
  const { socket } = useSocketState((state) => ({
    socket: state.socket,
  }))
  const sendRoom = async () => {
    if (!socket) return
    const data: JoinRoomClient = { room, username: `${username}#${id}` }
    socket.emit(`joinRoom`, data)
    socket.emit(`fetchPlayers`, { room })
  }
  return (
    <>
      {!joinedRoom && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (username.length < 3 || room.length < 3) {
                toast.error(`Name or Room is too short.`, {
                  toastId: `nameOrRoomTooShort`,
                })
                return
              }
              sendRoom()
            }}
          >
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
                placeholder="Name"
                value={username}
                onChange={(e) => filter(e, setUsername)}
                minLength={3}
                maxLength={10}
              />
              <div>
                <input
                  type="text"
                  placeholder="Room"
                  value={room}
                  onChange={(e) => filter(e, setRoom)}
                  minLength={3}
                  maxLength={16}
                />
                <p>If no room exists one will be created.</p>
              </div>
              <button type="submit">Join Room</button>
            </div>
          </form>
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
