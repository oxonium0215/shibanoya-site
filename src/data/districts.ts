// ============================================================================
// 柴ノ町の地区・街区データ
//
// 別荘地は「地区・街区」単位で管理します。区画番号は地区ごとに採番し、
// district.lotPrefix を頭に付けます（例：川1、森1、丘1）。
//
// 町全体図（viewBox 1000×660）上のマーカー矩形 x/y/w/h と、
// 地区詳細図の viewBox（mapWidth/mapHeight）を持ちます。
// 今後「商店街区」「住宅街区」「農園地区」などもここに追加できます。
// ============================================================================

import type { District } from './types'

export const districts: District[] = [
  {
    id: 'd1',
    name: '柴ノ別荘地・第一街区',
    shortName: '第一街区',
    kind: 'villa',
    status: 'sold-out',
    summary: '第1期・第2期／全30区画。第1期は完売、第2期は公開抽選会で当選者決定。',
    x: 620,
    y: 210,
    w: 300,
    h: 200,
    mapWidth: 1000,
    mapHeight: 660,
    lotPrefix: '',
    order: 1,
  },
  {
    id: 'd2',
    name: '柴ノ別荘地・第二街区',
    shortName: '第二街区',
    kind: 'villa',
    status: 'coming-soon',
    summary: '第3期／近日公開。第一街区の南側に広がる新しい街区です。',
    x: 620,
    y: 440,
    w: 300,
    h: 150,
    mapWidth: 1000,
    mapHeight: 660,
    lotPrefix: '',
    order: 2,
  },
  {
    id: 'd3',
    name: '柴ノ川地区',
    shortName: '柴ノ川',
    kind: 'villa',
    status: 'coming-soon',
    summary: '川沿いに広がる新しい別荘地。せせらぎの音が聞こえる区画です。',
    x: 90,
    y: 400,
    w: 210,
    h: 130,
    mapWidth: 1000,
    mapHeight: 660,
    lotPrefix: '川',
    order: 3,
  },
  {
    id: 'd4',
    name: '柴ノ森地区',
    shortName: '柴ノ森',
    kind: 'villa',
    status: 'coming-soon',
    summary: '森に抱かれた静かな別荘地。木々の香りと鳥の声に包まれます。',
    x: 60,
    y: 60,
    w: 180,
    h: 110,
    mapWidth: 1000,
    mapHeight: 660,
    lotPrefix: '森',
    order: 4,
  },
  {
    id: 'd5',
    name: '花火ヶ丘地区',
    shortName: '花火ヶ丘',
    kind: 'villa',
    status: 'coming-soon',
    summary: '花火を一望できる丘の上の別荘地。夏の夜空がいちばん近い場所。',
    x: 320,
    y: 30,
    w: 200,
    h: 95,
    mapWidth: 1000,
    mapHeight: 660,
    lotPrefix: '丘',
    order: 5,
  },
]

export const districtById: Record<string, District> = Object.fromEntries(
  districts.map((d) => [d.id, d]),
)
