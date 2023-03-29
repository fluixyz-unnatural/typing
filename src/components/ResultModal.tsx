import { useEffect, useState } from 'react'
import { Odai } from '../misc/odai'
import { ranks } from '../misc/rank'
import { optKey } from '../misc/optRoman'

interface ResultProps {
  odais: Array<Odai>
  result: {
    dur: number
    err: number
    real: string
  }
  replay: () => void
}
export const ResultModal = (props: ResultProps) => {
  const [isHighscore, setIsHighscore] = useState(false)
  const theoricalKeys =
    props.odais.reduce(
      (prev, val, index) => prev + optKey(val.kana).length,
      0
    ) - 1
  const score = Math.round((theoricalKeys / props.result.dur) * 60)
  const link = location.href
  const rank = ranks[Math.min(Math.floor(score / 50), ranks.length - 1)]
  const text = encodeURIComponent(`rank: ${rank}\nscore: ${score}\n`)
  const tweet = `https://twitter.com/share?url=${link}&text=${text}&hashtags=yeah,ph,ah`
  const handleKey = (ev: KeyboardEvent) => {
    if (ev.key === 'r') {
      props.replay()
    }
    if (ev.key === 't') {
      window.open(tweet)
    }
  }
  useEffect(() => {
    const lsItem = localStorage.getItem('highscore')
    let highscore = lsItem ? JSON.parse(lsItem) : undefined
    if (highscore && score > highscore.score) {
      setIsHighscore(true)
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      if (!highscore || score > highscore.score) {
        localStorage.setItem(
          'highscore',
          JSON.stringify({ score: score, date: Date.now() })
        )
      }
    }
  }, [])
  return props.result.dur > 0 ? (
    <div className="result-modal absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm font-zenmaru">
      <div className="result-container">
        <h3
          className={
            'text-xl mt-12 mb-4 text-center border-b-2 w-fit px-1 pb-1 m-auto border-indigo-300'
          }
        >
          Result
        </h3>
        <div className={'flex place-content-between w-8/12 m-auto'}>
          <div className={'w-64 h-64'}>
            <img className={'w-32 h-32 m-auto mt-12'} src={'/s.png'} />
            <h4 className={'text-center mt-4'}>ランク：{rank}</h4>
          </div>

          <div className="flex flex-col w-64 space-y-4 p-4">
            <div className={isHighscore ? 'highscore-label' : ''}>
              <Param label="スコア" param={`${score}`} unit="pt" />
            </div>
            <Param
              label="打鍵数"
              param={`${props.result.real.length}`}
              unit="key"
            />
            <Param label="ミス" param={`${props.result.err}`} unit="key" />
            <Param
              label="打鍵/秒"
              unit="key/sec"
              param={`${
                Math.round((props.result.real.length / props.result.dur) * 10) /
                10
              }`}
            />
            <Param
              label="入力時間"
              unit="sec"
              param={`${Math.round(props.result.dur * 10) / 10}`}
            />
          </div>
        </div>
        <div className={'flex place-content-between mx-64 my-8'}>
          <button
            className="bg-gray-400 text-white w-24 py-2"
            onClick={props.replay}
          >
            (R) もう一度
          </button>
          <a
            href={tweet}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-400 w-24 py-2 text-white text-center"
          >
            (T) Tweet
          </a>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

interface ParamProps {
  label: string
  param: string
  unit: string
}

const Param = ({ label, param, unit }: ParamProps) => {
  return (
    <div className={'flex place-content-between items-end border-b-2'}>
      <div className={'text-md'}>{label}</div>
      <div className="flex items-end space-x-1">
        <div className={'text-xl'}>{param}</div>
        <div className={'text-md'}>{unit}</div>
      </div>
    </div>
  )
}
