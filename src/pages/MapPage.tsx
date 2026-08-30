import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { resolveImageUrl } from '../lib/image'
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

export default function MapPage() {
  const { content, imageMap } = useContent()
  const { facilities, lots, residents, mapBackground, mapBackgroundSize } = content
  const lotById = Object.fromEntries(lots.map((l) => [l.id, l]))
  const residentById = Object.fromEntries(residents.map((r) => [r.id, r]))
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null)
  const navigate = useNavigate()
  const selectedLot = selectedLotId ? lotById[selectedLotId] : undefined
  const selectedOwner = selectedLot?.ownerId
    ? residentById[selectedLot.ownerId]
    : undefined

  // 背景画像の縦横比を viewBox に反映する
  // 優先: 管理画面で保存済みの mapBackgroundSize → 無ければ画像の onload で取得
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
  }, [mapBackground, mapBackgroundSize])

  const vbW = bgSize?.w ?? 1000
  const vbH = bgSize?.h ?? 660

  return (
    <div>
      <h1 className="page-title">町の地図</h1>
      <p className="page-lead">
        柴ノ町の全景です。区画や施設をクリックすると詳しい情報が表示されます。
      </p>

      <div className="map-wrap">
        <div className="map-canvas card">
          <svg viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label="柴ノ町の地図">
            <defs>
              <pattern id="grass" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="#e8ead9" />
                <circle cx="8" cy="12" r="2" fill="#cdd3b6" />
                <circle cx="28" cy="30" r="2" fill="#cdd3b6" />
              </pattern>
              {/* 当選者決定区画用のハッチパターン */}
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
            </defs>

            {/* 背景（画像設定があれば表示、なければデフォルトの草地） */}
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

            {/* 川（デフォルト背景のときのみ描画） */}
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
              </>
            )}

            {/* 道路（デフォルト背景のときのみ描画） */}
            {!mapBackground && (
              <>
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

            {/* 別荘地エリア背景（デフォルト背景のときのみ描画） */}
            {!mapBackground && (
              <>
                <rect
                  x="600"
                  y="220"
                  width="325"
                  height="330"
                  rx="14"
                  fill="#f7efdd"
                  stroke="#dcc9a4"
                  strokeWidth="2"
                />
                <text x="615" y="238" fontSize="15" fontWeight="700" fill="#8a5a36">
                  柴ノ別荘地
                </text>
              </>
            )}

            {/* 区画 */}
            {lots.map((lot) => {
              const owner = lot.ownerId ? residentById[lot.ownerId] : undefined
              const fill =
                lot.status === 'sold'
                  ? owner?.color ?? '#e8b877'
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
                    y={lot.y + lot.h / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="17"
                    fontWeight="700"
                    fill={lot.status === 'available' ? '#a08a60' : '#5a3a1a'}
                  >
                    {lot.number}
                  </text>
                  {lot.status === 'available' && (
                    <text
                      x={lot.x + lot.w / 2}
                      y={lot.y + lot.h / 2 + 15}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#a08a60"
                    >
                      当選者決定
                    </text>
                  )}
                </g>
              )
            })}

            {/* 施設マーカー */}
            {facilities.map((f) => {
              const color = categoryColors[f.category]
              const Icon = categoryIcons[f.category]
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
                  <circle
                    cx={f.x}
                    cy={f.y}
                    r="22"
                    fill={color}
                    stroke="#f7f0e4"
                    strokeWidth="3"
                  />
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

        {/* 詳細パネル */}
        <div className="map-detail">
          {selectedLot ? (
            <div className="card lot-detail">
              <p className="lot-detail-title">
                第{selectedLot.number}区画
                <span
                  className={
                    selectedLot.status === 'sold'
                      ? 'badge badge-sold'
                      : 'badge badge-available'
                  }
                >
                  {selectedLot.status === 'sold' ? '完売' : '準備中'}
                </span>
              </p>
              <dl className="lot-detail-list">
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
                {selectedOwner && (
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
              </dl>
              {selectedOwner && (
                <Link className="btn btn-secondary" to="/registry">
                  登記簿を確認する
                </Link>
              )}
            </div>
          ) : (
            <div className="card map-hint">
              <p>
                <PinIcon size={16} /> 区画や施設をクリックすると、ここに詳細が表示されます。
              </p>
              <p className="map-hint-sub">
                別荘地の区画は <strong>第1期（完売）</strong> と{' '}
                <strong>第2期（当選者決定）</strong> に分かれています。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
