import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'

import type { Message } from '@/state/player'
import { useMessageState, usePlayerState } from '@/state/player'
import { useSocketState } from '@/utils/socket'

export type MessageClient = {
  room: string
  message: Message
}

export const Chat: FC = () => {
  const [message, setMessage] = useState(``)
  const [messages] = useMessageState((state) => [state.messages])
  const { room, username } = usePlayerState((state) => ({
    room: state.room,
    username: state.username,
  }))
  const socket = useSocketState((state) => state.socket)
  const sendMessage = async () => {
    socket?.emit(`createdMessage`, {
      room: room,
      message: { author: username, message },
    })
    setMessage(``)
  }

  const handleKeypress = (e: { keyCode: number }) => {
    if (e.keyCode === 13) {
      if (message) {
        sendMessage()
      }
    }
  }
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 270px;
        height: 190px;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        padding: 10px;
        overflow-y: hidden;
        z-index: 100;
        color: white;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: hidden;
          position: relative;
          justify-content: flex-end;
        `}
      >
        {messages.map((msg, i) => {
          return (
            <div
              css={css`
                margin-bottom: 5px;
                p {
                  font-size: 14px;
                }
                span {
                  font-weight: 700;
                  color: #ffffffa1;
                }
              `}
              key={i}
            >
              <p>
                <span>{msg.author}</span>: {msg.message}
              </p>
            </div>
          )
        })}
      </div>
      <div
        css={css`
          display: flex;
          width: 100%;
          justify-content: space-between;
          gap: 40px;
        `}
      >
        <input
          type="text"
          placeholder="New message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleKeypress}
        />
        <button
          onClick={() => {
            sendMessage()
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
