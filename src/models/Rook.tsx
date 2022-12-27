import type { FC } from 'react'
import React, { useRef } from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Object001001: THREE.Mesh
  }
  materials: {
    [`Object001_mtl.003`]: THREE.MeshStandardMaterial
  }
}

export const RookComponent: FC = () => {
  const ref = useRef(null)
  const { nodes } = useGLTF(`/rook.gltf`) as unknown as GLTFResult
  return <mesh ref={ref} attach="geometry" {...nodes.Object001001.geometry} />
}

useGLTF.preload(`/rook.gltf`)
