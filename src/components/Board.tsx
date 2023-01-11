import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import type { Position, Tile, Board } from '@logic/board'
import { checkIfPositionsMatch, copyBoard } from '@logic/board'
import type { Move, Piece } from '@logic/pieces'
import {
  createId,
  getTile,
  detectGameOver,
  oppositeColor,
  shouldPromotePawn,
  checkIfSelectedPieceCanMoveHere,
  movesForPiece,
} from '@logic/pieces'
import { isPawn } from '@logic/pieces/pawn'
import { BishopComponent } from '@models/Bishop'
import type { ModelProps } from '@models/index'
import { MeshWrapper } from '@models/index'
import { KingComponent } from '@models/King'
import { KnightComponent } from '@models/Knight'
import { PawnModel } from '@models/Pawn'
import { QueenComponent } from '@models/Queen'
import { RookComponent } from '@models/Rook'
import { TileComponent } from '@models/Tile'
import { useSpring, animated } from '@react-spring/three'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

import { isKing } from '@/logic/pieces/king'
import { isRook } from '@/logic/pieces/rook'
import type { GameOver } from '@/pages/index'
import type { CameraMove } from '@/server/cameraMove'
import { useGameSettingsState } from '@/state/game'
import { useHistoryState } from '@/state/history'
import { usePlayerState } from '@/state/player'
import { isDev } from '@/utils/isDev'
import { useSocketState } from '@/utils/socket'

type ThreeMouseEvent = {
  stopPropagation: () => void
}

export type MovingTo = {
  move: Move
  tile: Tile
}
export type MakeMoveClient = {
  movingTo: MovingTo
  room: string
}

