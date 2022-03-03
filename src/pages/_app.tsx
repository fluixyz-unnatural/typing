import Head from 'next/head'
import '../styles/global.css'
import 'tailwindcss/tailwind.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head></Head>
      <Component {...pageProps} />
    </>
  )
}
