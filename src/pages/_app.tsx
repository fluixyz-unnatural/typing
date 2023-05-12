import Head from 'next/head'
import '../styles/global.css'
import 'tailwindcss/tailwind.css'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="タイピングゲーム" />
        <meta property="og:title" content="typing [WIP]" />
        <meta property="og:description" content="タイピングゲーム" />
        <meta
          property="og:image"
          content={`https://typing-seven-psi.vercel.app/s.png`}
        />
        <meta name="twitter:card" content="summary" />
        <meta property="og:locale" content="ja_JP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
