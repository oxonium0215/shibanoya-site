// ============================================================================
// Firestore に保存された旧形式のコンテンツを現行スキーマへ正規化する。
//
// ・地区（districts）が無い旧データ → デフォルト地区を補完
// ・区画に districtId が無い → 第一街区（d1）に割り当て、詳細図の座標へ再配置
// ・住人に publish が無い → false（非掲載）
// ・令和6年 → 令和8年に統一
// ・旧カテゴリ「お知らせ」→「町からのお知らせ」
// ============================================================================

import type { SiteContent } from '../data/content'
import { buildDefaultContent } from '../data/defaultContent'

/** 令和6年 → 令和8年（旧データの年号を現行設定に合わせる） */
function fixYear(s: string | undefined): string {
  if (!s) return ''
  return s.replace(/令和6年/g, '令和8年')
}

/** 旧カテゴリを現行カテゴリへ */
function fixCategory(c: string | undefined): string {
  if (c === 'お知らせ') return '町からのお知らせ'
  return c ?? '町からのお知らせ'
}

type RawTown = Partial<SiteContent['town']> & { regulars?: number }
type RawContent = Partial<SiteContent>

export function normalizeContent(raw: RawContent | null | undefined): SiteContent {
  const def = buildDefaultContent()
  if (!raw) return def

  const t: RawTown = (raw.town ?? {}) as RawTown
  const town: SiteContent['town'] = {
    name: t.name || def.town.name,
    kana: t.kana || def.town.kana,
    motto: t.motto || def.town.motto,
    // 旧データの regulars（固定人数）は使わず、followerLabel に置き換える
    followerLabel: t.followerLabel || def.town.followerLabel,
    area: t.area || def.town.area,
    established: fixYear(t.established) || def.town.established,
    instagramHandle: t.instagramHandle || def.town.instagramHandle,
    instagramUrl: t.instagramUrl || def.town.instagramUrl,
    shopName: t.shopName || def.town.shopName,
    shopUrl: t.shopUrl || def.town.shopUrl,
    mayor: { ...def.town.mayor, ...(t.mayor ?? {}) },
    cafeManager: { ...def.town.cafeManager, ...(t.cafeManager ?? {}) },
    officeManager: { ...def.town.officeManager, ...(t.officeManager ?? {}) },
  }

  const rawImages = (raw.images ?? {}) as Partial<SiteContent['images']>
  const images: SiteContent['images'] = {
    hero: rawImages.hero ?? def.images.hero,
    profile: rawImages.profile ?? def.images.profile,
    cafe: rawImages.cafe ?? def.images.cafe,
    galleryHome: rawImages.galleryHome?.length
      ? rawImages.galleryHome
      : def.images.galleryHome,
    galleryCafe: rawImages.galleryCafe?.length
      ? rawImages.galleryCafe
      : def.images.galleryCafe,
    managerRed: rawImages.managerRed ?? '',
    managerWhite: rawImages.managerWhite ?? '',
  }

  const districts = raw.districts?.length ? raw.districts : def.districts
  const defLotById = Object.fromEntries(def.lots.map((l) => [l.id, l]))

  const lots = (raw.lots ?? def.lots).map((l) => {
    const fallback = defLotById[l.id]
    const hasDistrict = Boolean(l.districtId)
    // 旧データ（districtId 無し＝町全体図の座標）は地区詳細図のレイアウトへ寄せる
    const relayout = !hasDistrict && fallback
    return {
      ...l,
      districtId: l.districtId ?? fallback?.districtId ?? 'd1',
      phase: l.phase ?? 1,
      status: l.status ?? 'available',
      x: relayout ? fallback!.x : l.x,
      y: relayout ? fallback!.y : l.y,
      w: relayout ? fallback!.w : l.w,
      h: relayout ? fallback!.h : l.h,
      acquiredDate: l.acquiredDate ? fixYear(l.acquiredDate) : l.acquiredDate,
    }
  })

  const residents = (raw.residents ?? def.residents).map((r) => ({
    ...r,
    publish: r.publish ?? false,
    districtId: r.districtId ?? 'd1',
    movedInDate: fixYear(r.movedInDate),
  }))

  const news = (raw.news ?? def.news).map((n) => ({
    ...n,
    date: fixYear(n.date),
    category: fixCategory(n.category),
  }))

  return {
    town,
    districts,
    facilities: raw.facilities ?? def.facilities,
    news,
    lots,
    residents,
    cafeMenu: raw.cafeMenu ?? def.cafeMenu,
    mapBackground: raw.mapBackground ?? '',
    mapBackgroundSize: raw.mapBackgroundSize ?? null,
    images,
  }
}
