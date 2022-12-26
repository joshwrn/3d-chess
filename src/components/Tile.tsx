import type { FC } from 'react'

export const TileComponent: FC<
  JSX.IntrinsicElements[`mesh`] & {
    color: string
  }
> = ({ color, ...props }) => {
  return (
    <mesh {...props}>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
