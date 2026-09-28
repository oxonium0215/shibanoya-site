import type { District, Facility, Lot, NewsItem, Resident } from './types'

/** カフェのメニュー1品 */
export interface CafeMenuItem {
  name: string
  price: string
  desc: string
}

/** 店長・事務長のプロフィール */
export interface ManagerProfile {
  name: string
  color: string
  role: string
  /** トップページに表示する短い紹介文 */
  bio: string
}

/** サイト全体の編集可能なコンテンツ（Firestore に保存） */
export interface SiteContent {
  town: {
    name: string
    kana: string
    motto: string
    /** 常連様（フォロワー）の表記。固定の人数は使わず「3,000人以上」など */
    followerLabel: string
    area: string
    established: string
    /** Instagram のハンドル（@cafe_shibanoya） */
    instagramHandle: string
    /** Instagram の URL */
    instagramUrl: string
    /** オンラインショップの名前（しばの商店） */
    shopName: string
    /** オンラインショップの URL */
    shopUrl: string
    mayor: {
      name: string
      title: string
      occupation: string
      greeting: string
    }
    cafeManager: ManagerProfile
    officeManager: ManagerProfile
  }
  /** 地区・街区 */
  districts: District[]
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
    /** 赤柴店長の写真 */
    managerRed: string
    /** 白柴事務長の写真 */
    managerWhite: string
  }
}
