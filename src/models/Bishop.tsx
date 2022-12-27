import type { FC } from 'react'
import React from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Object001002: THREE.Mesh
  }
  materials: {
    [`Object001_mtl.003`]: THREE.MeshStandardMaterial
  }
}

export const BishopComponent: FC = () => {
  const { nodes } = useGLTF(`/bishop.gltf`) as unknown as GLTFResult
  return <mesh attach="geometry" {...nodes.Object001002.geometry} />
}

useGLTF.preload(`/bishop.gltf`)
