import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { resolveImageUrl } from '../lib/image'
import { lotLabel } from '../data/types'
import type { District, Lot } from '../data/types'
import {
  CoffeeIcon,
  TownHallIcon,
  StationIcon,
  ParkIcon,
  ShrineIcon,
  PinIcon,
} from '../components/icons'
import type { ComponentType } from 'react'

const categoryColors: Record<string, string> = {
  cafe: '#8a5a36',
  yakuba: '#5f3f26',
  station: '#5f7a80',
  park: '#5d6b4e',
  shrine: '#8a5a5a',
}

const categoryIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  cafe: CoffeeIcon,
  yakuba: TownHallIcon,
  station: StationIcon,
  park: ParkIcon,
  shrine: ShrineIcon,
}

/** 地区の状態ラベル */
function districtStatusLabel(status: District['status']): string {
  switch (status) {
    case 'sold-out':
      return '分譲済み'
    case 'open':
      return '分譲中'
    case 'expanding':
      return '拡大中'
    case 'coming-soon':
    default:
      return '近日公開'
  }
}

/** 区画の状態ラベル */
function lotStatusLabel(status: Lot['status']): string {
  switch (status) {
    case 'sold':
      return '完売'
    case 'planned':
      return '予定'
    case 'available':
    default:
      return '入居者決定'
  }
}

