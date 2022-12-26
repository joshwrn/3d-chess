import type { FC } from 'react'

import { MeshReflectorMaterial } from '@react-three/drei'

export const Reflection: FC = () => {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 30]}
        resolution={2048}
        mixBlur={1}
        mixStrength={80}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        metalness={0.8}
        mirror={0.8}
      />
    </mesh>
  )
}
