import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { useContent } from '../context/ContentContext'
import { CloseIcon } from '../components/icons'
import { lotLabel } from '../data/types'
import type { District, Lot, RegistryEntry, Resident } from '../data/types'

/** 期に応じた登記原因 */
function reasonFor(phase: number): string {
  if (phase === 1) return '贈与（常連様1,000名突破記念 別荘地プレゼント企画）'
  if (phase === 2) return '贈与（常連様2,000名突破記念 公開抽選会）'
  return '売買'
}

/** 区画＋住人＋地区から登記簿1件を組み立てる */
function buildEntry(
  lot: Lot,
  district: District | undefined,
  owner: Resident | undefined,
  townName: string,
): RegistryEntry | null {
  if (lot.status !== 'sold' || !lot.ownerId || !owner) return null
  const label = lotLabel(district, lot)
  const districtName = district?.name ?? '柴ノ別荘地'
  const published = owner.publish
  return {
    lotId: lot.id,
    districtId: lot.districtId,
    districtName,
    lotNumber: lot.number,
    lotName: `${label}区画`,
    phase: lot.phase,
    registrationNo: `柴ノ町 第${String(lot.number).padStart(4, '0')}号`,
    landType: '宅地',
    area: lot.area,
    address: `柴ノ県${townName} ${districtName} ${label}番地`,
    ownerName: published ? owner.name : '',
    ownerHandle: published ? owner.handle : '',
    ownerAddress: published ? `柴ノ県${townName} ${districtName} ${label}番地` : '',
    reason: reasonFor(lot.phase),
    registeredDate: lot.acquiredDate ?? '令和8年7月28日',
    certificateNo: published ? owner.certificateNo : '',
    published,
  }
}

const ALL = 'すべて'

