import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import { css } from '@emotion/react'
import { useProgress } from '@react-three/drei'

export const Loader: FC = () => {
  return (
    <div
      css={css`
        position: absolute;
        z-index: 100;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        p {
          color: #fff;
        }
      `}
    >
      <p>Loading</p>
    </div>
  )
}
