import type { ReactElement } from 'react'

import type { AppProps } from 'next/app'
import '../styles/global.css'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return <Component {...pageProps} />
}
