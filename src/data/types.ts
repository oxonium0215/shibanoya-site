// ============================================================================
// 柴ノ町 デモサイトの型定義
// すべてのページ・地図・登記簿がこの型を共有します。
// ============================================================================

/** 地区・街区（別荘地・商店街・住宅地などをまとめる単位） */
export interface District {
  id: string
  /** 表示名（例：柴ノ別荘地・第一街区） */
  name: string
  /** 全体図マーカー用の短い名前（例：第一街区） */
  shortName: string
  /** 種別 */
  kind: 'villa' | 'shops' | 'residence' | 'farm'
  /** 分譲・整備の状況 */
  status: 'sold-out' | 'open' | 'coming-soon' | 'expanding'
  /** 短い説明 */
  summary: string
  /** 町全体図（viewBox 1000×660）上のマーカー矩形 */
  x: number
  y: number
  w: number
  h: number
  /** 地区詳細図の viewBox サイズ */
  mapWidth: number
  mapHeight: number
  /** 区画番号の接頭辞（例：'' / '川' / '森' / '丘'） */
  lotPrefix?: string
  /** 表示順（小さいほど先） */
  order: number
}

/** 町にある施設（地図上に表示される） */
export interface Facility {
  id: string
  name: string
  /**
   * 施設の種類（アイコン描画に使用）。
   * 'cafe' | 'yakuba' | 'station' | 'park' | 'shrine' は専用アイコン、
   * それ以外は汎用ピンにフォールバックします（施設追加時にコード変更不要）。
   */
  category: string
  description: string
  /** 地図（viewBox 1000×660）上の座標 */
  x: number
  y: number
  /** クリック時の遷移先ルート（任意） */
  link?: string
}

/** 別荘地の区画 */
export interface Lot {
  id: string
  /** 所属する地区・街区のID */
  districtId: string
  /** 区画番号（地区内の連番） */
  number: number
  /** 期（第1期=1、第2期=2、第3期=3 …） */
  phase: number
  /** 面積（㎡） */
  area: number
  /** 分譲状況（planned = 今後分譲予定） */
  status: 'sold' | 'available' | 'planned'
  /** 所有者（住人）のID（sold のときのみ） */
  ownerId?: string
  /** 引き渡し日（sold のときのみ） */
  acquiredDate?: string
  /** 区画の特徴（眺望など） */
  note?: string
  /** 地区詳細図（viewBox）上の矩形 */
  x: number
  y: number
  w: number
  h: number
}

/** 住人（別荘地の所有者） */
export interface Resident {
  id: string
  /** 氏名（サンプル。実際の応募者名に差し替え） */
  name: string
  /** Instagram のハンドル名（サンプル） */
  handle: string
  /** 入居・移住日 */
  movedInDate: string
  /** 権利証番号 */
  certificateNo: string
  /** 地図・一覧での表示色（任意・空なら自動） */
  color?: string
  /** 所属地区のID（任意） */
  districtId?: string
  /**
   * 掲載許可。true のときのみ氏名・Instagram を公開します。
   * false の場合は「第〇区画 入居者決定」とのみ表示します。
   */
  publish: boolean
}

/** お知らせ */
export interface NewsItem {
  date: string
  category: string
  title: string
  body?: string
}

/** 土地登記簿の1件分 */
export interface RegistryEntry {
  lotId: string
  districtId: string
  districtName: string
  lotNumber: number
  /** 地区の接頭辞込みの区画名（例：第3区画 / 川3区画） */
  lotName: string
  /** 期（第1期=1 …） */
  phase: number
  /** 登記番号 */
  registrationNo: string
  /** 地目 */
  landType: string
  /** 地積（㎡） */
  area: number
  /** 所在（表題部） */
  address: string
  /** 権利部（甲区）所有者（掲載許可が無い場合は空） */
  ownerName: string
  ownerHandle: string
  ownerAddress: string
  /** 登記原因（売買・贈与など） */
  reason: string
  /** 登記日 */
  registeredDate: string
  /** 権利証番号（掲載許可が無い場合は空） */
  certificateNo: string
  /** 所有者情報を掲載してよいか */
  published: boolean
}

/** 区画の表示名（地区の接頭辞 + 番号） */
export function lotLabel(district: District | undefined, lot: Lot): string {
  return `${district?.lotPrefix ?? ''}${lot.number}`
}
