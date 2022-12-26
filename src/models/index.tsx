import type { FC } from 'react'

export type ModelProps = JSX.IntrinsicElements[`group`] & {
  color: string
}
export const PieceMaterial: FC<
  JSX.IntrinsicElements[`meshPhysicalMaterial`]
> = ({ color, ...props }) => (
  <meshPhysicalMaterial
    reflectivity={4}
    color={color === `white` ? `#aaaaaa` : `#5a5a5a`}
    emissive={color === `white` ? `#323232` : `#0c0c0c`}
    metalness={1}
    roughness={0.5}
    attach="material"
    {...props}
  />
)
