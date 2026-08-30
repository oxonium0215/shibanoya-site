// ============================================================================
// 柴ノ町 デモサイトの型定義
// すべてのページ・地図・登記簿がこの型を共有します。
// ============================================================================

/** 町にある施設（地図上に表示される） */
export interface Facility {
  id: string
  name: string
  /** 施設の種類（アイコン描画に使用） */
  category: 'cafe' | 'yakuba' | 'station' | 'park' | 'shrine'
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
  /** 区画番号（第1区画〜） */
  number: number
  /** 第1期=完売済み / 第2期=準備中 */
  phase: 1 | 2
  /** 面積（㎡） */
  area: number
  /** 分譲状況 */
  status: 'sold' | 'available'
  /** 所有者（住人）のID（sold のときのみ） */
  ownerId?: string
  /** 引き渡し日（sold のときのみ） */
  acquiredDate?: string
  /** 区画の特徴（眺望など） */
  note?: string
  /** 地図上の矩形（viewBox 1000×660） */
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
  lotNumber: number
  lotName: string
  /** 登記番号 */
  registrationNo: string
  /** 地目 */
  landType: string
  /** 地積（㎡） */
  area: number
  /** 所在（表題部） */
  address: string
  /** 権利部（甲区）所有者 */
  ownerName: string
  ownerHandle: string
  ownerAddress: string
  /** 登記原因（売買・贈与など） */
  reason: string
  /** 登記日 */
  registeredDate: string
  /** 権利証番号 */
  certificateNo: string
}