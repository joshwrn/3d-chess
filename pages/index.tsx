import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'

import type { Board, Tile } from '../src/logic/board'
import { movesForPiece, DEFAULT_BOARD } from '../src/logic/board'

const copyBoard = (board: Board) => {
  return [
    ...board.map((row) => {
      return [
        ...row.map((tile) => {
          return { ...tile }
        }),
      ]
    }),
  ]
}

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(DEFAULT_BOARD)

  const [selected, setSelected] = useState<Tile | null>(null)

  const handleSelect = (tile: Tile | null) => {
    if (!tile?.piece?.type && !selected) return
    if (!tile?.piece) {
      setSelected(null)
      return
    }
    setSelected(tile)
  }

  const handleMove = (tile: Tile) => {
    if (!selected) return
    setBoard((prev) => {
      const newBoard = copyBoard(prev)
      const selectedTile = newBoard[selected.position.y][selected.position.x]
      const tileToMoveTo = newBoard[tile.position.y][tile.position.x]
      switch (selectedTile.piece?.type) {
        case `pawn`:
          selectedTile.piece.firstMove = false
      }

      tileToMoveTo.piece = selected.piece
        ? Object.assign({}, selected.piece)
        : null
      selectedTile.piece = null

      return [...newBoard]
    })

    setSelected(null)
  }

  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        background-color: #000;
        display: flex;
        flex-direction: column;
      `}
    >
      {board.map((row, i) => (
        <div
          key={i}
          css={css`
            display: flex;
          `}
        >
          {row.map((tile, j) => {
            const bg = `${(i + j) % 2 === 0 ? `#a8968b` : `#5e3d1e`}`
            const isSelected = selected?.piece?.id === tile.piece?.getId?.()
            const canMoveTo = () => {
              if (!selected?.piece) return false
              for (const move of movesForPiece.pawn({
                ...selected.piece,
                board,
              }) || []) {
                const pos = selected?.position || { x: 0, y: 0 }
                if (
                  pos.x + move.x === tile.position.x &&
                  pos.y + move.y === tile.position.y
                ) {
                  return true
                }
              }
            }

            return (
              <div
                key={j}
                onClick={() =>
                  canMoveTo() ? handleMove(tile) : handleSelect(tile)
                }
                css={css`
                  height: 50px;
                  width: 50px;
                  background-color: ${canMoveTo() ? `red` : bg};
                  cursor: ${canMoveTo() || tile.piece ? `pointer` : `default`};
                `}
              >
                {tile && (
                  <>
                    <p
                      style={{
                        color: isSelected ? `#f00` : tile.piece?.color,
                        fontWeight: `bold`,
                      }}
                    >
                      {tile.piece?.type}
                    </p>
                    <p style={{ color: `#fdc064`, fontSize: 12 }}>
                      x:{tile.position.x} y:{tile.position.y}
                    </p>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
      {/* <Canvas>
        <OrbitControls enableZoom={false} />
        <ambientLight intensity={0.25} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <pointLight position={[10, 10, 10]} />
      </Canvas> */}
    </div>
  )
}

export default Home
