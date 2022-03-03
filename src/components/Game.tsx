import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import RomajiInput from './RomajiInput'
import { Odai, theme1 } from '../utils/odai'
import { optKey } from '../utils/optRoman'
import Image from 'next/image'
import { ranks } from '../utils/rank'
import S from '../assets/s.png'

interface KeyIconProps {
  label: string
  active: boolean
  width:
    | '100'
    | '125'
    | 'misc'
    | '150'
    | '168'
    | '175'
    | '200'
    | '225'
    | '232'
    | 'space'
}

function KeyIcon(props: KeyIconProps) {
  return (
    <div
      className={
        'key-icon ' +
        `key-${props.width} ` +
        (props.active ? `key-icon-active` : ``)
      }
    >
      {props.label}
    </div>
  )
}

interface KeyBoardDisplayProps {
  input: Array<string>
}

function KeyBoardDisplay(props: KeyBoardDisplayProps) {
  const keys: Array<string> = [
    '1234567890-^\\',
    'QWERTYUIOP@[',
    'ASDFGHJKL;:]',
    'ZXCVBNM,./\\',
  ]
  return (
    <div className={'keyboard'}>
      <div className={'keyboard-row'}>
        <KeyIcon width="100" label={'♥'} active={false} />
        {keys[0].split('').map((key) => (
          <KeyIcon
            width="100"
            key={key}
            label={key}
            active={props.input.includes(key)}
          />
        ))}
        <KeyIcon
          width="100"
          label={''}
          active={props.input.includes('BACKSPACE')}
        />
      </div>

      <div className={'keyboard-row'}>
        <KeyIcon width="150" label={''} active={false} />
        {keys[1].split('').map((key) => (
          <KeyIcon
            width="100"
            key={key}
            label={key}
            active={props.input.includes(key)}
          />
        ))}
        <KeyIcon width="150" label={''} active={false} />
      </div>
      <div className={'keyboard-row'}>
        <KeyIcon width="175" label={''} active={false} />
        {keys[2].split('').map((key) => (
          <KeyIcon
            width="100"
            key={key}
            label={key}
            active={props.input.includes(key)}
          />
        ))}
        <KeyIcon width="125" label={''} active={false} />
      </div>
      <div className={'keyboard-row'}>
        <KeyIcon
          width="232"
          label={''}
          active={props.input.includes('SHIFT')}
        />
        {keys[3].split('').map((key) => (
          <KeyIcon
            width="100"
            key={key}
            label={key}
            active={props.input.includes(key)}
          />
        ))}
        <KeyIcon
          width="168"
          label={''}
          active={props.input.includes('SHIFT')}
        />
      </div>
      <div className={'keyboard-row'}>
        <KeyIcon width="misc" label={''} active={false} />
        <KeyIcon width="100" label={''} active={false} />
        <KeyIcon width="misc" label={''} active={false} />
        <KeyIcon width="misc" label={''} active={false} />
        <KeyIcon width="space" label={''} active={props.input.includes(' ')} />
        <KeyIcon width="misc" label={''} active={false} />
        <KeyIcon width="misc" label={''} active={false} />
        <KeyIcon width="misc" label={''} active={false} />
        <KeyIcon width="100" label={''} active={false} />
        <KeyIcon width="misc" label={''} active={false} />
      </div>
    </div>
  )
}

const randomSelect = (arr: Array<Odai>, num): Array<Odai> => {
  const ans = []
  arr = JSON.parse(JSON.stringify(arr))
  for (let i = 0; i < num; i++) {
    const rnd = Math.floor(Math.random() * arr.length)
    ans.push(arr[rnd])
    arr.splice(rnd, 1)
  }
  return ans
}

interface ParamProps {
  label: string
  param: string
  unit: string
}

const Param = (props: ParamProps) => {
  return (
    <div className={'flex place-content-between items-end border-b-2'}>
      <div className={'text-md'}>{props.label}</div>
      <div className="flex items-end space-x-1">
        <div className={'text-xl'}>{props.param}</div>
        <div className={'text-md'}>{props.unit}</div>
      </div>
    </div>
  )
}

interface ResultProps {
  odais: Array<Odai>
  result: {
    dur: number
    err: number
    real: string
  }
  replay: () => void
}

const ResultModal = (props: ResultProps) => {
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
  const handleKey: any = (e: KeyboardEvent) => {
    if (e.key === 'r') {
      props.replay()
    }
    if (e.key === 't') {
      window.open(tweet)
    }
  }
  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
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
            <img className={'w-32 h-32 m-auto mt-12'} src={S.src} />
            <h4 className={'text-center mt-4'}>ランク：{rank}</h4>
          </div>

          <div className="flex flex-col w-64 space-y-4 p-4">
            <Param label="スコア" param={`${score}`} unit="pt" />
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

const count = 20

type State = 'onGame' | 'waiting' | 'result'

export default function Game() {
  const [input, setInput] = useState([])
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(input)
  const [state, setState] = useState('waiting' as State)
  const [odais, setOdais] = useState(randomSelect(theme1, count))
  useEffect(() => {
    setOdais(randomSelect(theme1, count))
  }, [])
  const [startTime, setStartTime] = useState(0)
  const clearBufferRef: any = useRef()
  const [result, setResult] = useState({ dur: -1, err: 0, real: '' })
  useEffect(() => {
    inputRef.current = input
  }, [input])
  const gameStart = () => {
    setState('onGame')
    setStartTime(performance.now())
  }
  const gameReset = () => {
    setInput([])
    setCursor(0)
    setState('waiting')
    setResult({ dur: -1, err: 0, real: '' })
    if (clearBufferRef.current) clearBufferRef.current()
    setOdais(randomSelect(theme1, count))
  }
  const handleInput = (key: string) => {
    if (state === 'waiting') {
      gameStart()
    }
    setInput([...input, key.toUpperCase()])
    setTimeout(() => {
      setInput(inputRef.current.splice(1))
    }, 250)
  }
  const handleClear = (fin: string, err: number) => {
    console.log(fin, err)
    const tmp = result
    tmp.real += fin
    setResult(tmp)
    if (cursor + 1 < odais.length) setCursor(cursor + 1)
    else {
      const duration = (performance.now() - startTime) / 1000
      setState('result')
      const tmp = result
      tmp.dur = duration
      tmp.err = err
      setResult(tmp)
    }
  }
  const handleKeydown: any = (e: KeyboardEvent) => {
    if (e.key === 'Escape') gameReset()
  }
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])
  return (
    <div className="game-container">
      <div>
        <p className={'time'}>
          {cursor + 1}/{count}
        </p>
        <p>{state}</p>
      </div>
      <RomajiInput
        clearBuffer={clearBufferRef}
        odai={odais[cursor]}
        handleClear={handleClear}
        handleInput={handleInput}
      />
      <div suppressHydrationWarning>
        <span className="border-l-2 my-4 ml-8 pl-1 inline-block text-md">
          次：
        </span>
        {cursor + 1 < odais.length ? odais[cursor + 1].view : ''}
      </div>
      <KeyBoardDisplay input={input} />
      {state === 'result' ? (
        <ResultModal replay={gameReset} odais={odais} result={result} />
      ) : (
        <></>
      )}
      <button onClick={gameReset}>reset</button>
    </div>
  )
}
