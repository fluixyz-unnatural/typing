import { useEffect, useRef, useState } from 'react'
import RomajiInput from './RomajiInput'
import { Odai, theme1 } from '../utils/odai'

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

const randomSelect = (arr: Array<Odai>, num) => {
  const ans = []
  arr = JSON.parse(JSON.stringify(arr))
  for (let i = 0; i < num; i++) {
    const rnd = Math.floor(Math.random() * arr.length)
    ans.push(arr[rnd])
    arr.splice(rnd, 1)
  }
  return ans
}

const ResultModal = () => {
  return <div></div>
}

const count = 5

export default function Game() {
  const [input, setInput] = useState([])
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(input)
  const [onGame, setOnGame] = useState(false)
  const odais = useRef(randomSelect(theme1, count))
  const [startTime, setStartTime] = useState(0)
  useEffect(() => {
    inputRef.current = input
  }, [input])
  const gameStart = () => {
    setOnGame(true)
    setStartTime(performance.now())
  }
  const gameSet = () => {
    const duration = ((performance.now()-startTime)/1000)
    alert(duration)
  }
  const gameReset = () => {}
  const handleInput = (key: string) => {
    if (!onGame) gameStart()
    setInput([...input, key.toUpperCase()])
    setTimeout(() => {
      setInput(inputRef.current.splice(1))
    }, 250)
  }
  const handleClear = () => {
    if (cursor + 1 < odais.current.length) setCursor(cursor + 1)
    else {
      gameSet()
    }
  }
  return (
    <div className="game-container">
      <div>
        <p className={'time'}>
          {cursor + 1}/{count}
        </p>
        <p>{onGame ? 'playing' : '...'}</p>
      </div>
      <RomajiInput
        odai={odais.current[cursor]}
        handleClear={handleClear}
        handleInput={handleInput}
      />
      <div suppressHydrationWarning>
        次　：
        {cursor + 1 < odais.current.length
          ? odais.current[cursor + 1].view
          : ''}
      </div>
      <KeyBoardDisplay input={input} />
    </div>
  )
}
