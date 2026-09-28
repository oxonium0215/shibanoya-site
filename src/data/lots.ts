// ============================================================================
// 別荘地「柴ノ別荘地・第一街区」の区画データ
//
// 第1期（第1〜第10区画）：常連様1,000名突破記念・先着10名プレゼントで完売済み
// 第2期（第11〜第30区画）：常連様2,000名突破記念・20区画（公開抽選会で分譲決定）
//
// ★ 区画は districtId で地区に紐づきます（ここでは 'd1' 第一街区）。
//   他地区（第二街区・柴ノ川・柴ノ森・花火ヶ丘）の区画は今後ここに追加します。
//
// ★ 第1期の ownerId は residents.ts の id と対応しています。
//
// ★ 座標：地区詳細図（viewBox 1000×660）上で 5列 × 6行 のグリッド
//   第1期 = 上2行（y: 70, 165）／第2期 = 下4行（y: 260, 355, 450, 545）
// ============================================================================

import type { Lot } from './types'

/** 5列の x 座標 */
const COLS = [80, 248, 416, 584, 752]
/** 区画サイズ */
const W = 148
const H = 75
/** 行の y 座標 */
const ROWS = [70, 165, 260, 355, 450, 545]

const DISTRICT = 'd1'

/** 第1期の区画（完売済み・上2行） */
const phase1: Lot[] = [
  { id: 'lot-01', districtId: DISTRICT, number: 1, phase: 1, area: 186, status: 'sold', ownerId: 'r01', acquiredDate: '令和8年7月28日', note: '柴乃屋の隣、人気の立地。店長が朝の挨拶に来てくれます。', x: COLS[0], y: ROWS[0], w: W, h: H },
  { id: 'lot-02', districtId: DISTRICT, number: 2, phase: 1, area: 152, status: 'sold', ownerId: 'r02', acquiredDate: '令和8年7月28日', note: '川のせせらぎが聞こえる静かな区画。', x: COLS[1], y: ROWS[0], w: W, h: H },
  { id: 'lot-03', districtId: DISTRICT, number: 3, phase: 1, area: 204, status: 'sold', ownerId: 'r03', acquiredDate: '令和8年8月2日', note: '花火を一望できる人気エリア。', x: COLS[2], y: ROWS[0], w: W, h: H },
  { id: 'lot-04', districtId: DISTRICT, number: 4, phase: 1, area: 168, status: 'sold', ownerId: 'r04', acquiredDate: '令和8年8月2日', note: '公園に近く、ドッグランまで徒歩3分。', x: COLS[3], y: ROWS[0], w: W, h: H },
  { id: 'lot-05', districtId: DISTRICT, number: 5, phase: 1, area: 220, status: 'sold', ownerId: 'r05', acquiredDate: '令和8年8月9日', note: '町でいちばん広い区画。果樹園を作っている住人も。', x: COLS[4], y: ROWS[0], w: W, h: H },
  { id: 'lot-06', districtId: DISTRICT, number: 6, phase: 1, area: 174, status: 'sold', ownerId: 'r06', acquiredDate: '令和8年8月9日', note: '白いフェンスが目印。朝の珈琲にぴったり。', x: COLS[0], y: ROWS[1], w: W, h: H },
  { id: 'lot-07', districtId: DISTRICT, number: 7, phase: 1, area: 191, status: 'sold', ownerId: 'r07', acquiredDate: '令和8年8月16日', note: '神社の裏手。しっぽ守りの参道へ続く小道あり。', x: COLS[1], y: ROWS[1], w: W, h: H },
  { id: 'lot-08', districtId: DISTRICT, number: 8, phase: 1, area: 158, status: 'sold', ownerId: 'r08', acquiredDate: '令和8年8月16日', note: '山側の静かな森に包まれた癒しエリア。', x: COLS[2], y: ROWS[1], w: W, h: H },
  { id: 'lot-09', districtId: DISTRICT, number: 9, phase: 1, area: 183, status: 'sold', ownerId: 'r09', acquiredDate: '令和8年8月23日', note: '駅から近く、週末の通い別荘に好評。', x: COLS[3], y: ROWS[1], w: W, h: H },
  { id: 'lot-10', districtId: DISTRICT, number: 10, phase: 1, area: 199, status: 'sold', ownerId: 'r10', acquiredDate: '令和8年8月23日', note: '桜の木のある角地。春が美しい区画です。', x: COLS[4], y: ROWS[1], w: W, h: H },
]

