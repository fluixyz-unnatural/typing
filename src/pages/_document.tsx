import { Html, Head, Main, NextScript } from 'next/document'
import { fontText } from '../misc/odai'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={'anonymous'}
        />
        <link
          href={`https://fonts.googleapis.com/css2?family=Varela+Round&family=Zen+Maru+Gothic&text=${
            encodeURIComponent(String(fontText)) + 'お題入力次：'
          }:wght@300;700&display=swap`}
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2&family=Noto+Serif+JP:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
