import type { ReactElement } from 'react'

import { Provider } from 'jotai'
import type { AppProps } from 'next/app'
import '../src/styles/global.css'

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}
