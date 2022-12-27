import type { FC } from 'react'
import React from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Object001004: THREE.Mesh
  }
  materials: {
    [`Object001_mtl.003`]: THREE.MeshStandardMaterial
  }
}

export const KingComponent: FC = () => {
  const { nodes } = useGLTF(`/king.gltf`) as unknown as GLTFResult
  return <mesh attach="geometry" {...nodes.Object001004.geometry} />
}

useGLTF.preload(`/king.gltf`)
