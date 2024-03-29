import { useEffect, useState, useRef, MutableRefObject } from 'react'
import {
  InvertedRomajiTable,
  romajiTable,
  consonants,
  invertedConsonantsTable,
} from '../misc/romaji'
import { Odai } from '../misc/odai'

interface Props {
  handleInput: (key: string) => void
  handleClear: (fin: string, missType: number) => void
  clearBuffer: MutableRefObject<() => void>
  odai: Odai
}

export default function RomajiInput(props: Props) {
  const [buffer, setBuffer] = useState([] as Array<string>)
  const bufferRef = useRef(buffer)
  const [cursor, setCursor] = useState(0)
  const [fin, setFin] = useState('')
  const [missType, setMissType] = useState(0)
  const errRef = useRef(missType)

  // 連続で音を鳴らす用…
  const audio1 = useRef<HTMLAudioElement>(null)
  const audio2 = useRef<HTMLAudioElement>(null)
  const audio3 = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    errRef.current = missType
  }, [missType])
  props.clearBuffer.current = () => {
    setBuffer([])
    setCursor(0)
    setFin('')
    setMissType(0)
  }
  const odai = props.odai.kana
  useEffect(() => {
    // イベントリスナーから呼ぶための
    bufferRef.current = buffer
  }, [buffer])

  // 変換 & 誤入力チェック
  useEffect(() => {
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
          setCursor(
            cursor + romajiTable[convert as keyof typeof romajiTable].length
          )
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

    // 誤入力判定だったら新規入力分をクリア
    if (!ok) {
      buffer.pop()
      setMissType((prev) => prev + 1)
      ok = false
    }
    if (odai.length === cursor + 1 && forward === true) {
      props.handleClear(fin, missType)
      setCursor(0)
      setFin('')
    }
  }, [buffer])
  let audio = 0
  // キー入力を受け取る
  const handleKeyDown = (e: KeyboardEvent) => {
    if (audio1.current) {
      if (audio % 3 == 0) {
        audio1.current.currentTime = 0
        audio1.current.play()
      }
      if (audio % 3 == 1) {
        audio2.current!.currentTime = 0
        audio2.current!.play()
      }
      if (audio % 3 == 2) {
        audio3.current!.currentTime = 0
        audio3.current!.play()
      }
      audio++
    }
    if (e.key === 'Backspace' && bufferRef.current.length > 0) {
      setBuffer(bufferRef.current.slice(0, bufferRef.current.length - 1))
      setMissType(errRef.current + 1)
    }
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
    <div className={'game-text-view'}>
      <audio hidden src="/single-key.mp3" ref={audio1} />
      <audio hidden src="/single-key.mp3" ref={audio2} />
      <audio hidden src="/single-key.mp3" ref={audio3} />
      <div style={{ display: 'flex' }}>
        <p>お題：</p>
        <div>
          <p suppressHydrationWarning>{props.odai.view}</p>
          <p style={{ display: 'flex' }}>
            <span suppressHydrationWarning className={'hiragana-sumi'}>
              {odai.substring(0, cursor)}
            </span>
            <span suppressHydrationWarning className={'hiragana-mi'}>
              {odai.substring(cursor)}
            </span>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <p>入力：</p>
        <p>
          <span>{odai.substring(0, cursor)}</span>
          <span>{buffer}</span>
          <span className="carret"></span>
        </p>
      </div>
    </div>
  )
}
