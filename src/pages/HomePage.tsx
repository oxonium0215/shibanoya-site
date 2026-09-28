import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { resolveImageUrl } from '../lib/image'
import type { ComponentType } from 'react'
import {
  CoffeeIcon,
  TownHallIcon,
  StationIcon,
  ParkIcon,
  ShrineIcon,
  CounterIcon,
  ForestIcon,
  LanternIcon,
  FireflyIcon,
  BridgeIcon,
  PinIcon,
  ShibaIcon,
} from '../components/icons'

const categoryIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  cafe: CoffeeIcon,
  yakuba: TownHallIcon,
  station: StationIcon,
  park: ParkIcon,
  shrine: ShrineIcon,
}

/** ホームのギャラリー定義（画像が無ければプレースホルダー） */
const homeGalleryItems: { label: string; caption: string; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { label: '柴乃屋のカウンター', caption: '柴乃屋のカウンター', icon: CounterIcon },
  { label: '別荘地・森のエリア', caption: '別荘地・森のエリア', icon: ForestIcon },
  { label: '柴ノ町商店街', caption: '柴ノ町商店街', icon: LanternIcon },
  { label: '柴ノ川の蛍', caption: '柴ノ川の蛍', icon: FireflyIcon },
  { label: '柴ノ川と橋', caption: '柴ノ川と橋', icon: BridgeIcon },
]

/** トップに表示するお知らせ件数 */
const NEWS_ON_HOME = 3

