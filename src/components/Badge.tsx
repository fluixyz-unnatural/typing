import { ranks } from '../misc/rank'

export const Badge = ({ rank }: { rank: typeof ranks[number] }) => {
  if ('FEDCBAS'.includes(rank)) {
    return <p className={'rank-normal' + ' ' + `${rank}-color`}>{rank}</p>
  }
  return <p className={'rank-stone' + ' ' + `${rank}-color`}>{rank}</p>
}
