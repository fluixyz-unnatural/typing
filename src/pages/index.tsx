import Link from 'next/link'
import Layout from '../components/Layout'
import Game from '../components/Game'

const IndexPage = () => (
  <Layout title="typing [WIP]">
    <h1>タイピング練習</h1>
    <Game />
    <div className="w-11/12 p-4">
      <h2 className={'text-xl'}>説明</h2>
      <p className={'m-2'}>
        10個のお題を打ち切る形式のタイピングゲームです。Google日本語入力と同様の入力が可能です。
      </p>
      <h2 className={'text-xl'}>スコア算出方法</h2>
      <p className={'m-2'}>
        (お題を最短の文字数で入力した場合の文字数 / 打ち切るのに掛かった時間)
        をスコアとしています。一般的なkpmと近い値になりますが、「し」をsiではなくshiと打つようなかさ増しができません。
      </p>
      <h2 className={'text-xl'}>リンク</h2>
      <ul>
        <li>
          @<a href="https://twitter.com/yoigara3">yoigara3</a>
        </li>
        <li>
          <a href="https://github.com/fluixyz-unnatural/typing">GitHub</a>
        </li>
      </ul>
    </div>
  </Layout>
)

export default IndexPage
