import type { FC } from 'react'

import { Html, Text } from '@react-three/drei'

import { useOpponentState } from '@/state/player'

export const Opponent: FC = () => {
  const handleClick = () => {
    console.log(`click`)
  }
  const { position, rotation } = useOpponentState((state) => state)
  return (
    <group position={position} rotation={rotation}>
      <Html
        style={{
          width: `100px`,
          height: `100px`,
          borderRadius: `50%`,
          display: `flex`,
          justifyContent: `center`,
          alignItems: `center`,
          color: `white`,
          fontSize: `16px`,
          userSelect: `none`,
        }}
        center
        occlude={true}
        prepend={true}
        position={[0, 1.2, 0]}
      >
        josh
      </Html>
      <mesh position={[0, 0, 0]} onClick={handleClick}>
        <sphereGeometry args={[0.5, 50, 10]} />
        <meshStandardMaterial metalness={1} roughness={0.4} color="#ffffff" />
      </mesh>
    </group>
  )
}
