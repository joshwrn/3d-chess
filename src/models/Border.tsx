import type { FC } from 'react'

export const BorderMaterial: FC<
  JSX.IntrinsicElements[`meshPhysicalMaterial`]
> = ({ ...props }) => (
  <meshPhysicalMaterial
    reflectivity={3}
    color={`#c6c6c6`}
    emissive={`#323232`}
    metalness={0.8}
    roughness={0.7}
    envMapIntensity={0.15}
    clearcoat={1}
    clearcoatRoughness={0.1}
    attach="material"
    {...props}
  />
)

export const Border: FC = () => {
  return (
    <mesh
      onClick={(e) => e.stopPropagation()}
      receiveShadow
      position={[0, -0.35, 0]}
      rotation={[0, 0, 0]}
    >
      <boxBufferGeometry attach="geometry" args={[9, 0.5, 9]} />
      <BorderMaterial />
    </mesh>
  )
}
