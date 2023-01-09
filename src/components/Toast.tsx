import type { FC } from 'react'
import React from 'react'

import { ToastContainer, toast } from 'react-toastify'

export const Toast: FC = () => {
  return (
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  )
}
