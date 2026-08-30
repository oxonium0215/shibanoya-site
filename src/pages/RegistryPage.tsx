import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import type { Lot, RegistryEntry } from '../data/types'

/** 区画＋住人から登記簿1件を組み立てる */
function buildEntry(
  lot: Lot,
  residentById: Record<string, { name: string; handle: string; certificateNo: string }>,
): RegistryEntry | null {
  if (lot.status !== 'sold' || !lot.ownerId) return null
  const owner = residentById[lot.ownerId]
  if (!owner) return null
  return {
    lotId: lot.id,
    lotNumber: lot.number,
    lotName: `第${lot.number}区画`,
    registrationNo: `柴ノ町 第${String(lot.number).padStart(4, '0')}号`,
    landType: '宅地',
    area: lot.area,
    address: `柴ノ県柴ノ町 別荘地 ${lot.id.toUpperCase()}`,
    ownerName: owner.name,
    ownerHandle: owner.handle,
    ownerAddress: `柴ノ県柴ノ町 別荘地 ${lot.number}番`,
    reason: '贈与（常連様1,000名突破記念 別荘地プレゼント企画）',
    registeredDate: lot.acquiredDate ?? '令和6年7月28日',
    certificateNo: owner.certificateNo,
  }
}

export default function RegistryPage() {
  const { content } = useContent()
  const { lots, residents } = content
  const residentById = Object.fromEntries(residents.map((r) => [r.id, r]))
  const registryEntries = lots
    .map((l) => buildEntry(l, residentById))
    .filter((e): e is RegistryEntry => e !== null)
  const lotById = Object.fromEntries(lots.map((l) => [l.id, l]))

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<RegistryEntry | null>(null)

  const q = query.trim().toLowerCase()
  const results = q
    ? registryEntries.filter((e) =>
        [e.lotName, String(e.lotNumber), e.ownerName, e.ownerHandle, e.registrationNo]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    : registryEntries

  return (
    <div>
      <h1 className="page-title">土地登記簿の閲覧</h1>
      <p className="page-lead">
        柴ノ別荘地に登記されている土地の、表題部・権利部（甲区）を閲覧できます。
        区画番号・所有者名・ハンドル名で検索できます。
      </p>

      {/* 検索 */}
      <div className="registry-search card">
        <label className="search-label" htmlFor="registry-query">
          検索（区画番号・所有者名・ハンドル名）
        </label>
        <input
          id="registry-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例：柴田 もふ子 / @mofuko / 第3区画"
          className="search-input"
        />
        <p className="search-count">{results.length} 件の登記を表示中</p>
      </div>

      {/* 一覧 */}
      <div className="registry-list">
        {results.length === 0 ? (
          <div className="card registry-empty">
            <p>該当する登記が見つかりませんでした。</p>
            <p className="registry-empty-sub">
              別のキーワードでお試しください。
            </p>
          </div>
        ) : (
          results.map((e) => {
            const lot = lotById[e.lotId]
            return (
              <button
                key={e.lotId}
                type="button"
                className="registry-row"
                onClick={() => setSelected(e)}
              >
                <div className="registry-row-main">
                  <p className="registry-row-title">{e.lotName}</p>
                  <p className="registry-row-sub">{e.registrationNo}</p>
                </div>
                <div className="registry-row-owner">
                  <p className="registry-row-name">{e.ownerName}</p>
                  <p className="registry-row-handle">{e.ownerHandle}</p>
                </div>
                <div className="registry-row-meta">
                  <p>{e.landType} {e.area}㎡</p>
                  {lot && (
                    <p className="registry-row-date">{e.registeredDate}</p>
                  )}
                </div>
                <span className="registry-row-arrow" aria-hidden="true">
                  ›
                </span>
              </button>
            )
          })
        )}
      </div>

      {/* 詳細モーダル */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="modal card"
            role="dialog"
            aria-modal="true"
            aria-label={`第${selected.lotNumber}区画 登記簿`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="閉じる"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
            <h2 className="modal-title">
              {selected.lotName} 土地登記簿
              <span className="modal-regno">{selected.registrationNo}</span>
            </h2>

            <h3 className="modal-section">表題部</h3>
            <dl className="modal-list">
              <div>
                <dt>所在</dt>
                <dd>{selected.address}</dd>
              </div>
              <div>
                <dt>地番</dt>
                <dd>{selected.lotName}</dd>
              </div>
              <div>
                <dt>地目</dt>
                <dd>{selected.landType}</dd>
              </div>
              <div>
                <dt>地積</dt>
                <dd>{selected.area} ㎡</dd>
              </div>
            </dl>

            <h3 className="modal-section">権利部（甲区）</h3>
            <dl className="modal-list">
              <div>
                <dt>登記の目的</dt>
                <dd>所有権移転</dd>
              </div>
              <div>
                <dt>原因</dt>
                <dd>{selected.reason}</dd>
              </div>
              <div>
                <dt>所有者</dt>
                <dd>
                  {selected.ownerName}（{selected.ownerHandle}）
                </dd>
              </div>
              <div>
                <dt>所有者住所</dt>
                <dd>{selected.ownerAddress}</dd>
              </div>
              <div>
                <dt>登記日</dt>
                <dd>{selected.registeredDate}</dd>
              </div>
              <div>
                <dt>権利証番号</dt>
                <dd>{selected.certificateNo}</dd>
              </div>
            </dl>

            <p className="modal-note">
              ※ 本サイトはデモのため、実際の土地登記簿とは異なります。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