export const BoardComponent: FC<{
  selected: Piece | null
  setSelected: (piece: Piece | null) => void
  board: Board
  setBoard: React.Dispatch<React.SetStateAction<Board>>
  moves: Move[]
  setGameOver: (gameOver: GameOver | null) => void
  setMoves: (moves: Move[]) => void
}> = ({
  selected,
  setSelected,
  board,
  setBoard,
  moves,
  setMoves,
  setGameOver,
}) => {
  const [lastSelected, setLastSelected] = useState<Tile | null>(null)
  const [history, setHistory] = useHistoryState((state) => [
    state.history,
    state.addItem,
  ])
  const { playerColor, room } = usePlayerState((state) => ({
    playerColor: state.playerColor,
    room: state.room,
  }))
  const [turn, setTurn, gameStarted, movingTo, setMovingTo] =
    useGameSettingsState((state) => [
      state.turn,
      state.setTurn,
      state.gameStarted,
      state.movingTo,
      state.setMovingTo,
    ])
  const socket = useSocketState((state) => state.socket)

  const [redLightPosition, setRedLightPosition] = useState<Position>({
    x: 0,
    y: 0,
  })

  const selectThisPiece = (e: ThreeMouseEvent, tile: Tile | null) => {
    e.stopPropagation()
    const isPlayersTurn = turn === playerColor || isDev
    if (!isPlayersTurn || !gameStarted) return
    if (!tile?.piece?.type && !selected) return
    if (!tile?.piece) {
      setSelected(null)
      return
    }

    setMovingTo(null)
    setMoves(
      movesForPiece({ piece: tile.piece, board, propagateDetectCheck: true }),
    )
    setSelected(tile.piece)
    setLastSelected(tile)
    setRedLightPosition(tile.position)
  }

  const finishMovingPiece = (tile: Tile | null) => {
    if (!tile || !movingTo || !socket) return
    const newHistoryItem = {
      board: copyBoard(board),
      to: movingTo.move.newPosition,
      from: movingTo.move.piece.position,
      steps: movingTo.move.steps,
      capture: movingTo.move.capture,
      type: movingTo.move.type,
      piece: movingTo.move.piece,
    }
    setHistory(newHistoryItem)
    setBoard((prev) => {
      const newBoard = copyBoard(prev)
      if (!movingTo.move.piece) return prev
      const selectedTile = getTile(newBoard, movingTo.move.piece.position)
      const tileToMoveTo = getTile(newBoard, tile.position)
      if (!selectedTile || !tileToMoveTo) return prev

      if (
        isPawn(selectedTile.piece) ||
        isKing(selectedTile.piece) ||
        isRook(selectedTile.piece)
      ) {
        selectedTile.piece = { ...selectedTile.piece, hasMoved: true }
      }
      if (isPawn(selectedTile.piece) && shouldPromotePawn({ tile })) {
        selectedTile.piece.type = `queen`
        selectedTile.piece.id = selectedTile.piece.id + 1
      }

      if (
        isPawn(selectedTile.piece) &&
        movingTo.move.type === `captureEnPassant`
      ) {
        const latestMove = history[history.length - 1]
        const enPassantTile = newBoard[latestMove.to.y][latestMove.to.x]
        enPassantTile.piece = null
      }

      if (movingTo.move.castling) {
        const rookTile =
          newBoard[movingTo.move.castling.rook.position.y][
            movingTo.move.castling.rook.position.x
          ]
        const rookTileToMoveTo =
          newBoard[movingTo.move.castling.rookNewPosition.y][
            movingTo.move.castling.rookNewPosition.x
          ]
        if (!isRook(rookTile.piece)) return prev

        rookTileToMoveTo.piece = {
          ...rookTile.piece,
          hasMoved: true,
          position: rookTileToMoveTo.position,
        }
        rookTile.piece = null
      }

      tileToMoveTo.piece = selectedTile.piece
        ? { ...selectedTile.piece, position: tile.position }
        : null
      selectedTile.piece = null
      return newBoard
    })

    setTurn()

    setMovingTo(null)
    setMoves([])
    setSelected(null)
    setLastSelected(null)
  }

  useEffect(() => {
    const gameOverType = detectGameOver(board, turn)
    if (gameOverType) {
      setGameOver({ type: gameOverType, winner: oppositeColor(turn) })
    }
  }, [board, turn])

  const startMovingPiece = (e: ThreeMouseEvent, tile: Tile, nextTile: Move) => {
    e.stopPropagation()
    if (!socket) return
    const newMovingTo: MovingTo = {
      move: nextTile,
      tile: tile,
    }
    const makeMove: MakeMoveClient = {
      movingTo: newMovingTo,
      room: room,
    }
    socket.emit(`makeMove`, makeMove)
  }

  const { intensity } = useSpring({
    intensity: selected ? 0.35 : 0,
  })

  const { camera } = useThree()

  useEffect(() => {
    const interval = setInterval(() => {
      const { x, y, z } = camera.position
      socket?.emit(`cameraMove`, {
        position: [x, y, z],
        room: room,
        color: playerColor,
      } satisfies CameraMove)
    }, 1000)
    return () => clearInterval(interval)
  }, [camera.position, socket, room, playerColor])

  return (
    <group position={[-3.5, -0.5, -3.5]}>
      <OrbitControls
        maxDistance={25}
        minDistance={7}
        enableZoom={true}
        enablePan={false}
      />
      <pointLight
        shadow-mapSize={[2048, 2048]}
        castShadow
        position={[3.5, 10, 3.5]}
        intensity={0.65}
        color="#ffe0ec"
      />
      <hemisphereLight intensity={0.5} color="#ffa4a4" groundColor="#d886b7" />
      {/* @ts-ignore */}
      <animated.pointLight
        intensity={intensity}
        color="red"
        position={[redLightPosition.x, 1, redLightPosition.y]}
      />
      {board.map((row, i) => {
        return row.map((tile, j) => {
          const bg = `${(i + j) % 2 === 0 ? `white` : `black`}`
          const isSelected =
            tile.piece && selected?.getId() === tile.piece.getId()

          const canMoveHere = checkIfSelectedPieceCanMoveHere({
            tile,
            moves,
            selected,
          })

          const tileId = tile.piece?.getId()
          const pieceIsBeingReplaced =
            movingTo?.move.piece && tile.piece && movingTo?.move.capture
              ? tileId === createId(movingTo?.move.capture)
              : false
          const rookCastled = movingTo?.move.castling?.rook
          const isBeingCastled =
            rookCastled && createId(rookCastled) === tile.piece?.getId()

          const handleClick = (e: ThreeMouseEvent) => {
            if (movingTo) {
              return
            }

            const tileContainsOtherPlayersPiece =
              tile.piece && tile.piece?.color !== turn

            if (tileContainsOtherPlayersPiece && !canMoveHere && !isDev) {
              setSelected(null)
              return
            }

            canMoveHere
              ? startMovingPiece(e, tile, canMoveHere)
              : selectThisPiece(e, tile)
          }

          const props: ModelProps = {
            position: [j, 0.5, i],
            scale: [0.15, 0.15, 0.15],
            color: tile.piece?.color || `white`,
            onClick: handleClick,
            isSelected: isSelected ? true : false,
            wasSelected: lastSelected
              ? lastSelected?.piece?.getId() === tile.piece?.getId()
              : false,
            canMoveHere: canMoveHere?.newPosition ?? null,
            movingTo:
              checkIfPositionsMatch(
                tile.position,
                movingTo?.move.piece?.position,
              ) && movingTo
                ? movingTo.move.steps
                : isBeingCastled
                ? movingTo.move.castling?.rookSteps ?? null
                : null,
            pieceIsBeingReplaced: pieceIsBeingReplaced ? true : false,
            finishMovingPiece: () =>
              isBeingCastled ? null : finishMovingPiece(movingTo?.tile ?? null),
          }

          const pieceId = tile.piece?.getId() ?? `empty-${j}-${i}`

          return (
            <group key={`${j}-${i}`}>
              <TileComponent
                color={bg}
                position={[j, 0.25, i]}
                onClick={handleClick}
                canMoveHere={canMoveHere?.newPosition ?? null}
              />
              <MeshWrapper key={pieceId} {...props}>
                {tile.piece?.type === `pawn` && <PawnModel />}
                {tile.piece?.type === `rook` && <RookComponent />}
                {tile.piece?.type === `knight` && <KnightComponent />}
                {tile.piece?.type === `bishop` && <BishopComponent />}
                {tile.piece?.type === `queen` && <QueenComponent />}
                {tile.piece?.type === `king` && <KingComponent />}
              </MeshWrapper>
            </group>
          )
        })
      })}
    </group>
  )
}
