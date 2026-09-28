// ============================================================================
// 柴ノ町の住人（別荘地の所有者）一覧
//
// ★ 個人情報の取り扱い：
// publish が false のあいだは、サイト上で「第〇区画 入居者決定」とのみ表示し、
// 氏名・Instagram ハンドル・権利証番号は表示しません。
// 掲載の許可が取れた方のみ publish を true にしてください（管理画面から変更可）。
//
// color は地図上の区画に塗る色です（柴色系のパレットから）。
// ============================================================================

import type { Resident } from './types'

const DISTRICT = 'd1'

export const residents: Resident[] = [
  {
    id: 'r01',
    name: '柴田 もふ子',
    handle: '@mofuko_shiba',
    movedInDate: '令和8年7月28日',
    certificateNo: 'SBN-0001-2026',
    color: '#e8b877',
    districtId: DISTRICT,
    publish: false,
  },
  {
    id: 'r02',
    name: '黒柴 こむぎ',
    handle: '@komugi_shiba',
    movedInDate: '令和8年7月28日',
    certificateNo: 'SBN-0002-2026',
    color: '#c98d6a',
    districtId: DISTRICT,
    publish: false,
  },
  {
    id: 'r03',
    name: '赤柴 あずき',
    handle: '@azuki_red',
    movedInDate: '令和8年8月2日',
    certificateNo: 'SBN-0003-2026',
    color: '#d9a05b',
    districtId: DISTRICT,
    publish: false,
  },
  {
    id: 'r04',
    name: '豆柴 まめ',
    handle: '@mame.daifuku',
    movedInDate: '令和8年8月2日',
    certificateNo: 'SBN-0004-2026',
    color: '#f0d6a8',
    districtId: DISTRICT,
    publish: false,
  },
  {
    id: 'r05',
    name: '柴崎 こはる',
    handle: '@koharu_ino',
    movedInDate: '令和8年8月9日',
    certificateNo: 'SBN-0005-2026',
    color: '#e6c07a',
    districtId: DISTRICT,
    publish: false,
  },
  {
    id: 'r06',
    name: '白柴 ゆき',
    handle: '@yuki_shiro',
    movedInDate: '令和8年8月9日',
    certificateNo: 'SBN-0006-2026',
    color: '#d9c8a8',
    districtId: DISTRICT,
    publish: false,
  },
  {
    id: 'r07',
    name: '柴又 だいふく',
    handle: '@daifuku_318',
    movedInDate: '令和8年8月16日',
    certificateNo: 'SBN-0007-2026',
    color: '#e8a87c',
    districtId: DISTRICT,
    publish: false,
  },
  {
    id: 'r08',
    name: '山柴 くるみ',
    handle: '@kurumi_mountain',
    movedInDate: '令和8年8月16日',
    certificateNo: 'SBN-0008-2026',
    color: '#d2a35e',
    districtId: DISTRICT,
    publish: false,
  },
  {
    id: 'r09',
    name: '柴山 まる',
    handle: '@maru_omame',
    movedInDate: '令和8年8月23日',
    certificateNo: 'SBN-0009-2026',
    color: '#e9c08a',
    districtId: DISTRICT,
    publish: false,
  },
  {
    id: 'r10',
    name: '芝田 さくら',
    handle: '@sakura_shiba',
    movedInDate: '令和8年8月23日',
    certificateNo: 'SBN-0010-2026',
    color: '#f0c9b8',
    districtId: DISTRICT,
    publish: false,
  },
]

/** id から住人を引くためのマップ */
export const residentById: Record<string, Resident> = Object.fromEntries(
  residents.map((r) => [r.id, r]),
)
