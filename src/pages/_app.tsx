import Head from 'next/head'
import '../styles/global.css'
import 'tailwindcss/tailwind.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="ミスしたときにBackspaceを使わなければいけないローマ字入力タイピングゲーム"
        />
        <meta property="og:title" content="ページのタイトル" />
        <meta
          property="og:description"
          content="ミスしたときにBackspaceを使わなければいけないローマ字入力タイピングゲーム"
        />
        <meta property="og:image" content="画像のURL" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@yoigara3" />
        <meta property="og:site_name" content="サイト名" />
        <meta property="og:locale" content="ja_JP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