export default function RegistryPage() {
  const { content } = useContent()
  const { town, lots, residents, districts } = content

  const residentById = useMemo(
    () => Object.fromEntries(residents.map((r) => [r.id, r])),
    [residents],
  )
  const districtById = useMemo(
    () => Object.fromEntries(districts.map((d) => [d.id, d])),
    [districts],
  )

  const registryEntries = useMemo(
    () =>
      lots
        .map((l) =>
          buildEntry(l, districtById[l.districtId], l.ownerId ? residentById[l.ownerId] : undefined, town.name),
        )
        .filter((e): e is RegistryEntry => e !== null),
    [lots, districtById, residentById, town.name],
  )

  const [query, setQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState<string>(ALL)
  const [phaseFilter, setPhaseFilter] = useState<string>(ALL)
  const [yearFilter, setYearFilter] = useState<string>(ALL)
  const [selected, setSelected] = useState<RegistryEntry | null>(null)

  const phases = Array.from(new Set(registryEntries.map((e) => e.phase))).sort(
    (a, b) => a - b,
  )
  const years = Array.from(
    new Set(
      registryEntries
        .map((e) => e.registeredDate.match(/令和\d+年/)?.[0])
        .filter((y): y is string => Boolean(y)),
    ),
  )
  const usedDistricts = districts.filter((d) =>
    registryEntries.some((e) => e.districtId === d.id),
  )

  const q = query.trim().toLowerCase()
  const results = registryEntries.filter((e) => {
    if (districtFilter !== ALL && e.districtId !== districtFilter) return false
    if (phaseFilter !== ALL && String(e.phase) !== phaseFilter) return false
    if (yearFilter !== ALL && !e.registeredDate.includes(yearFilter)) return false
    if (!q) return true
    return [
      e.lotName,
      String(e.lotNumber),
      e.ownerName,
      e.ownerHandle,
      e.registrationNo,
      e.districtName,
    ]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })

  return (
    <div>
      <h1 className="page-title">土地登記簿の閲覧</h1>
      <p className="page-lead">
        柴ノ町に登記されている土地の、表題部・権利部（甲区）を閲覧できます。
        地区・期・分譲時期で絞り込んだり、区画番号・所有者名・ハンドル名で検索できます。
      </p>

      {/* 絞り込み */}
      <div className="registry-search card">
        <label className="search-label" htmlFor="registry-query">
          キーワード検索（区画番号・所有者名・ハンドル名・登記番号）
        </label>
        <input
          id="registry-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例：柴田 もふ子 / @mofuko / 第3区画"
          className="search-input"
        />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          <label className="flex flex-col gap-1 text-xs text-muted">
            <span>地区・街区</span>
            <select
              className="min-h-11 w-full border border-rule-2 bg-paper px-2.5 py-2 text-sm text-ink [font-family:inherit]"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value={ALL}>{ALL}</option>
              {usedDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-muted">
            <span>期</span>
            <select
              className="min-h-11 w-full border border-rule-2 bg-paper px-2.5 py-2 text-sm text-ink [font-family:inherit]"
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
            >
              <option value={ALL}>{ALL}</option>
              {phases.map((p) => (
                <option key={p} value={String(p)}>
                  第{p}期
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-muted">
            <span>分譲時期</span>
            <select
              className="min-h-11 w-full border border-rule-2 bg-paper px-2.5 py-2 text-sm text-ink [font-family:inherit]"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value={ALL}>{ALL}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="search-count">{results.length} 件の登記を表示中</p>
      </div>

      {/* 一覧 */}
      <div className="registry-list">
        {results.length === 0 ? (
          <div className="card registry-empty">
            <p>該当する登記が見つかりませんでした。</p>
            <p className="registry-empty-sub">条件を変えてお試しください。</p>
          </div>
        ) : (
          results.map((e) => {
            const lot = lots.find((l) => l.id === e.lotId)
            return (
              <button
                key={e.lotId}
                type="button"
                className="registry-row"
                onClick={() => setSelected(e)}
              >
                <div className="registry-row-main">
                  <p className="registry-row-title">{e.lotName}</p>
                  <p className="registry-row-sub">{e.districtName}</p>
                </div>
                <div className="registry-row-owner">
                  {e.published ? (
                    <>
                      <p className="registry-row-name">{e.ownerName}</p>
                      <p className="registry-row-handle">{e.ownerHandle}</p>
                    </>
                  ) : (
                    <p className="registry-row-name">入居者決定</p>
                  )}
                </div>
                <div className="registry-row-meta">
                  <p>
                    第{e.phase}期・{e.landType} {e.area}㎡
                  </p>
                  {lot && <p className="registry-row-date">{e.registeredDate}</p>}
                </div>
                <span className="registry-row-arrow" aria-hidden="true">
                  ›
                </span>
              </button>
            )
          })
        )}
      </div>

      {/* 詳細モーダル（Radix Dialog: フォーカストラップ / Esc / aria 対応） */}
      <Dialog.Root open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="modal-overlay" />
          <Dialog.Content className="modal card" aria-describedby={undefined}>
            {selected && (
              <>
                <Dialog.Close className="modal-close" aria-label="閉じる">
                  <CloseIcon size={16} />
                </Dialog.Close>
                <Dialog.Title className="modal-title">
                  {selected.lotName} 土地登記簿
                  <span className="modal-regno">{selected.registrationNo}</span>
                </Dialog.Title>

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
                  {selected.published
                    ? `${selected.ownerName}（${selected.ownerHandle}）`
                    : '非公開'}
                </dd>
              </div>
              <div>
                <dt>所有者住所</dt>
                <dd>
                  {selected.published ? selected.ownerAddress : '非公開'}
                </dd>
              </div>
              <div>
                <dt>登記日</dt>
                <dd>{selected.registeredDate}</dd>
              </div>
              <div>
                <dt>権利証番号</dt>
                <dd>{selected.published ? selected.certificateNo : '非公開'}</dd>
              </div>
            </dl>

            <p className="modal-note">
              ※ 掲載内容は物語上の設定です。所有者情報は掲載の許可をいただいた方のみ表示し、
              それ以外は非公開としています。
            </p>

            <div className="page-actions">
              <Link className="btn btn-secondary" to={`/map/${selected.districtId}`}>
                この地区の地図を見る
              </Link>
            </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
