import { useEffect, useRef, useState } from 'react'
import RomajiInput from './RomajiInput'

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
        <KeyIcon width="100" label={''} active={props.input.includes('BACKSPACE')} />
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
        <KeyIcon width="232" label={''} active={props.input.includes('SHIFT')} />
        {keys[3].split('').map((key) => (
          <KeyIcon
            width="100"
            key={key}
            label={key}
            active={props.input.includes(key)}
          />
        ))}
        <KeyIcon width="168" label={''} active={props.input.includes('SHIFT')} />
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

function TextDisplay() {
  return (
    <div>
      <p>お題漢字</p>
      <p>おだいひらがな</p>
      <p>odai ro-maji</p>
    </div>
  )
}

export default function Game() {
  const [input, setInput] = useState([])
  const inputRef = useRef(input)
  useEffect(()=>{
    inputRef.current = input
  },[input])
  const alphabet = 'KONOSEKAINIMIRAINOGIJUTUWODENZYUSURU'
  const handleInput = (key: string) => {
    console.log(key.length, [key.toUpperCase()])
    setInput([...input,key.toUpperCase()])
    setTimeout(()=>{
      console.log('setTimeout', JSON.stringify(inputRef.current))
      setInput(inputRef.current.splice(1))
    },250)
  }
  return (
    <div>
      <TextDisplay />
      <RomajiInput handleInput={handleInput} />
      <KeyBoardDisplay input={input} />
    </div>
  )
}