/** 第2期の区画（公開抽選会で分譲決定・下4行） */
const phase2: Lot[] = [
  { id: 'lot-11', districtId: DISTRICT, number: 11, phase: 2, area: 176, status: 'available', note: '公開抽選会で当選者決定', x: COLS[0], y: ROWS[2], w: W, h: H },
  { id: 'lot-12', districtId: DISTRICT, number: 12, phase: 2, area: 182, status: 'available', note: '公開抽選会で当選者決定', x: COLS[1], y: ROWS[2], w: W, h: H },
  { id: 'lot-13', districtId: DISTRICT, number: 13, phase: 2, area: 165, status: 'available', note: '公開抽選会で当選者決定', x: COLS[2], y: ROWS[2], w: W, h: H },
  { id: 'lot-14', districtId: DISTRICT, number: 14, phase: 2, area: 208, status: 'available', note: '公開抽選会で当選者決定', x: COLS[3], y: ROWS[2], w: W, h: H },
  { id: 'lot-15', districtId: DISTRICT, number: 15, phase: 2, area: 188, status: 'available', note: '公開抽選会で当選者決定', x: COLS[4], y: ROWS[2], w: W, h: H },
  { id: 'lot-16', districtId: DISTRICT, number: 16, phase: 2, area: 173, status: 'available', note: '公開抽選会で当選者決定', x: COLS[0], y: ROWS[3], w: W, h: H },
  { id: 'lot-17', districtId: DISTRICT, number: 17, phase: 2, area: 179, status: 'available', note: '公開抽選会で当選者決定', x: COLS[1], y: ROWS[3], w: W, h: H },
  { id: 'lot-18', districtId: DISTRICT, number: 18, phase: 2, area: 195, status: 'available', note: '公開抽選会で当選者決定', x: COLS[2], y: ROWS[3], w: W, h: H },
  { id: 'lot-19', districtId: DISTRICT, number: 19, phase: 2, area: 162, status: 'available', note: '公開抽選会で当選者決定', x: COLS[3], y: ROWS[3], w: W, h: H },
  { id: 'lot-20', districtId: DISTRICT, number: 20, phase: 2, area: 201, status: 'available', note: '公開抽選会で当選者決定', x: COLS[4], y: ROWS[3], w: W, h: H },
  { id: 'lot-21', districtId: DISTRICT, number: 21, phase: 2, area: 184, status: 'available', note: '公開抽選会で当選者決定', x: COLS[0], y: ROWS[4], w: W, h: H },
  { id: 'lot-22', districtId: DISTRICT, number: 22, phase: 2, area: 177, status: 'available', note: '公開抽選会で当選者決定', x: COLS[1], y: ROWS[4], w: W, h: H },
  { id: 'lot-23', districtId: DISTRICT, number: 23, phase: 2, area: 192, status: 'available', note: '公開抽選会で当選者決定', x: COLS[2], y: ROWS[4], w: W, h: H },
  { id: 'lot-24', districtId: DISTRICT, number: 24, phase: 2, area: 169, status: 'available', note: '公開抽選会で当選者決定', x: COLS[3], y: ROWS[4], w: W, h: H },
  { id: 'lot-25', districtId: DISTRICT, number: 25, phase: 2, area: 185, status: 'available', note: '公開抽選会で当選者決定', x: COLS[4], y: ROWS[4], w: W, h: H },
  { id: 'lot-26', districtId: DISTRICT, number: 26, phase: 2, area: 198, status: 'available', note: '公開抽選会で当選者決定', x: COLS[0], y: ROWS[5], w: W, h: H },
  { id: 'lot-27', districtId: DISTRICT, number: 27, phase: 2, area: 172, status: 'available', note: '公開抽選会で当選者決定', x: COLS[1], y: ROWS[5], w: W, h: H },
  { id: 'lot-28', districtId: DISTRICT, number: 28, phase: 2, area: 187, status: 'available', note: '公開抽選会で当選者決定', x: COLS[2], y: ROWS[5], w: W, h: H },
  { id: 'lot-29', districtId: DISTRICT, number: 29, phase: 2, area: 164, status: 'available', note: '公開抽選会で当選者決定', x: COLS[3], y: ROWS[5], w: W, h: H },
  { id: 'lot-30', districtId: DISTRICT, number: 30, phase: 2, area: 194, status: 'available', note: '公開抽選会で当選者決定', x: COLS[4], y: ROWS[5], w: W, h: H },
]

export const lots: Lot[] = [...phase1, ...phase2]

/** id から区画を引くためのマップ */
export const lotById: Record<string, Lot> = Object.fromEntries(lots.map((l) => [l.id, l]))

/** 第1期・第2期それぞれの一覧 */
export const phase1Lots = lots.filter((l) => l.phase === 1)
export const phase2Lots = lots.filter((l) => l.phase === 2)
