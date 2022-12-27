import type { FC } from 'react'

import { useSpring, animated } from '@react-spring/three'

import type { Position } from '../logic/board'

const getColor = (color: string, isSelected: boolean, canMoveHere: boolean) => {
  // if (isSelected && color === `white`) {
  //   return `#741818`
  // }
  // if (isSelected && color === `black`) {
  //   return `#371212`
  // }
  if (canMoveHere) {
    return `#ff0101`
  }
  if (canMoveHere && color === `black`) {
    return `#b42727`
  }
  if (color === `white`) {
    return `#aaaaaa`
  }
  if (color === `black`) {
    return `#5a5a5a`
  }
  return `purple`
}

const getEmissive = (
  color: string,
  isSelected: boolean,
  canMoveHere: boolean,
) => {
  // if (isSelected && color === `white`) {
  //   return `#876060`
  // }
  // if (isSelected && color === `black`) {
  //   return `#371212`
  // }
  if (canMoveHere && color === `white`) {
    return `#ff0000`
  }
  if (canMoveHere && color === `black`) {
    return `#c50000`
  }
  if (color === `white`) {
    return `#323232`
  }
  if (color === `black`) {
    return `#0c0c0c`
  }
  return `pink`
}

export const TileMaterial: FC<
  JSX.IntrinsicElements[`meshPhysicalMaterial`] & {
    isSelected: boolean
    canMoveHere: Position | null
  }
> = ({ color, canMoveHere, isSelected, ...props }) => {
  const { tileColor, emissiveColor } = useSpring({
    tileColor: getColor(color as string, isSelected, !!canMoveHere),
    emissiveColor: getEmissive(color as string, isSelected, !!canMoveHere),
  })
  return (
    <>
      {/* @ts-ignore */}
      <animated.meshPhysicalMaterial
        reflectivity={3}
        color={tileColor}
        emissive={emissiveColor}
        metalness={0.8}
        roughness={0.7}
        envMapIntensity={0.15}
        attach="material"
        {...props}
      />
    </>
  )
}

export const TileComponent: FC<
  JSX.IntrinsicElements[`mesh`] & {
    canMoveHere: Position | null
    color: string
    isSelected: boolean
  }
> = ({ color, canMoveHere, isSelected, ...props }) => {
  const { intensity } = useSpring({
    intensity: isSelected ? 0.15 : 0,
  })
  return (
    <mesh scale={[1, 0.5, 1]} receiveShadow castShadow {...props}>
      <boxGeometry />
      <TileMaterial
        color={color}
        isSelected={isSelected}
        canMoveHere={canMoveHere}
      />
      {/* @ts-ignore */}
      <animated.pointLight intensity={intensity} color="red" />
    </mesh>
  )
}
