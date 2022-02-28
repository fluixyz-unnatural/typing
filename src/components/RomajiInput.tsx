import { useEffect, useState, useRef } from 'react'
import {
  InvertedRomajiTable,
  romajiTable,
  consonants,
  invertedConsonantsTable,
} from '../utils/romaji'

interface Props {
  handleInput: (key: string) => void
}

export default function RomajiInput(props: Props) {
  const [buffer, setBuffer] = useState([] as Array<string>)
  const bufferRef = useRef(buffer)
  const [cursor, setCursor] = useState(0)
  const [error, setError] = useState(false)
  const [fin, setFin] = useState('')

  const odai = 'んあっあっあっ'
  useEffect(() => {
    // イベントリスナーから呼ぶための
    bufferRef.current = buffer
  }, [buffer])

  // 変換 & 誤入力チェック
  useEffect(() => {
    // 入力バッファ0
    if (buffer.length < 1) {
      setError(false)
      return
    }
    if (!odai[cursor]) return
    // 入力対象1文字
    let target1 = odai[cursor]
    let convertTable: Array<string> = InvertedRomajiTable[target1]
    // 入力対象2文字
    let target2 = null
    if (odai.length > cursor) {
      target2 = odai[cursor] + odai[cursor + 1]
      if (Object.keys(InvertedRomajiTable).includes(target2))
        convertTable = convertTable.concat(InvertedRomajiTable[target2])
    }
    // 入力バッファを string[] から stringに
    const input = buffer.join().replaceAll(',', '')

    // Backspace抜きで入力可能な状態か？
    let ok = false
    let forward = false

    // 変換可能ならば入力
    for (let i = 0; i < convertTable.length; i++) {
      const convert = convertTable[i]
      if (input.length < convert.length) {
        if (input === convert.substring(0, input.length)) ok = true
      } else {
        if (input.substring(0, convert.length) === convert) {
          target1 = ''
          ok = true
          setCursor(cursor + romajiTable[convert].length)
          setFin(fin + buffer.splice(0, convert.length).join(''))
          setBuffer(buffer.splice(convert.length))
          forward = true
        }
      }
    }

    // 促音処理
    if (target1 === 'っ') {
      // 子音に連続での入力処理をやる
      // kk みたいなときに入力確定処理
      if (input[0] !== 'n') {
        if (input.length > 1) {
          if (input[0] === input[1] && consonants.includes(input[0])) {
            setCursor(cursor + 1)
            setFin(fin + buffer[0])
            setBuffer(buffer.splice(1))
            forward = true
          }
        } else {
          // 子音が違うときにエラー表示
          if (
            target2 &&
            invertedConsonantsTable[target2[1]] &&
            invertedConsonantsTable[target2[1]].includes(input[0])
          )
            // っあでバグる
            ok = true
        }
      }
    }

    // 撥音処理
    if (target1 === 'ん' && input.length > 1) {
      // n + 子音での入力処理をやる
      if (input[0] === 'n' && consonants.includes(input[1])) {
        setCursor(cursor + 1)
        setFin(fin + buffer[0])
        setBuffer(buffer.splice(1))
        forward = true
      }
    }
    setError(!ok)
    if (odai.length === cursor + 1 && forward === true) {
      setCursor(0)
      setFin('')
    }
  }, [buffer])

  // キー入力を受け取る
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace')
      setBuffer(bufferRef.current.slice(0, bufferRef.current.length - 1))
    if (e.key.length === 1) setBuffer([...bufferRef.current, e.key])
    props.handleInput(e.key)
  }

  // キーイベント取得
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [props.handleInput])
  return (
    <div>
      <h2>たいぴんぐ</h2>
      <div style={{ display: 'flex' }}>
        <p>お題：</p>
        <p>
          <span style={{ fontWeight: 'bold' }}>
            {odai.substring(0, cursor)}
          </span>
          <span style={{ color: 'gray' }}>{odai.substring(cursor)}</span>
        </p>
      </div>
      <div style={{ display: 'flex', color: error ? 'red' : 'black' }}>
        <p>入力：</p>
        <p>{fin}</p>
      </div>
      <div style={{ display: 'flex', color: error ? 'red' : 'black' }}>
        <p>バッファ：</p>
        <p>{buffer}</p>
      </div>
    </div>
  )
}
