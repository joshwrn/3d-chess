import type { FC } from 'react'

export type ModelProps = JSX.IntrinsicElements[`group`] & {
  color: string
  isSelected: boolean
}
export const PieceMaterial: FC<
  JSX.IntrinsicElements[`meshPhysicalMaterial`] & { isSelected: boolean }
> = ({ color, isSelected, ...props }) => (
  <meshPhysicalMaterial
    reflectivity={4}
    color={color === `white` ? `#aaaaaa` : `#5a5a5a`}
    emissive={isSelected ? `#733535` : color === `white` ? `#323232` : `#0c0c0c`}
    metalness={1}
    roughness={0.5}
    attach="material"
    envMapIntensity={0.2}
    clearcoat={1}
    clearcoatRoughness={0.1}
    {...props}
  />
)
