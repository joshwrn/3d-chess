import type { Piece, PieceArgs } from './pieces'
import { createPiece } from './pieces'
import type { Pawn } from './pieces/pawn'

export type Position = { x: number; y: number }

export type Board = Tile[][]

export type Tile = {
  position: Position
  piece: Pawn | Piece | null
}
export const createTile = (position: Position, piece?: PieceArgs): Tile => {
  return {
    position,
    piece: piece ? createPiece({ ...piece, position }) : null,
  }
}

export const tileHeights: number[] = Array(64)
  .fill(0)
  .map(() => {
    return Math.random() * 0.05
  })

export const copyBoard = (board: Board): Board => {
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

export const DEFAULT_BOARD: Board = [
  [
    createTile(
      { x: 0, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `rook`,
      },
    ),
    createTile(
      { x: 1, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `knight`,
      },
    ),
    createTile(
      { x: 2, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `bishop`,
      },
    ),
    createTile(
      { x: 3, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `queen`,
      },
    ),
    createTile(
      { x: 4, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `king`,
      },
    ),
    createTile(
      { x: 5, y: 0 },
      {
        color: `black`,
        id: 2,
        type: `bishop`,
      },
    ),
    createTile(
      { x: 6, y: 0 },
      {
        color: `black`,
        id: 2,
        type: `knight`,
      },
    ),
    createTile(
      { x: 7, y: 0 },
      {
        color: `black`,
        id: 2,
        type: `rook`,
      },
    ),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) =>
        createTile(
          { x: i, y: 1 },
          {
            color: `black`,
            id: i + 1,
            type: `pawn`,
          },
        ),
      ),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => createTile({ x: i, y: 2 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => createTile({ x: i, y: 3 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => createTile({ x: i, y: 4 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => createTile({ x: i, y: 5 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) =>
        createTile(
          { x: i, y: 6 },
          {
            color: `white`,
            id: i + 1,
            type: `pawn`,
          },
        ),
      ),
  ],
  [
    createTile(
      { x: 0, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `rook`,
      },
    ),
    createTile(
      { x: 1, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `knight`,
      },
    ),
    createTile(
      { x: 2, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `bishop`,
      },
    ),
    createTile(
      { x: 3, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `queen`,
      },
    ),
    createTile(
      { x: 4, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `king`,
      },
    ),
    createTile(
      { x: 5, y: 7 },
      {
        color: `white`,
        id: 2,
        type: `bishop`,
      },
    ),
    createTile(
      { x: 6, y: 7 },
      {
        color: `white`,
        id: 2,
        type: `knight`,
      },
    ),
    createTile(
      { x: 7, y: 7 },
      {
        color: `white`,
        id: 2,
        type: `rook`,
      },
    ),
  ],
]
