export interface Odai {
  view: string
  kana: string
}
export const theme1 = [
  {
    view: '食べてすぐ寝て丑になる',
    kana: 'たべてすぐねてうしになる',
  },
  {
    view: '軍隊ガニでコンピュータを作る',
    kana: 'ぐんたいがにでこんぴゅーたをつくる',
  },
  {
    view: 'カニの爪をもがれたよう',
    kana: 'かにのつめをもがれたよう',
  },
  {
    view: 'スベスベマンジュウガニは毒をもつ',
    kana: 'すべすべまんじゅうがにはどくをもつ',
  },
  {
    view: 'タカアシガニは現生節足動物で最大',
    kana: 'たかあしがにはげんせいせっそくどうぶつでさいだい',
  },
  {
    view: 'カニの赤ちゃんはプランクトン',
    kana: 'かにのあかちゃんはぷらんくとん',
  },
  {
    view: '地球上でニ番目に賢いのはイルカ',
    kana: 'ちきゅうじょうでにばんめにかしこいのはいるか',
  },
  { view: '僕が先に好きだったのに', kana: 'ぼくがさきにすきだったのに' },
  {
    view: '神の奇跡より悪魔の気まぐれ',
    kana: 'かみのきせきよりあくまのきまぐれ',
  },
  { view: 'トリニトロトルエン', kana: 'とりにとろとるえん' },
  { view: '陸に上がった河童', kana: 'りくにあがったかっぱ' },
  {
    view: '犀の角のようにただ独り歩め',
    kana: 'さいのつののようにただひとりあゆめ',
  },
  { view: '林の中の象のように', kana: 'はやしのなかのぞうのように' },
  { view: '蒙を啓くと書いて啓蒙', kana: 'もうをひらくとかいてけいもう' },
  {
    view: '床下から大量のフロイトが出てきた',
    kana: 'ゆかしたからたいりょうのふろいとがでてきた',
  },
  {
    view: 'タコの足は分散型ネットワーク',
    kana: 'たこのあしはぶんさんがたねっとわーく',
  },
  { view: '暗黒森林理論', kana: 'あんこくしんりんりろん' },
  {
    view: '無限の猿定理',
    kana: 'むげんのさるていり',
  },
  {
    view: '雪だるまが海に飛び込んだ',
    kana: 'ゆきだるまがうみにとびこんだ',
  },
  {
    view: 'サメがお風呂でピザを食べる',
    kana: 'さめがおふろでぴざをたべる',
  },
] as const satisfies readonly Odai[]

let va =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!"#$%&\'()=~|-^\\@`[{+;*:}]<,>.?/_'
theme1.forEach((e) => {
  va += e.view + e.kana
})
export const fontText = Array.from(new Set(va))
