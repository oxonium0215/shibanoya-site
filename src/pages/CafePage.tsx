import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { resolveImageUrl } from '../lib/image'
import {
  MatchaIcon,
  CookieIcon,
  ShavedIceIcon,
  RoastIcon,
  LanternIcon,
} from '../components/icons'
import type { ComponentType } from 'react'

/** カフェのギャラリー定義（画像が無ければプレースホルダー） */
const cafeGalleryItems: {
  label: string
  caption: string
  icon: ComponentType<{ size?: number; className?: string }>
}[] = [
  { label: '抹茶ラテ（ラテアート）', caption: '抹茶ラテ（ラテアート）', icon: MatchaIcon },
  { label: '柴犬クッキー', caption: '柴犬クッキー', icon: CookieIcon },
  { label: '七色かき氷', caption: '七色かき氷', icon: ShavedIceIcon },
  { label: '焙煎の時間', caption: '焙煎の時間', icon: RoastIcon },
  { label: '灯籠流しの夜', caption: '灯籠流しの夜', icon: LanternIcon },
]

export default function CafePage() {
  const { content, imageMap } = useContent()
  const { town, facilities, cafeMenu, images } = content
  const cafe = facilities.find((f) => f.id === 'cafe')

  return (
    <div>
      <h1 className="page-title">純喫茶 柴乃屋</h1>
      <p className="page-lead">{cafe?.description}</p>

      <div className="cafe-hero card">
        <img
          className="cafe-hero-img"
          src={resolveImageUrl(images.cafe, imageMap)}
          alt="柴犬三色団子を持つ店長（赤柴）"
        />
        <div>
          <p className="cafe-catch">「ホッとしたい日に現れる純喫茶」</p>
          <p className="cafe-text">
            Retro Japan × Shiba Inu。
            <br />
            赤柴の店長と、元・柴ノ町役場福祉課の白柴事務長が営む純喫茶。
            <br />
            隣には「しばの商店」、向かいには柴ノ町商店街が広がっています。
          </p>
          <p className="cafe-owner">
            店主：<strong>{town.cafeManager.color}店長</strong>／事務：{town.officeManager.color}事務長
          </p>
        </div>
      </div>

      <h2 className="section-title">おすすめメニュー</h2>
      <div className="menu-grid">
        {cafeMenu.map((m) => (
          <div key={m.name} className="card menu-item">
            <div className="menu-top">
              <p className="menu-name">{m.name}</p>
              <p className="menu-price">{m.price}</p>
            </div>
            <p className="menu-desc">{m.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">柴乃屋の一日</h2>
      <div className="card cafe-story">
        <p>
          開店前は店長が焙煎、事務長がテーブル拭き。
          <br />
          閉店後はシャッターを閉めて、二匹で静かな柴ノ町商店街を歩いて帰ります。
          <br />
          柴ノ川のほとりで蛍を眺めながら、温かいコーヒーと柴犬クッキーを分け合うのが日課です。
        </p>
        <p className="cafe-story-sub">
          ときには「SHIBANO HOUSE」への出張喫茶、柴ノ町子ども会への差し入れ、灯籠流しの準備も。
        </p>
      </div>

      {/* フォトギャラリー */}
      <h2 className="section-title">柴乃屋のアルバム</h2>
      <div className="photo-grid">
        <figure className="photo-card">
          <img src={resolveImageUrl(images.cafe, imageMap)} alt="柴犬三色団子" />
          <figcaption className="photo-caption">柴犬三色団子（新メニュー）</figcaption>
        </figure>
        {cafeGalleryItems.map((item, i) => {
          const img = resolveImageUrl(images.galleryCafe[i], imageMap)
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

      <h2 className="section-title">店舗情報</h2>
      <div className="card cafe-info">
        <dl className="info-list">
          <div>
            <dt>所在地</dt>
            <dd>柴ノ町 商店街（地図ではコーヒーカップのマーク）</dd>
          </div>
          <div>
            <dt>営業時間</dt>
            <dd>9:00 – 18:00（定休日：木曜）</dd>
          </div>
          <div>
            <dt>席数</dt>
            <dd>12席（柴犬用の席あり）</dd>
          </div>
          <div>
            <dt>Instagram</dt>
            <dd>@cafe_shibanoya（フォロワー {town.regulars.toLocaleString()}人）</dd>
          </div>
          <div>
            <dt>隣の店</dt>
            <dd>しばの商店（オンラインショップ：shibano.base.shop）</dd>
          </div>
        </dl>
        <div className="cafe-links">
          <Link className="btn" to="/map">
            地図で見る
          </Link>
          <Link className="btn btn-secondary" to="/">
            ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
