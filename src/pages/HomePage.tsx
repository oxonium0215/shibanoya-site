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

export default function HomePage() {
  const { content, imageMap } = useContent()
  const { town, facilities, news, lots, images } = content
  const soldCount = lots.filter((l) => l.status === 'sold').length

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
        <p className="mayor-sign">
          {town.cafeManager.color} {town.cafeManager.name}・{town.cafeManager.role}
          <br />
          {town.officeManager.color} {town.officeManager.name}・{town.officeManager.role}
        </p>
        <p className="mayor-cta">
          <Link className="btn" to="/cafe">
            純喫茶 柴乃屋へ
          </Link>
          <Link className="btn btn-secondary" to="/map">
            町の地図
          </Link>
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

      {/* 町の数字 — 控えめな統計 */}
      <section className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-value">{town.regulars.toLocaleString()}</span>
          <span className="hero-stat-label">常連様</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">{town.area}</span>
          <span className="hero-stat-label">町の面積</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">{soldCount}区画</span>
          <span className="hero-stat-label">別荘地 完売</span>
        </div>
      </section>

      {/* お知らせ — 新聞記事欄 */}
      <section>
        <h2 className="section-title">お知らせ</h2>
        <ul className="news-list">
          {news.map((n) => (
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
            const Icon = categoryIcons[f.category]
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
        ※ {town.name}は、純喫茶 柴乃屋（Instagram：@cafe_shibanoya）の物語の中にある架空の町です。
      </p>
    </div>
  )
}
