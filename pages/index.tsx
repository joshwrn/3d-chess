import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'

import type { Board, Tile } from '../src/logic/board'
import { DEFAULT_BOARD } from '../src/logic/board'

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
    // const newBoard = board.map((row) =>
    //   row.map((t) => {
    //     const newPiece = () => {
    //       switch (selected.piece?.type) {
    //         case `pawn`:
    //           return {
    //             ...selected.piece,
    //             firstMove: false,
    //           }
    //       }
    //     }
    //     if (
    //       t.position.x === tile.position.x &&
    //       t.position.y === tile.position.y
    //     ) {
    //       return {
    //         ...t,
    //         piece: newPiece(),
    //       }
    //     }
    //     if (
    //       t.position.x === selected.position.x &&
    //       t.position.y === selected.position.y
    //     ) {
    //       return {
    //         ...t,
    //         piece: null,
    //       }
    //     }
    //     return t
    //   }),
    // )
    // setBoard(newBoard)
    tile.piece = selected.piece
    if (tile?.piece?.type === `pawn`) {
      tile.piece.firstMove = false
    }
    selected.piece = null
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
              for (const move of selected?.piece?.getMoves({ board }) || []) {
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