export default function MapPage() {
  const { districtId } = useParams()
  const { content, imageMap } = useContent()
  const {
    facilities,
    lots,
    residents,
    districts,
    mapBackground,
    mapBackgroundSize,
  } = content
  const navigate = useNavigate()
  const residentById = Object.fromEntries(residents.map((r) => [r.id, r]))
  const sortedDistricts = [...districts].sort((a, b) => a.order - b.order)
  const district = districtId
    ? districts.find((d) => d.id === districtId)
    : undefined

  const [selectedLotId, setSelectedLotId] = useState<string | null>(null)
  const selectedLot = selectedLotId
    ? lots.find((l) => l.id === selectedLotId)
    : undefined
  const selectedOwner = selectedLot?.ownerId
    ? residentById[selectedLot.ownerId]
    : undefined

  // 町全体図の縦横比（背景画像に合わせる）
  const [bgSize, setBgSize] = useState<{ w: number; h: number } | null>(
    mapBackgroundSize ?? null,
  )
  useEffect(() => {
    if (mapBackgroundSize) {
      setBgSize(mapBackgroundSize)
      return
    }
    if (!mapBackground) {
      setBgSize(null)
      return
    }
    const img = new Image()
    let cancelled = false
    img.onload = () => {
      if (!cancelled) setBgSize({ w: img.naturalWidth, h: img.naturalHeight })
    }
    img.onerror = () => {
      if (!cancelled) setBgSize(null)
    }
    img.src = resolveImageUrl(mapBackground, imageMap)
    return () => {
      cancelled = true
    }
  }, [mapBackground, mapBackgroundSize, imageMap])

  const vbW = bgSize?.w ?? 1000
  const vbH = bgSize?.h ?? 660

  const defs = (
    <defs>
      <pattern id="grass" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#e8ead9" />
        <circle cx="8" cy="12" r="2" fill="#cdd3b6" />
        <circle cx="28" cy="30" r="2" fill="#cdd3b6" />
      </pattern>
      <pattern
        id="hatch"
        width="10"
        height="10"
        patternTransform="rotate(45)"
        patternUnits="userSpaceOnUse"
      >
        <rect width="10" height="10" fill="#e8dcc2" />
        <line x1="0" y1="0" x2="0" y2="10" stroke="#cdb58c" strokeWidth="3" />
      </pattern>
      <pattern
        id="planned"
        width="12"
        height="12"
        patternTransform="rotate(45)"
        patternUnits="userSpaceOnUse"
      >
        <rect width="12" height="12" fill="#f2f0ea" />
        <line x1="0" y1="0" x2="0" y2="12" stroke="#ddd8cc" strokeWidth="3" />
      </pattern>
    </defs>
  )

  /* ---------------- 地区詳細図 ---------------- */
  if (districtId && !district) {
    return (
      <div>
        <h1 className="page-title">町の地図</h1>
        <div className="card registry-empty">
          <p>地区が見つかりませんでした。</p>
          <Link className="btn btn-secondary" to="/map">
            町全体図へ戻る
          </Link>
        </div>
      </div>
    )
  }

  if (district) {
    const districtLots = lots.filter((l) => l.districtId === district.id)
    const phases = Array.from(new Set(districtLots.map((l) => l.phase))).sort(
      (a, b) => a - b,
    )

    return (
      <div>
        <nav className="breadcrumb" aria-label="パンくず">
          <Link to="/map">町の地図</Link>
          <span aria-hidden="true">›</span>
          <span>{district.name}</span>
        </nav>
        <h1 className="page-title">{district.name}</h1>
        <p className="page-lead">
          {district.summary}
          {phases.length > 0 && (
            <>
              <br />
              収録：{phases.map((p) => `第${p}期`).join('・')}／全
              {districtLots.length}区画
            </>
          )}
        </p>

        <div className="map-wrap">
          <div className="map-canvas card">
            <svg
              viewBox={`0 0 ${district.mapWidth} ${district.mapHeight}`}
              role="img"
              aria-label={`${district.name}の区画図`}
            >
              {defs}
              <rect
                width={district.mapWidth}
                height={district.mapHeight}
                fill="url(#grass)"
                rx="8"
              />
              {districtLots.map((lot) => {
                const owner = lot.ownerId ? residentById[lot.ownerId] : undefined
                const fill =
                  lot.status === 'sold'
                    ? owner?.color ?? '#d9b98a'
                    : lot.status === 'planned'
                      ? 'url(#planned)'
                      : 'url(#hatch)'
                const isSelected = selectedLotId === lot.id
                return (
                  <g
                    key={lot.id}
                    className="map-lot"
                    onClick={() => setSelectedLotId(lot.id)}
                  >
                    <rect
                      x={lot.x}
                      y={lot.y}
                      width={lot.w}
                      height={lot.h}
                      rx="8"
                      fill={fill}
                      stroke={isSelected ? '#b9774a' : '#c9a86a'}
                      strokeWidth={isSelected ? 4 : 2}
                    />
                    <text
                      x={lot.x + lot.w / 2}
                      y={lot.y + lot.h / 2 - 6}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="30"
                      fontWeight="700"
                      fill={lot.status === 'sold' ? '#5a3a1a' : '#a08a60'}
                    >
                      {lotLabel(district, lot)}
                    </text>
                    <text
                      x={lot.x + lot.w / 2}
                      y={lot.y + lot.h / 2 + 22}
                      textAnchor="middle"
                      fontSize="15"
                      fill={lot.status === 'sold' ? '#7a5a3a' : '#a08a60'}
                    >
                      {lotStatusLabel(lot.status)}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* 詳細パネル */}
          <div className="map-detail">
            {selectedLot ? (
              <div className="card lot-detail">
                <p className="lot-detail-title">
                  {district.lotPrefix ?? ''}
                  {selectedLot.number}区画
                  <span
                    className={
                      selectedLot.status === 'sold'
                        ? 'badge badge-sold'
                        : 'badge badge-available'
                    }
                  >
                    {lotStatusLabel(selectedLot.status)}
                  </span>
                </p>
                <dl className="lot-detail-list">
                  <div>
                    <dt>地区</dt>
                    <dd>{district.name}</dd>
                  </div>
                  <div>
                    <dt>面積</dt>
                    <dd>{selectedLot.area} ㎡</dd>
                  </div>
                  <div>
                    <dt>期</dt>
                    <dd>第{selectedLot.phase}期</dd>
                  </div>
                  {selectedLot.note && (
                    <div>
                      <dt>特徴</dt>
                      <dd>{selectedLot.note}</dd>
                    </div>
                  )}
                  {selectedLot.acquiredDate && (
                    <div>
                      <dt>引き渡し</dt>
                      <dd>{selectedLot.acquiredDate}</dd>
                    </div>
                  )}
                  {selectedOwner && selectedOwner.publish && (
                    <>
                      <div>
                        <dt>所有者</dt>
                        <dd>{selectedOwner.name}</dd>
                      </div>
                      <div>
                        <dt>ハンドル</dt>
                        <dd>{selectedOwner.handle}</dd>
                      </div>
                    </>
                  )}
                  {selectedOwner && !selectedOwner.publish && (
                    <div>
                      <dt>所有者</dt>
                      <dd>入居者決定（掲載許可待ち）</dd>
                    </div>
                  )}
                </dl>
                <Link className="btn btn-secondary" to="/registry">
                  登記簿を確認する
                </Link>
              </div>
            ) : (
              <div className="card map-hint">
                <p>
                  <PinIcon size={16} /> 区画をタップすると、ここに詳細が表示されます。
                </p>
                <p className="map-hint-sub">
                  この地区には {districtLots.length} 区画があります。
                </p>
                <p>
                  <Link className="btn btn-secondary" to="/map">
                    ← 町全体図へ
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="page-actions">
          <Link className="btn btn-secondary" to="/lots">
            別荘地分譲のご案内
          </Link>
        </div>
      </div>
    )
  }

  /* ---------------- 町全体図 ---------------- */
  return (
    <div>
      <h1 className="page-title">町の地図</h1>
      <p className="page-lead">
        {content.town.name}の全景です。地区・街区や施設をタップすると詳しい情報が表示されます。
      </p>

      <div className="map-wrap">
        <div className="map-canvas card">
          <svg viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label="柴ノ町の地図">
            {defs}

            {mapBackground ? (
              <image
                href={resolveImageUrl(mapBackground, imageMap)}
                x="0"
                y="0"
                width={vbW}
                height={vbH}
                preserveAspectRatio="none"
              />
            ) : (
              <rect width="1000" height="660" fill="url(#grass)" rx="8" />
            )}

            {!mapBackground && (
              <>
                <path
                  d="M60 470 C 200 420, 300 520, 460 470 S 700 420, 950 470"
                  stroke="#a9c3c9"
                  strokeWidth="26"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <path
                  d="M60 470 C 200 420, 300 520, 460 470 S 700 420, 950 470"
                  stroke="#c8dcd9"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                />
                <g stroke="#efe3cd" strokeWidth="22" strokeLinecap="round" opacity="0.95">
                  <path d="M0 180 H1000" />
                  <path d="M300 0 V660" />
                  <path d="M0 545 H1000" />
                </g>
                <g stroke="#d3bfa0" strokeWidth="2" strokeDasharray="12 10">
                  <path d="M0 180 H1000" />
                  <path d="M300 0 V660" />
                  <path d="M0 545 H1000" />
                </g>
              </>
            )}

            {/* 地区・街区マーカー（個別区画番号は表示しない） */}
            {sortedDistricts.map((d) => (
              <g
                key={d.id}
                className="map-district"
                onClick={() => navigate(`/map/${d.id}`)}
                role="link"
                aria-label={`${d.name}の区画図を開く`}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={d.x}
                  y={d.y}
                  width={d.w}
                  height={d.h}
                  rx="12"
                  fill="#f7efdd"
                  stroke="#c9a86a"
                  strokeWidth="3"
                />
                <text
                  x={d.x + d.w / 2}
                  y={d.y + d.h / 2 - 8}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="24"
                  fontWeight="700"
                  fill="#5a3a1a"
                >
                  {d.shortName}
                </text>
                <text
                  x={d.x + d.w / 2}
                  y={d.y + d.h / 2 + 20}
                  textAnchor="middle"
                  fontSize="15"
                  fill="#8a6a44"
                >
                  {districtStatusLabel(d.status)}
                </text>
              </g>
            ))}

            {/* 施設マーカー */}
            {facilities.map((f) => {
              const color = categoryColors[f.category] ?? '#6b6b6b'
              const Icon = categoryIcons[f.category] ?? PinIcon
              return (
                <g
                  key={f.id}
                  className="map-facility"
                  onClick={() => {
                    if (f.link) navigate(f.link)
                  }}
                  role={f.link ? 'link' : undefined}
                  aria-label={f.link ? `${f.name} のページへ` : f.name}
                  style={f.link ? { cursor: 'pointer' } : undefined}
                >
                  <circle cx={f.x} cy={f.y} r="22" fill={color} stroke="#f7f0e4" strokeWidth="3" />
                  <svg
                    x={f.x - 13}
                    y={f.y - 13}
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f7f0e4"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <Icon />
                  </svg>
                  <text
                    x={f.x}
                    y={f.y + 38}
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="700"
                    fill="#4a3527"
                    style={{ paintOrder: 'stroke' }}
                    stroke="#f7f0e4"
                    strokeWidth="4"
                  >
                    {f.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* 地区一覧パネル */}
        <div className="map-detail">
          <div className="card">
            <p className="lot-detail-title">地区・街区</p>
            <ul className="district-list">
              {sortedDistricts.map((d) => (
                <li key={d.id}>
                  <Link to={`/map/${d.id}`} className="district-list-item">
                    <span className="district-list-name">{d.name}</span>
                    <span className="district-list-status">
                      {districtStatusLabel(d.status)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="map-hint-sub">
              地区を選ぶと、その地区の区画図が開きます。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
