import React, { useRef } from 'react'
import type { FC } from 'react'

import type {
  AnimationControls,
  TargetAndTransition,
  VariantLabels,
  Transition,
} from 'framer-motion'
import { motion } from 'framer-motion-3d'

import type { MovingTo } from '../../pages'
import type { Position } from '../logic/board'

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
    opacity={1}
    transparent={true}
    {...props}
  />
)

export type ModelProps = JSX.IntrinsicElements[`group`] & {
  color: string
  isSelected: boolean
  canMoveHere: Position | null
  movingTo: MovingTo | null
  finishMovingPiece: () => void
  newTileHeight: number
  pieceIsBeingReplaced: boolean
  wasSelected: boolean
}

export const MeshWrapper: FC<ModelProps> = ({
  movingTo,
  finishMovingPiece,
  newTileHeight,
  isSelected,
  children,
  pieceIsBeingReplaced,
  wasSelected,
  ...props
}) => {
  const ref = useRef(null)
  const meshRef = useRef(null)
  return (
    <group ref={ref} {...props} dispose={null} castShadow>
      <motion.mesh
        ref={meshRef}
        scale={0.03}
        castShadow
        receiveShadow
        initial={false}
        animate={
          movingTo
            ? variants.move({ movingTo, newTileHeight, isSelected })
            : pieceIsBeingReplaced
            ? variants.replace({ movingTo, newTileHeight, isSelected })
            : isSelected
            ? variants.select({ movingTo, newTileHeight, isSelected })
            : variants.initial({ movingTo, newTileHeight, isSelected })
        }
        transition={
          movingTo
            ? transitions.moveTo
            : pieceIsBeingReplaced
            ? transitions.replace
            : isSelected
            ? transitions.select
            : wasSelected
            ? transitions.wasSelected
            : transitions.initial
        }
        onAnimationComplete={() => {
          if (movingTo) {
            finishMovingPiece()
          }
        }}
      >
        {children}
        <PieceMaterial color={props.color} isSelected={isSelected} />
      </motion.mesh>
    </group>
  )
}

export const FRAMER_MULTIPLIER = 6.66
export const getDistance = (px?: number): number =>
  px ? px * FRAMER_MULTIPLIER : 0

export const transitions: {
  select: Transition
  moveTo: Transition & { y: Transition }
  initial: Transition
  replace: Transition
  wasSelected: Transition
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
  replace: {
    type: `spring`,
    stiffness: 50,
    damping: 5,
  },
  initial: {
    duration: 0,
  },
  wasSelected: {
    type: `spring`,
    duration: 0.5,
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

type VariantFunction = (props: VariantProps) => VariantReturns
export const variants: {
  select: VariantFunction
  move: VariantFunction
  replace: VariantFunction
  initial: VariantFunction
} = {
  initial: () => ({
    x: 0,
  }),
  select: ({ isSelected }: VariantProps) => ({
    x: 0,
    y: isSelected ? 1.4 : 0,
    z: 0,
  }),
  move: ({ movingTo, newTileHeight }: VariantProps) => ({
    x: getDistance(movingTo?.move.x),
    y: [1.4, 1.6, getDistance(newTileHeight)],
    z: getDistance(movingTo?.move.y),
  }),
  replace: () => ({
    y: 100,
    x: 0,
    z: 0,
  }),
}
