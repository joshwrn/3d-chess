import type { FC } from 'react'

import type { MovingTo } from '../../pages'

export type ModelProps = JSX.IntrinsicElements[`group`] & {
  color: string
  isSelected: boolean
  canMoveTo: boolean
  movingTo: MovingTo | null
  handleMove: () => void
  tileHeight: number
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
export const pxToDistance = (px: number): number => px * FRAMER_MULTIPLIER

export const transitions: any = {
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

export const variants: any = {
  select: ({ isSelected }: { isSelected: boolean }) => ({
    x: isSelected ? 0 : 0,
    y: isSelected ? 1.4 : 0.5,
    z: isSelected ? 0 : 0,
  }),
  move: ({
    movingTo,
    tileHeight,
  }: {
    movingTo: MovingTo
    tileHeight: number
  }) => ({
    x: pxToDistance(movingTo.move.x),
    y: [1.4, 1.6, pxToDistance(tileHeight) + 0.5],
    z: pxToDistance(movingTo.move.y),
  }),
}