export default function HomePage() {
  const { content, imageMap } = useContent()
  const { town, districts, facilities, news, residents, images } = content
  const latestNews = news.slice(0, NEWS_ON_HOME)

  const managers = [
    {
      key: 'red',
      title: `${town.cafeManager.color}店長`,
      bio: town.cafeManager.bio,
      role: town.cafeManager.role,
      img: images.managerRed,
    },
    {
      key: 'white',
      title: `${town.officeManager.color}事務長`,
      bio: town.officeManager.bio,
      role: town.officeManager.role,
      img: images.managerWhite,
    },
  ]

  return (
    <div>
      {/* フルスクリーン・ヒーロー（Photographic） */}
      <section className="hero">
        <div className="hero-photo">
          <img
            src={resolveImageUrl(images.hero, imageMap)}
            alt={`${town.name}の風景`}
            fetchPriority="high"
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <p className="hero-kana">{town.kana}</p>
          <h1 className="hero-name">{town.name}</h1>
          <p className="hero-motto">{town.motto}</p>
        </div>
      </section>

      {/* 詩的テキスト・フォールド */}
      <section className="text-fold">
        <p className="lede">
          山々に囲まれ、清らかな柴ノ川が流れる小さな町。
          <br />
          町の中心に佇む純喫茶 柴乃屋から、
          <br />
          のどかな日々の物語が始まります。
        </p>
        <p className="mx-auto mb-6 max-w-[60ch] text-sm text-muted">
          {town.name}は、純喫茶 柴乃屋の物語から生まれた架空の町です。
        </p>
        <p className="mayor-cta">
          <Link className="btn" to="/cafe">
            純喫茶 柴乃屋へ
          </Link>
          <Link className="btn btn-secondary" to="/map">
            町の地図
          </Link>
          <a
            className="btn btn-secondary btn-instagram"
            href={town.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            柴ノ町の日々を Instagram で見る {town.instagramHandle}
          </a>
        </p>
      </section>

      {/* 町長あいさつ */}
      <section className="card mayor-card">
        <h2 className="section-title">町長のごあいさつ</h2>
        <div className="mayor-body">
          <div className="mayor-icon" aria-hidden="true">
            <TownHallIcon size={44} />
          </div>
          <div className="mayor-text">
            <p className="mayor-greeting">{town.mayor.greeting}</p>
            <p className="mayor-sign">
              {town.mayor.title}・{town.mayor.occupation}
              <br />
              <strong>{town.mayor.name}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* 店主と事務長 */}
      <section>
        <h2 className="section-title">柴乃屋の店主と事務長</h2>
        <div className="mx-auto grid max-w-[720px] grid-cols-1 gap-6 md:grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))]">
          {managers.map((m) => {
            const img = resolveImageUrl(m.img, imageMap)
            return (
              <div key={m.key} className="card text-center">
                {img ? (
                  <img
                    className="mb-4 block aspect-square w-full border border-rule object-cover"
                    src={img}
                    alt={m.title}
                  />
                ) : (
                  <div
                    className="mb-4 flex aspect-square w-full items-center justify-center border border-rule bg-paper-2 text-rule-2"
                    aria-hidden="true"
                  >
                    <ShibaIcon size={44} />
                  </div>
                )}
                <p className="mb-2 font-display text-lg font-semibold text-ink">
                  {m.title}
                </p>
                <p className="mb-2 text-sm text-ink-2">{m.bio}</p>
                <p className="text-xs text-muted">{m.role}</p>
              </div>
            )
          })}
        </div>
        <p className="mayor-cta">
          <Link className="btn" to="/cafe">
            純喫茶 柴乃屋へ
          </Link>
        </p>
      </section>

      {/* 町の数字 — データから自動集計（固定値は使わない） */}
      <section className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-value">{residents.length}名</span>
          <span className="hero-stat-label">柴ノ町の住人</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">{districts.length}地区</span>
          <span className="hero-stat-label">別荘地（順次拡大中）</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">{facilities.length}</span>
          <span className="hero-stat-label">町の施設</span>
        </div>
      </section>

      {/* お知らせ — 最新3件のみ */}
      <section>
        <h2 className="section-title">お知らせ</h2>
        <ul className="news-list">
          {latestNews.map((n) => (
            <li key={n.title} className="news-item">
              <span className="news-date">{n.date}</span>
              <div>
                <span className="badge">{n.category}</span>
                <p className="news-title">{n.title}</p>
                {n.body && <p className="news-body">{n.body}</p>}
              </div>
            </li>
          ))}
        </ul>
        <p className="mayor-cta">
          <Link className="btn btn-secondary" to="/news">
            お知らせをすべて見る
          </Link>
        </p>
      </section>

      {/* フォト・フォールド 2 — 柴ノ町の風景 */}
      <section className="photo-fold">
        <div className="photo-grid">
          <figure className="photo-card">
            <img src={resolveImageUrl(images.cafe, imageMap)} alt="柴犬三色団子" />
            <figcaption className="photo-caption">柴犬三色団子 — 新メニュー</figcaption>
          </figure>
          {homeGalleryItems.map((item, i) => {
            const img = resolveImageUrl(images.galleryHome[i], imageMap)
            const Icon = item.icon
            return (
              <figure key={item.label} className="photo-card">
                {img ? (
                  <img src={img} alt={item.label} />
                ) : (
                  <div className="photo-placeholder">
                    <Icon size={30} className="photo-emoji" />
                    <span>{item.label}</span>
                  </div>
                )}
                {img && <figcaption className="photo-caption">{item.caption}</figcaption>}
              </figure>
            )
          })}
        </div>
        <p className="caption">柴ノ町の風景 — 四季のアルバムより。</p>
      </section>

      {/* フォトロール（マーキー）— 写真が静かに流れる */}
      <section className="photo-marquee" aria-hidden="true">
        <div className="photo-marquee-track">
          {[0, 1].map((dup) => (
            <div className="photo-marquee-group" key={dup}>
              {[
                { icon: <CounterIcon size={40} />, label: 'カウンター' },
                { icon: <ForestIcon size={40} />, label: '森のエリア' },
                { icon: <LanternIcon size={40} />, label: '商店街' },
                { icon: <FireflyIcon size={40} />, label: '蛍' },
                { icon: <BridgeIcon size={40} />, label: '柴ノ川' },
                { icon: <CoffeeIcon size={40} />, label: '柴乃屋' },
              ].map((item, i) => (
                <div className="photo-marquee-item" key={`${dup}-${i}`}>
                  <div className="photo-placeholder">{item.icon}</div>
                  <span className="photo-marquee-label">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 町の施設 — 索引 */}
      <section>
        <h2 className="section-title">町の施設</h2>
        <div className="facility-grid">
          {facilities.map((f) => {
            const Icon = categoryIcons[f.category] ?? PinIcon
            return (
              <Link key={f.id} to={f.link ?? '/map'} className="facility-card">
                <div className="facility-icon">
                  <Icon size={26} />
                </div>
                <p className="facility-name">{f.name}</p>
                <p className="facility-desc">{f.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 脚注 */}
      <p className="home-note">
        ※ {town.name}は、純喫茶 柴乃屋（Instagram：{town.instagramHandle}）の物語の中にある架空の町です。
      </p>
    </div>
  )
}
