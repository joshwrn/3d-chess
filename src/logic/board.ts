import type { Piece, PieceArgs } from './pieces'
import { createPiece } from './pieces'
import type { Pawn } from './pieces/pawn'
import type { Rook } from './pieces/rook'

export type Position = { x: number; y: number }

export type Board = Tile[][]

export type Tile = {
  position: Position
  piece: Pawn | Piece | Rook | null
}
export const createTile = (position: Position, piece?: PieceArgs): Tile => {
  return {
    position,
    piece: piece ? createPiece({ ...piece, position }) : null,
  }
}

export const checkIfPositionsMatch = (
  pos1?: Position | null,
  pos2?: Position | null,
): boolean => {
  if (!pos1 || !pos2) return false
  return pos1.x === pos2.x && pos1.y === pos2.y
}

export const copyBoard = (board: Board): Board => {
  return [
    ...board.map((row) => {
      return [
        ...row.map((tile) => {
          return { ...tile, piece: tile.piece ? { ...tile.piece } : null }
        }),
      ]
    }),
  ]
}

export const createBoard = (): Board => {
  const DEFAULT_BOARD: Board = [
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
  return DEFAULT_BOARD
}

type TestBoardArgs = {
  position: Position
  piece: PieceArgs
}
export const createTestBoard = (pieces: TestBoardArgs[]): Board => {
  const board = [
    ...Array(8)
      .fill(null)
      .map((_, j) =>
        Array(8)
          .fill(null)
          .map((_, i) => createTile({ x: i, y: j })),
      ),
  ]

  for (const { position, piece } of pieces) {
    board[position.y][position.x].piece = createPiece({ ...piece, position })
  }
  return board
}

export const TEST_EXAMPLES: { kingInCheck: TestBoardArgs[] } = {
  kingInCheck: [
    {
      position: { x: 7, y: 7 },
      piece: {
        color: `white`,
        id: 1,
        type: `king`,
      },
    },
    {
      position: { x: 7, y: 0 },
      piece: {
        color: `black`,
        id: 1,
        type: `king`,
      },
    },
    {
      position: { x: 5, y: 7 },
      piece: {
        color: `black`,
        id: 1,
        type: `queen`,
      },
    },
    {
      position: { x: 2, y: 7 },
      piece: {
        color: `white`,
        id: 1,
        type: `rook`,
      },
    },
    {
      position: { x: 0, y: 7 },
      piece: {
        color: `white`,
        id: 1,
        type: `queen`,
      },
    },
  ],
}
