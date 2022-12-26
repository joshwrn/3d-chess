import type { FC } from 'react'

import type {
  AnimationControls,
  TargetAndTransition,
  VariantLabels,
  Transition,
} from 'framer-motion'

import type { MovingTo } from '../../pages'
import type { Position } from '../logic/board'

export type ModelProps = JSX.IntrinsicElements[`group`] & {
  color: string
  isSelected: boolean
  canMoveHere: Position | null
  movingTo: MovingTo | null
  finishMovingPiece: () => void
  newTileHeight: number
}
export const PieceMaterial: FC<
  JSX.IntrinsicElements[`meshPhysicalMaterial`] & { isSelected: boolean }
> = ({ color, isSelected, ...props }) => (
  <meshPhysicalMaterial
    reflectivity={4}
    color={color === `white` ? `#d9d9d9` : `#5a5a5a`}
    emissive={isSelected ? `#733535` : color === `white` ? `#000000` : `#0c0c0c`}
    metalness={1}
    roughness={0.5}
    attach="material"
    envMapIntensity={0.2}
    clearcoat={1}
    clearcoatRoughness={0.1}
    {...props}
  />
)

export const FRAMER_MULTIPLIER = 6.66
export const getDistance = (px: number): number => px * FRAMER_MULTIPLIER

export const transitions: {
  select: Transition
  moveTo: Transition & { y: Transition }
} = {
  moveTo: {
    type: `spring`,
    stiffness: 200,
    damping: 30,
    y: { delay: 0.15, stiffness: 120, damping: 5 },
  },
  select: {
    type: `spring`,
  },
}

export type VariantReturns =
  | AnimationControls
  | TargetAndTransition
  | VariantLabels
  | boolean
export type VariantProps = {
  isSelected: boolean
  movingTo: MovingTo | null
  newTileHeight: number
}

export const variants: {
  select: (props: VariantProps) => VariantReturns
  move: (props: VariantProps) => VariantReturns
} = {
  select: ({ isSelected }: VariantProps) => ({
    x: isSelected ? 0 : 0,
    y: isSelected ? 1.4 : 0.5,
    z: isSelected ? 0 : 0,
  }),
  move: ({ movingTo, newTileHeight }: VariantProps) => ({
    x: getDistance(movingTo?.move.x ?? 0),
    y: [1.4, 1.6, getDistance(newTileHeight) + 0.5],
    z: getDistance(movingTo?.move.y ?? 0),
  }),
}
