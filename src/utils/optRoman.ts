import { InvertedRomajiTable } from './romaji'

const pickMinimum = (arr: Array<string>) => {
  return arr.reduce((acc, val, index) => {
    return acc.length < val.length ? acc : val
  })
}

const pickMinimumConsonant = (arr: Array<string>) => {
  return arr.reduce((acc, val, index) => {
    if (Array.from('aiueo').includes(val[0])) return acc
    return acc.length < val.length ? acc : val
  }, 'notfound')
}

const pickMinimumConsonant2 = (arr: Array<string>) => {
  return arr.reduce((acc, val, index) => {
    if (Array.from('aiueoy').includes(val[0])) return acc
    return acc.length < val.length ? acc : val
  }, 'notfound')
}

export const optKey = (text: string) => {
  let i = 0
  const ans = []
  for (i = 0; i < text.length; i++) {
    if (i < text.length - 1) {
      const cc = text.substring(i, i + 2)
      if (cc[0] === 'ん' && cc[1] !== 'ん') {
        const cc2 = text.substring(i + 1, i + 3)
        if (
          cc2.length === 2 &&
          InvertedRomajiTable[cc2] &&
          pickMinimumConsonant2(InvertedRomajiTable[cc2]) !== 'notfound'
        ) {
          ans.push('n')
          ans.push(pickMinimumConsonant2(InvertedRomajiTable[cc2]))
          i += 2
          continue
        }
        const c2 = text.substring(i + 1, i + 2)
        if (
          InvertedRomajiTable[c2] &&
          pickMinimumConsonant2(InvertedRomajiTable[c2]) !== 'notfound'
        ) {
          ans.push('n')
          ans.push(pickMinimumConsonant2(InvertedRomajiTable[c2]))
          i += 1
          continue
        }
      }
      if (cc[0] === 'っ') {
        // っっっっじゃ jjjjja　みたいなのを考えると再帰的にやるべき…？
        const notDouble = Array.from(text.substring(i)).findIndex(
          (elm) => elm != 'っ'
        )
        if (notDouble !== -1) {
          // 後に「っ」以外のものがある
          const cc2 = text.substring(notDouble + i, notDouble + i + 2) // っじゃ みたいな場合
          if (
            cc2.length === 2 &&
            InvertedRomajiTable[cc2] &&
            pickMinimumConsonant(InvertedRomajiTable[cc2]) !== 'notfound'
          ) {
            for (let j = 0; j < notDouble; j++)
              ans.push(pickMinimumConsonant(InvertedRomajiTable[cc2])[0])
            ans.push(pickMinimumConsonant(InvertedRomajiTable[cc2]))
            i++
            i += notDouble
            continue
          }
          const c2 = text.substring(notDouble + i, notDouble + i + 1) // っじ みたいな場合
          if (
            InvertedRomajiTable[c2] &&
            pickMinimumConsonant(InvertedRomajiTable[c2]) !== 'notfound'
          ) {
            for (let j = 0; j < notDouble; j++)
              ans.push(pickMinimumConsonant(InvertedRomajiTable[c2])[0])
            ans.push(pickMinimumConsonant(InvertedRomajiTable[c2]))
            i += notDouble
            continue
          }
        }
      }
      if (InvertedRomajiTable[cc]) {
        ans.push(pickMinimum(InvertedRomajiTable[cc]))
        i++
        continue
      }
    }
    const c = text.substring(i, i + 1)
    if (InvertedRomajiTable[c]) ans.push(pickMinimum(InvertedRomajiTable[c]))
  }

  return ans.reduce((prev, val, index) => prev + val, '')
}
