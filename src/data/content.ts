import type { Facility, Lot, NewsItem, Resident } from './types'

/** カフェのメニュー1品 */
export interface CafeMenuItem {
  name: string
  price: string
  desc: string
}

/** サイト全体の編集可能なコンテンツ（data/content.json に保存） */
export interface SiteContent {
  town: {
    name: string
    kana: string
    motto: string
    regulars: number
    area: string
    established: string
    mayor: {
      name: string
      title: string
      occupation: string
      greeting: string
    }
    cafeManager: { name: string; color: string; role: string }
    officeManager: { name: string; color: string; role: string }
  }
  facilities: Facility[]
  news: NewsItem[]
  lots: Lot[]
  residents: Resident[]
  /** カフェのメニュー */
  cafeMenu: CafeMenuItem[]
  /** 地図の背景画像（URL。空ならデフォルト描画） */
  mapBackground: string
  /** 背景画像の寸法（ピクセル）。onload に依存せず縦横比を確定する */
  mapBackgroundSize?: { w: number; h: number } | null
  /** サイトの画像（ヒーロー・ギャラリーなど） */
  images: {
    hero: string
    profile: string
    cafe: string
    /** ホームのギャラリー（6枚。空はプレースホルダー表示） */
    galleryHome: string[]
    /** カフェのギャラリー（6枚。空はプレースホルダー表示） */
    galleryCafe: string[]
  }
}
