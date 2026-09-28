import { Link, useParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { lotLabel } from '../data/types'
import type { District, Lot } from '../data/types'
import { FireworksIcon, RiverIcon, ForestIcon, ShibaIcon, PinIcon } from '../components/icons'
import type { ComponentType } from 'react'

/** 地区の種別アイコン */
const kindIcons: Record<District['kind'], ComponentType<{ size?: number; className?: string }>> = {
  villa: ShibaIcon,
  shops: ForestIcon,
  residence: PinIcon,
  farm: ForestIcon,
}

function statusBadge(status: District['status']) {
  switch (status) {
    case 'sold-out':
      return <span className="badge badge-sold">分譲済み</span>
    case 'open':
      return <span className="badge badge-available">分譲中</span>
    case 'expanding':
      return <span className="badge badge-available">拡大中</span>
    case 'coming-soon':
    default:
      return <span className="badge">近日公開</span>
  }
}

function lotBadge(status: Lot['status']) {
  switch (status) {
    case 'sold':
      return <span className="badge badge-sold">完売</span>
    case 'planned':
      return <span className="badge">予定</span>
    case 'available':
    default:
      return <span className="badge badge-available">入居者決定</span>
  }
}

/** 地区の紹介アイコン（種別に応じた雰囲気づけ） */
function districtAccentIcon(d: District) {
  if (d.lotPrefix === '丘') return FireworksIcon
  if (d.lotPrefix === '川') return RiverIcon
  if (d.lotPrefix === '森') return ForestIcon
  return kindIcons[d.kind]
}

export default function LotsPage() {
  const { districtId } = useParams()
  const { content } = useContent()
  const { lots, residents, districts } = content
  const sortedDistricts = [...districts].sort((a, b) => a.order - b.order)
  const district = districtId ? districts.find((d) => d.id === districtId) : undefined

  /* ---------------- 地区詳細 ---------------- */
  if (district) {
    const districtLots = lots.filter((l) => l.districtId === district.id)
    const phases = Array.from(new Set(districtLots.map((l) => l.phase))).sort(
      (a, b) => a - b,
    )
    const districtResidents = residents.filter(
      (r) => (r.districtId ?? district.id) === district.id,
    )

    return (
      <div>
        <nav className="breadcrumb" aria-label="パンくず">
          <Link to="/lots">別荘地分譲</Link>
          <span aria-hidden="true">›</span>
          <span>{district.name}</span>
        </nav>
        <h1 className="page-title">{district.name}</h1>
        <p className="page-lead">
          {district.summary}
          {districtLots.length > 0 && <>（全{districtLots.length}区画）</>}
        </p>

        {districtLots.length === 0 ? (
          <div className="card registry-empty">
            <p>この地区の区画は、現在準備中です。</p>
            <p className="registry-empty-sub">公開までしばらくお待ちください。</p>
          </div>
        ) : (
          phases.map((phase) => {
            const phaseLots = districtLots
              .filter((l) => l.phase === phase)
              .sort((a, b) => a.number - b.number)
            return (
              <details key={phase} className="lot-phase" open={phase === phases[0]}>
                <summary>
                  第{phase}期を見る（{phaseLots.length}区画）
                </summary>
                <div className="lot-grid">
                  {phaseLots.map((lot) => {
                    const owner = lot.ownerId
                      ? residents.find((r) => r.id === lot.ownerId)
                      : undefined
                    const future = lot.status !== 'sold'
                    return (
                      <div
                        key={lot.id}
                        className={`card lot-card${future ? ' lot-card-future' : ''}`}
                      >
                        <div
                          className={`lot-swatch${future ? ' lot-swatch-future' : ''}`}
                          style={future ? undefined : { background: owner?.color ?? '#e8b877' }}
                          aria-hidden="true"
                        />
                        <div className="lot-card-body">
                          <p className="lot-card-title">
                            {lotLabel(district, lot)}区画
                            {lotBadge(lot.status)}
                          </p>
                          <p className="lot-card-area">{lot.area} ㎡</p>
                          {lot.note && <p className="lot-card-note">{lot.note}</p>}
                          {owner && owner.publish && (
                            <p className="lot-card-owner">
                              所有者：{owner.name}（{owner.handle}）
                              <br />
                              <span className="lot-card-date">
                                引き渡し：{lot.acquiredDate}
                              </span>
                            </p>
                          )}
                          {owner && !owner.publish && (
                            <p className="lot-card-owner">
                              入居者決定
                              <br />
                              <span className="lot-card-date">
                                引き渡し：{lot.acquiredDate}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </details>
            )
          })
        )}

        {districtResidents.length > 0 && (
          <section>
            <h2 className="section-title">
              この地区の住人（{districtResidents.length}名）
            </h2>
            <div className="resident-grid">
              {districtResidents.map((r) => (
                <div key={r.id} className="card resident-card">
                  <div className="resident-head">
                    <div
                      className="resident-dot"
                      style={{ background: r.color }}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="resident-name">
                        {r.publish ? r.name : '入居者決定'}
                      </p>
                      <p className="resident-handle">
                        {r.publish ? r.handle : '（掲載許可待ち）'}
                      </p>
                    </div>
                  </div>
                  <p className="resident-date">移住：{r.movedInDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="page-actions">
          <Link className="btn" to={`/map/${district.id}`}>
            地図で区画を見る
          </Link>
          <Link className="btn btn-secondary" to="/lots">
            ← 別荘地の一覧へ
          </Link>
        </div>
      </div>
    )
  }

  /* ---------------- 地区一覧 ---------------- */
  return (
    <div>
      <h1 className="page-title">別荘地分譲のご案内</h1>
      <p className="page-lead">
        柴ノ町の別荘地は、地区・街区ごとに少しずつ広がっています。
        地区を選ぶと、区画の一覧と分譲状況をご覧いただけます。
      </p>

      <section>
        <h2 className="section-title">地区・街区の一覧</h2>
        <div className="district-grid">
          {sortedDistricts.map((d) => {
            const Icon = districtAccentIcon(d)
            const count = lots.filter((l) => l.districtId === d.id).length
            return (
              <div key={d.id} className="card district-card">
                <div className="district-card-head">
                  <div className="area-photo">
                    <Icon size={36} className="area-icon" aria-hidden="true" />
                  </div>
                </div>
                <p className="district-card-name">{d.name}</p>
                <p className="district-card-meta">
                  {statusBadge(d.status)}
                  <span className="district-card-count">
                    {count > 0 ? `全${count}区画` : '区画準備中'}
                  </span>
                </p>
                <p className="district-card-summary">{d.summary}</p>
                <Link className="btn btn-secondary" to={`/lots/${d.id}`}>
                  {count > 0 ? '区画を見る' : '詳細を見る'}
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      <div className="page-actions">
        <Link className="btn" to="/map">
          地図で見る
        </Link>
        <Link className="btn btn-secondary" to="/registry">
          土地登記簿を閲覧する
        </Link>
      </div>
    </div>
  )
}
