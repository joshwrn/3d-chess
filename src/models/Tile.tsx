import type { FC } from 'react'

const getColor = (color: string, isSelected: boolean, canMoveTo: boolean) => {
  // if (isSelected && color === `white`) {
  //   return `#741818`
  // }
  // if (isSelected && color === `black`) {
  //   return `#371212`
  // }
  if (canMoveTo) {
    return `#ff0101`
  }
  if (canMoveTo && color === `black`) {
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

const getEmissive = (color: string, isSelected: boolean, canMoveTo: boolean) => {
  // if (isSelected && color === `white`) {
  //   return `#876060`
  // }
  // if (isSelected && color === `black`) {
  //   return `#371212`
  // }
  if (canMoveTo && color === `white`) {
    return `#ff0000`
  }
  if (canMoveTo && color === `black`) {
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
    canMoveTo: boolean
  }
> = ({ color, isSelected, ...props }) => (
  <meshPhysicalMaterial
    reflectivity={3}
    color={getColor(color as string, isSelected, props.canMoveTo)}
    emissive={getEmissive(color as string, isSelected, props.canMoveTo)}
    metalness={0.8}
    roughness={0.7}
    envMapIntensity={0.15}
    // clearcoat={1}
    // clearcoatRoughness={0.25}
    attach="material"
    {...props}
  />
)

export const TileComponent: FC<
  JSX.IntrinsicElements[`mesh`] & {
    canMoveTo: boolean
    color: string
    isSelected: boolean
  }
> = ({ color, canMoveTo, isSelected, ...props }) => {
  return (
    <mesh scale={[1, 0.5, 1]} receiveShadow castShadow {...props}>
      <boxGeometry />
      <TileMaterial
        color={color}
        isSelected={isSelected}
        canMoveTo={canMoveTo}
      />
      {isSelected && <pointLight intensity={0.15} color="red" />}
    </mesh>
  )
}
