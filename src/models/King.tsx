/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.0.9 -t public/king.gltf
*/

import type { FC } from 'react'
import React from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

import type { ModelProps } from '.'
import { PieceMaterial } from '.'

type GLTFResult = GLTF & {
  nodes: {
    Object001004: THREE.Mesh
  }
  materials: {
    [`Object001_mtl.003`]: THREE.MeshStandardMaterial
  }
}

export const KingComponent: FC<ModelProps> = (props) => {
  const { nodes } = useGLTF(`/king.gltf`) as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Object001004.geometry}
        scale={0.03}
        position={[0, 3, 0]}
        castShadow
      >
        <PieceMaterial color={props.color} isSelected={props.isSelected} />
      </mesh>
    </group>
  )
}

useGLTF.preload(`/king.gltf`)