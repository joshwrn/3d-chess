import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'

type Piece = {
  piece: string
  color: string
  id: number
  getId: () => string
  position: Position
}
const createId = (col: Piece | null): string => {
  return `${col?.piece} ${col?.color} ${col?.id}`
}
type Position = { x: number; y: number }
type MovesForPiece = {
  [key: string]: Position[]
}
const movesForPiece: MovesForPiece = {
  pawn: [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ],
}
type PieceArgs = { color: string; id: number; piece: string }
class Tile {
  public constructor(position: Position, piece?: PieceArgs) {
    this.position = position
    this.piece = piece ? this.getPiece(piece) : null
  }
  public position: Position
  public piece: Piece | null = null
  public getPiece({ color, id, piece }: PieceArgs): Piece | null {
    return new BoardPiece(color, id, this.position, piece)
  }
}
class BoardPiece {
  public constructor(
    color: string,
    id: number,
    position: Position,
    piece = `pawn`,
  ) {
    this.color = color
    this.id = id
    this.piece = piece
    this.position = position
  }
  public color: string
  public id: number
  public piece: string
  public position: Position
  public selected = false
  public getId(): string {
    return createId(this)
  }
  public getMoves() {
    return movesForPiece[this.piece]
  }
}

const DEFAULT_BOARD: Tile[][] = [
  [
    new Tile(
      { x: 0, y: 0 },
      {
        color: `black`,
        id: 1,
        piece: `rook`,
      },
    ),
    new Tile(
      { x: 1, y: 0 },
      {
        color: `black`,
        id: 1,
        piece: `knight`,
      },
    ),
    new Tile(
      { x: 2, y: 0 },
      {
        color: `black`,
        id: 1,
        piece: `bishop`,
      },
    ),
    new Tile(
      { x: 3, y: 0 },
      {
        color: `black`,
        id: 1,
        piece: `queen`,
      },
    ),
    new Tile(
      { x: 4, y: 0 },
      {
        color: `black`,
        id: 1,
        piece: `king`,
      },
    ),
    new Tile(
      { x: 5, y: 0 },
      {
        color: `black`,
        id: 2,
        piece: `bishop`,
      },
    ),
    new Tile(
      { x: 6, y: 0 },
      {
        color: `black`,
        id: 2,
        piece: `knight`,
      },
    ),
    new Tile(
      { x: 7, y: 0 },
      {
        color: `black`,
        id: 2,
        piece: `rook`,
      },
    ),
  ],
  [
    ...Array(8)
      .fill(null)
      .map(
        (_, i) =>
          new Tile(
            { x: i, y: 1 },
            {
              color: `black`,
              id: i + 1,
              piece: `pawn`,
            },
          ),
      ),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => new Tile({ x: i, y: 2 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => new Tile({ x: i, y: 3 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => new Tile({ x: i, y: 4 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => new Tile({ x: i, y: 5 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map(
        (_, i) =>
          new Tile(
            { x: i, y: 1 },
            {
              color: `white`,
              id: i + 1,
              piece: `pawn`,
            },
          ),
      ),
  ],
  [
    new Tile(
      { x: 0, y: 7 },
      {
        color: `white`,
        id: 1,
        piece: `rook`,
      },
    ),
    new Tile(
      { x: 1, y: 7 },
      {
        color: `white`,
        id: 1,
        piece: `knight`,
      },
    ),
    new Tile(
      { x: 2, y: 7 },
      {
        color: `white`,
        id: 1,
        piece: `bishop`,
      },
    ),
    new Tile(
      { x: 3, y: 7 },
      {
        color: `white`,
        id: 1,
        piece: `queen`,
      },
    ),
    new Tile(
      { x: 4, y: 7 },
      {
        color: `white`,
        id: 1,
        piece: `king`,
      },
    ),
    new Tile(
      { x: 5, y: 7 },
      {
        color: `white`,
        id: 2,
        piece: `bishop`,
      },
    ),
    new Tile(
      { x: 6, y: 7 },
      {
        color: `white`,
        id: 2,
        piece: `knight`,
      },
    ),
    new Tile(
      { x: 7, y: 7 },
      {
        color: `white`,
        id: 2,
        piece: `rook`,
      },
    ),
  ],
]

export const Home: FC = () => {
  const board = DEFAULT_BOARD
  const [selected, setSelected] = useState<string | null>(null)
  const handleSelect = (col: Piece | null) => {
    if (!col && !selected) return

    setSelected(col?.getId?.() ?? null)
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
          {row.map((col, j) => (
            <div
              key={j}
              onClick={() => handleSelect(col.piece)}
              css={css`
                height: 50px;
                width: 50px;
                background-color: ${(i + j) % 2 === 0 ? `#a8968b` : `#5e3d1e`};
              `}
            >
              {col && (
                <p
                  style={{
                    color:
                      selected === col.piece?.getId?.()
                        ? `#f00`
                        : col.piece?.color,
                  }}
                >
                  {col.piece?.piece}
                </p>
              )}
            </div>
          ))}
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
