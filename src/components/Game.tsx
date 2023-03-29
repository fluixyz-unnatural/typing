import { useEffect, useRef, useState } from 'react'
import RomajiInput from './RomajiInput'
import { Odai, theme1 } from '../misc/odai'
import { ResultModal } from './ResultModal'

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
        {/* 最上段 */}
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
      {/* 上段 */}
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
      {/* 中段 */}
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
      {/* 下段 */}
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
      {/* 最下段（飾り） */}
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

const randomSelect = (arr: Readonly<Odai[]>, num: number): Array<Odai> => {
  const ans = []
  let arr2 = JSON.parse(JSON.stringify(arr))
  for (let i = 0; i < num; i++) {
    const rnd = Math.floor(Math.random() * arr2.length)
    ans.push(arr2[rnd])
    arr2.splice(rnd, 1)
  }
  return ans
}

const count = 10

type State = 'onGame' | 'waiting' | 'result'

export default function Game() {
  const [input, setInput] = useState<string[]>([])
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(input)
  const [state, setState] = useState('waiting' as State)
  const [odais, setOdais] = useState(randomSelect(theme1, count))

  useEffect(() => {
    setOdais(randomSelect(theme1, count))
  }, [])
  const [startTime, setStartTime] = useState(0)
  const clearBufferRef = useRef<() => void>(() => {})
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
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') gameReset()
  }
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])
  return (
    <div className={`game-container rollover rollover-${input.length}`}>
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
