import { useEffect, useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { resolveImageUrl } from '../../lib/image'
import {
  auth,
  isFirebaseConfigured,
  uploadImage as firebaseUpload,
} from '../../lib/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import type { SiteContent } from '../../data/content'
import type { NewsItem, Facility, Lot, Resident } from '../../data/types'
import './admin.css'

type Tab = 'dashboard' | 'news' | 'town' | 'registry' | 'map' | 'images'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [saving, setSaving] = useState(false)
  const { content, saveContent } = useContent()
  const [draft, setDraft] = useState<SiteContent | null>(null)

  const configured = isFirebaseConfigured()

  // ログイン状態の監視（ページ再読み込みでも維持される）
  useEffect(() => {
    if (!configured) {
      setChecking(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setChecking(false)
    })
    return () => unsub()
  }, [configured])

  useEffect(() => {
    if (content) setDraft(content)
  }, [content])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setSaved('ログインしました')
      setTimeout(() => setSaved(''), 2000)
    } catch {
      setError('メールアドレスまたはパスワードが違います')
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
  }

  const save = async (next: SiteContent) => {
    setDraft(next)
    setSaving(true)
    try {
      await saveContent(next)
      setSaved('保存しました（サイトに反映済み）')
    } catch (e) {
      setError(`保存失敗: ${(e as Error).message}`)
    } finally {
      setSaving(false)
      setTimeout(() => setSaved(''), 3000)
    }
  }

  // 画像アップロード → Firebase Storage → 公開 URL
  const uploadImage = async (file: File): Promise<string> => {
    return firebaseUpload(file)
  }

  if (checking) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <h1>管理画面</h1>
          <p className="admin-login-sub">確認中…</p>
        </div>
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <h1>管理画面</h1>
          <p className="admin-login-sub">Firebase 未設定</p>
          <p className="admin-login-note">
            .env に Firebase の設定がありません。開発者は README を参照して
            Firebase プロジェクトの設定を追加してください。
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <h1>管理画面</h1>
          <p className="admin-login-sub">柴ノ町役場 サイト管理</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              autoComplete="email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              autoComplete="current-password"
            />
            {error && <p className="admin-error">{error}</p>}
            <button type="submit">ログイン</button>
          </form>
          <p className="admin-login-note">
            管理用アカウント（メール+パスワード）はサイト管理者から配布されます。
          </p>
        </div>
      </div>
    )
  }

  if (!draft) return null

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>柴ノ町 管理画面</h1>
        <div className="admin-header-right">
          <span className="admin-conn">{user.email}</span>
          {saved && <span className="admin-saved">{saved}</span>}
          {saving && <span className="admin-saved">保存中…</span>}
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      </header>
      <nav className="admin-nav">
        {(
          [
            ['dashboard', 'ダッシュボード'],
            ['news', 'お知らせ'],
            ['town', 'サイト設定'],
            ['registry', '登記簿'],
            ['map', '地図'],
            ['images', '画像'],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button
            key={t}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {label}
          </button>
        ))}
      </nav>
      <main className="admin-main">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'news' && <NewsEditor draft={draft} onSave={save} />}
        {tab === 'town' && <TownEditor draft={draft} onSave={save} />}
        {tab === 'registry' && <RegistryEditor draft={draft} onSave={save} />}
        {tab === 'map' && (
          <MapEditor draft={draft} onSave={save} uploadImage={uploadImage} />
        )}
        {tab === 'images' && (
          <ImageEditor draft={draft} onSave={save} uploadImage={uploadImage} />
        )}
      </main>
    </div>
  )
}

/* ---------------- ダッシュボード ---------------- */
function Dashboard() {
  const { content } = useContent()
  const cards: [string, string | number][] = [
    ['お知らせ', content.news.length],
    ['施設', content.facilities.length],
    ['区画', content.lots.length],
    ['住人', content.residents.length],
    ['メニュー', content.cafeMenu.length],
    ['地図背景', content.mapBackground ? '設定済み' : '未設定'],
  ]
  return (
    <div className="admin-section">
      <h2>サイトの状態</h2>
      <div className="admin-dash-grid">
        {cards.map(([label, val]) => (
          <div key={label} className="admin-dash-card">
            <p className="admin-dash-label">{label}</p>
            <p className="admin-dash-value">{val}</p>
          </div>
        ))}
      </div>
      <p className="admin-help">
        左のメニューから編集したい項目を選んでください。編集内容は「保存」で反映され、サイト全体に公開されます。
      </p>
    </div>
  )
}

/* ---------------- お知らせ ---------------- */
function NewsEditor({
  draft,
  onSave,
}: {
  draft: SiteContent
  onSave: (next: SiteContent) => void
}) {
  const [items, setItems] = useState<NewsItem[]>(draft.news)

  const update = (i: number, patch: Partial<NewsItem>) => {
    setItems((prev) => prev.map((n, idx) => (idx === i ? { ...n, ...patch } : n)))
  }
  const add = () => {
    setItems((prev) => [
      ...prev,
      { date: '', category: 'お知らせ', title: '', body: '' },
    ])
  }
  const remove = (i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
  }
  const save = () => onSave({ ...draft, news: items })

  return (
    <div className="admin-section">
      <div className="admin-head">
        <h2>お知らせ</h2>
        <button className="admin-btn" onClick={add}>+ 追加</button>
      </div>
      <div className="admin-list">
        {items.map((n, i) => (
          <div key={i} className="admin-item">
            <div className="admin-item-row">
              <label>日付
                <input value={n.date} onChange={(e) => update(i, { date: e.target.value })} />
              </label>
              <label>カテゴリ
                <input value={n.category} onChange={(e) => update(i, { category: e.target.value })} />
              </label>
              <button className="admin-btn admin-btn-danger" onClick={() => remove(i)}>削除</button>
            </div>
            <label>タイトル
              <input value={n.title} onChange={(e) => update(i, { title: e.target.value })} />
            </label>
            <label>本文
              <textarea value={n.body ?? ''} onChange={(e) => update(i, { body: e.target.value })} rows={3} />
            </label>
          </div>
        ))}
      </div>
      <div className="admin-save-row">
        <button className="admin-btn admin-btn-primary" onClick={save}>保存</button>
      </div>
    </div>
  )
}

/* ---------------- サイト設定（テキスト） ---------------- */
function TownEditor({
  draft,
  onSave,
}: {
  draft: SiteContent
  onSave: (next: SiteContent) => void
}) {
  const [town, setTown] = useState(draft.town)

  const set = (patch: Partial<SiteContent['town']>) =>
    setTown((prev) => ({ ...prev, ...patch }))
  const setMayor = (patch: Partial<SiteContent['town']['mayor']>) =>
    setTown((prev) => ({ ...prev, mayor: { ...prev.mayor, ...patch } }))
  const setManager = (
    key: 'cafeManager' | 'officeManager',
    patch: Partial<SiteContent['town']['cafeManager']>,
  ) => setTown((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))

  return (
    <div className="admin-section">
      <h2>サイト設定</h2>
      <div className="admin-form">
        <div className="admin-form-grid">
          <label>町の名前
            <input value={town.name} onChange={(e) => set({ name: e.target.value })} />
          </label>
          <label>読みがな
            <input value={town.kana} onChange={(e) => set({ kana: e.target.value })} />
          </label>
        </div>
        <label>キャッチフレーズ
          <input value={town.motto} onChange={(e) => set({ motto: e.target.value })} />
        </label>
        <div className="admin-form-grid">
          <label>常連様の数
            <input
              type="number"
              value={town.regulars}
              onChange={(e) => set({ regulars: Number(e.target.value) })}
            />
          </label>
          <label>面積
            <input value={town.area} onChange={(e) => set({ area: e.target.value })} />
          </label>
        </div>
        <h3>町長</h3>
        <div className="admin-form-grid">
          <label>名前
            <input value={town.mayor.name} onChange={(e) => setMayor({ name: e.target.value })} />
          </label>
          <label>肩書き
            <input value={town.mayor.title} onChange={(e) => setMayor({ title: e.target.value })} />
          </label>
        </div>
        <label>あいさつ文
          <textarea value={town.mayor.greeting} onChange={(e) => setMayor({ greeting: e.target.value })} rows={4} />
        </label>
        <h3>店長（赤柴）</h3>
        <div className="admin-form-grid">
          <label>名前
            <input value={town.cafeManager.name} onChange={(e) => setManager('cafeManager', { name: e.target.value })} />
          </label>
          <label>役割
            <input value={town.cafeManager.role} onChange={(e) => setManager('cafeManager', { role: e.target.value })} />
          </label>
        </div>
        <h3>事務長（白柴）</h3>
        <div className="admin-form-grid">
          <label>名前
            <input value={town.officeManager.name} onChange={(e) => setManager('officeManager', { name: e.target.value })} />
          </label>
          <label>役割
            <input value={town.officeManager.role} onChange={(e) => setManager('officeManager', { role: e.target.value })} />
          </label>
        </div>
        <div className="admin-save-row">
          <button className="admin-btn admin-btn-primary" onClick={() => onSave({ ...draft, town })}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- 登記簿 ---------------- */
function RegistryEditor({
  draft,
  onSave,
}: {
  draft: SiteContent
  onSave: (next: SiteContent) => void
}) {
  const [residents, setResidents] = useState<Resident[]>(draft.residents)
  const [lots, setLots] = useState<Lot[]>(draft.lots)

  const updateResident = (i: number, patch: Partial<Resident>) =>
    setResidents((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const updateLot = (i: number, patch: Partial<Lot>) =>
    setLots((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))

  const save = () => onSave({ ...draft, residents, lots })

  const soldLots = lots.filter((l) => l.status === 'sold')

  return (
    <div className="admin-section">
      <h2>登記簿（所有権者）</h2>
      <p className="admin-help">
        区画の所有者は住人データと紐付いています。住人の名前・ハンドル・権利証番号を編集すると登記簿にも反映されます。
      </p>
      <h3>住人（所有者）</h3>
      <div className="admin-list">
        {residents.map((r, i) => (
          <div key={r.id} className="admin-item">
            <div className="admin-item-row">
              <label>氏名
                <input value={r.name} onChange={(e) => updateResident(i, { name: e.target.value })} />
              </label>
              <label>ハンドル
                <input value={r.handle} onChange={(e) => updateResident(i, { handle: e.target.value })} />
              </label>
            </div>
            <div className="admin-item-row">
              <label>権利証番号
                <input value={r.certificateNo} onChange={(e) => updateResident(i, { certificateNo: e.target.value })} />
              </label>
              <label>移住日
                <input value={r.movedInDate} onChange={(e) => updateResident(i, { movedInDate: e.target.value })} />
              </label>
            </div>
          </div>
        ))}
      </div>
      <h3>完売区画の詳細</h3>
      <div className="admin-list">
        {soldLots.map((lot) => {
          const i = lots.findIndex((l) => l.id === lot.id)
          return (
            <div key={lot.id} className="admin-item">
              <p className="admin-item-title">第{lot.number}区画（{lot.area}㎡）</p>
              <div className="admin-item-row">
                <label>面積
                  <input type="number" value={lot.area} onChange={(e) => updateLot(i, { area: Number(e.target.value) })} />
                </label>
                <label>特徴
                  <input value={lot.note ?? ''} onChange={(e) => updateLot(i, { note: e.target.value })} />
                </label>
              </div>
            </div>
          )
        })}
      </div>
      <div className="admin-save-row">
        <button className="admin-btn admin-btn-primary" onClick={save}>保存</button>
      </div>
    </div>
  )
}

/* ---------------- 地図 ---------------- */
function MapEditor({
  draft,
  onSave,
  uploadImage,
}: {
  draft: SiteContent
  onSave: (next: SiteContent) => void
  uploadImage: (file: File) => Promise<string>
}) {
  const { imageMap } = useContent()
  const [mapBackground, setMapBackground] = useState(draft.mapBackground)
  const [mapBackgroundSize, setMapBackgroundSize] = useState<{
    w: number
    h: number
  } | null>(draft.mapBackgroundSize ?? null)
  const [facilities, setFacilities] = useState<Facility[]>(draft.facilities)
  const [lots, setLots] = useState<Lot[]>(draft.lots)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 背景画像の寸法を取得（viewBox の縦横比に使用）
  const [bgSize, setBgSize] = useState<{ w: number; h: number } | null>(
    draft.mapBackgroundSize ?? null,
  )
  useEffect(() => {
    if (!mapBackground) {
      setBgSize(null)
      return
    }
    const img = new Image()
    img.onload = () => {
      const size = { w: img.naturalWidth, h: img.naturalHeight }
      setBgSize(size)
      setMapBackgroundSize(size)
    }
    img.onerror = () => setBgSize(null)
    img.src = resolveImageUrl(mapBackground, imageMap)
  }, [mapBackground, imageMap])

  const vbW = bgSize?.w ?? 1000
  const vbH = bgSize?.h ?? 660

  const updateFacility = (i: number, patch: Partial<Facility>) =>
    setFacilities((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)))
  const updateLot = (i: number, patch: Partial<Lot>) =>
    setLots((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))

  const handleUpload = async (file: File) => {
    try {
      const url = await uploadImage(file)
      setMapBackground(url)
    } catch (e) {
      alert(`アップロード失敗: ${(e as Error).message}`)
    }
  }

  const save = () =>
    onSave({ ...draft, mapBackground, mapBackgroundSize, facilities, lots })

  return (
    <div className="admin-section">
      <h2>地図</h2>
      <h3>背景画像</h3>
      <div className="admin-item">
        <div className="admin-item-row">
          <input
            type="text"
            value={mapBackground}
            onChange={(e) => setMapBackground(e.target.value)}
            placeholder="画像URL"
          />
          <label className="admin-file">
            アップロード
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleUpload(f)
              }}
            />
          </label>
        </div>
        <p className="admin-help">
          背景画像を設定すると、地図の縦横比が画像に合わせて変わります。未設定の場合はデフォルトの草地（1000×660）です。
        </p>
      </div>

      <h3>施設（アイコン）</h3>
      <div className="admin-list">
        {facilities.map((f, i) => (
          <div key={f.id} className="admin-item">
            <div className="admin-item-row">
              <label>名前
                <input value={f.name} onChange={(e) => updateFacility(i, { name: e.target.value })} />
              </label>
              <label>説明
                <input value={f.description} onChange={(e) => updateFacility(i, { description: e.target.value })} />
              </label>
            </div>
            <div className="admin-item-row">
              <label>X座標
                <input type="number" value={Math.round(f.x)} onChange={(e) => updateFacility(i, { x: Number(e.target.value) })} />
              </label>
              <label>Y座標
                <input type="number" value={Math.round(f.y)} onChange={(e) => updateFacility(i, { y: Number(e.target.value) })} />
              </label>
            </div>
          </div>
        ))}
      </div>

      <h3>区画（クリックで選択 → スライダーで移動）</h3>
      <div className="admin-map-wrap">
        <div className="admin-map">
          <svg
            viewBox={`0 0 ${vbW} ${vbH}`}
            style={{ width: '100%', height: 'auto', touchAction: 'none' }}
          >
            {mapBackground ? (
              <image href={resolveImageUrl(mapBackground, imageMap)} x="0" y="0" width={vbW} height={vbH} preserveAspectRatio="none" />
            ) : (
              <rect width="1000" height="660" fill="#e8ead9" />
            )}
            {lots.map((lot) => {
              const selected = selectedId === lot.id
              return (
                <g
                  key={lot.id}
                  className={selected ? 'selected' : ''}
                  onClick={() => setSelectedId(lot.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={lot.x}
                    y={lot.y}
                    width={lot.w}
                    height={lot.h}
                    rx="6"
                    fill={lot.status === 'sold' ? '#d9b98a' : 'url(#admin-hatch)'}
                    stroke={selected ? '#c0392b' : '#8a5a36'}
                    strokeWidth={selected ? 3 : 1}
                  />
                  <text
                    x={lot.x + lot.w / 2}
                    y={lot.y + lot.h / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="15"
                    fill="#4a3527"
                    pointerEvents="none"
                  >
                    {lot.number}
                  </text>
                </g>
              )
            })}
            {facilities.map((f) => (
              <g
                key={f.id}
                onClick={() => setSelectedId(f.id)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={f.x} cy={f.y} r="18" fill="#8a5a36" opacity="0.85" />
                <text
                  x={f.x}
                  y={f.y + 32}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#4a3527"
                  pointerEvents="none"
                >
                  {f.name}
                </text>
              </g>
            ))}
            <defs>
              <pattern id="admin-hatch" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="#e8dcc2" />
                <line x1="0" y1="0" x2="0" y2="10" stroke="#cdb58c" strokeWidth="3" />
              </pattern>
            </defs>
          </svg>
        </div>
        <div className="admin-map-side">
          <p className="admin-help">区画や施設をクリックして選択 → スライダーまたは座標を入力</p>
          {(() => {
            const lot = lots.find((l) => l.id === selectedId)
            const fac = facilities.find((f) => f.id === selectedId)
            if (lot) {
              const i = lots.findIndex((l) => l.id === lot.id)
              return (
                <div className="admin-item">
                  <p className="admin-item-title">第{lot.number}区画</p>
                  <label className="admin-slider">
                    X（{Math.round(lot.x)}）
                    <input
                      type="range"
                      min={0}
                      max={vbW}
                      value={Math.round(lot.x)}
                      onChange={(e) => updateLot(i, { x: Number(e.target.value) })}
                    />
                  </label>
                  <label className="admin-slider">
                    Y（{Math.round(lot.y)}）
                    <input
                      type="range"
                      min={0}
                      max={vbH}
                      value={Math.round(lot.y)}
                      onChange={(e) => updateLot(i, { y: Number(e.target.value) })}
                    />
                  </label>
                  <div className="admin-item-row">
                    <label>X
                      <input type="number" value={Math.round(lot.x)} onChange={(e) => updateLot(i, { x: Number(e.target.value) })} />
                    </label>
                    <label>Y
                      <input type="number" value={Math.round(lot.y)} onChange={(e) => updateLot(i, { y: Number(e.target.value) })} />
                    </label>
                  </div>
                  <div className="admin-item-row">
                    <label>幅
                      <input type="number" value={lot.w} onChange={(e) => updateLot(i, { w: Number(e.target.value) })} />
                    </label>
                    <label>高さ
                      <input type="number" value={lot.h} onChange={(e) => updateLot(i, { h: Number(e.target.value) })} />
                    </label>
                  </div>
                </div>
              )
            }
            if (fac) {
              const i = facilities.findIndex((f) => f.id === fac.id)
              return (
                <div className="admin-item">
                  <p className="admin-item-title">{fac.name}</p>
                  <label className="admin-slider">
                    X（{Math.round(fac.x)}）
                    <input
                      type="range"
                      min={0}
                      max={vbW}
                      value={Math.round(fac.x)}
                      onChange={(e) => updateFacility(i, { x: Number(e.target.value) })}
                    />
                  </label>
                  <label className="admin-slider">
                    Y（{Math.round(fac.y)}）
                    <input
                      type="range"
                      min={0}
                      max={vbH}
                      value={Math.round(fac.y)}
                      onChange={(e) => updateFacility(i, { y: Number(e.target.value) })}
                    />
                  </label>
                  <div className="admin-item-row">
                    <label>X
                      <input type="number" value={Math.round(fac.x)} onChange={(e) => updateFacility(i, { x: Number(e.target.value) })} />
                    </label>
                    <label>Y
                      <input type="number" value={Math.round(fac.y)} onChange={(e) => updateFacility(i, { y: Number(e.target.value) })} />
                    </label>
                  </div>
                </div>
              )
            }
            return null
          })()}
        </div>
      </div>
      <div className="admin-save-row">
        <button className="admin-btn admin-btn-primary" onClick={save}>保存</button>
      </div>
    </div>
  )
}

/* ---------------- 画像 ---------------- */
function ImageEditor({
  draft,
  onSave,
  uploadImage,
}: {
  draft: SiteContent
  onSave: (next: SiteContent) => void
  uploadImage: (file: File) => Promise<string>
}) {
  const { imageMap } = useContent()
  const [images, setImages] = useState(draft.images)

  const handleUpload = async (key: keyof SiteContent['images'], file: File) => {
    try {
      const url = await uploadImage(file)
      setImages((prev) => ({ ...prev, [key]: url }))
    } catch (e) {
      alert(`アップロード失敗: ${(e as Error).message}`)
    }
  }

  const handleUploadGallery = async (
    key: 'galleryHome' | 'galleryCafe',
    index: number,
    file: File,
  ) => {
    try {
      const url = await uploadImage(file)
      setImages((prev) => {
        const arr = [...prev[key]]
        arr[index] = url
        return { ...prev, [key]: arr }
      })
    } catch (e) {
      alert(`アップロード失敗: ${(e as Error).message}`)
    }
  }

  const setGallery = (key: 'galleryHome' | 'galleryCafe', index: number, url: string) =>
    setImages((prev) => {
      const arr = [...prev[key]]
      arr[index] = url
      return { ...prev, [key]: arr }
    })

  const fields: { key: 'hero' | 'profile' | 'cafe'; label: string }[] = [
    { key: 'hero', label: 'トップのバナー' },
    { key: 'profile', label: '店長の写真' },
    { key: 'cafe', label: 'カフェの写真' },
  ]

  const galleryFields: {
    key: 'galleryHome' | 'galleryCafe'
    label: string
    items: string[]
  }[] = [
    { key: 'galleryHome', label: 'ホームのギャラリー（柴ノ町の風景）', items: images.galleryHome },
    { key: 'galleryCafe', label: 'カフェのギャラリー（柴乃屋のアルバム）', items: images.galleryCafe },
  ]

  return (
    <div className="admin-section">
      <h2>画像</h2>
      <h3>主要画像</h3>
      <div className="admin-list">
        {fields.map(({ key, label }) => (
          <div key={key} className="admin-item">
            <p className="admin-item-title">{label}</p>
            <div className="admin-item-row">
              <input
                type="text"
                value={images[key]}
                onChange={(e) => setImages((prev) => ({ ...prev, [key]: e.target.value }))}
              />
              <label className="admin-file">
                アップロード
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleUpload(key, f)
                  }}
                />
              </label>
            </div>
            <img
              src={resolveImageUrl(images[key], imageMap)}
              alt={label}
              className="admin-preview"
            />
          </div>
        ))}
      </div>

      <h3>ギャラリー画像</h3>
      <p className="admin-help">画像を設定すると、サイトのプレースホルダーが写真に置き換わります。未設定の場合はアイコン表示です。</p>
      {galleryFields.map(({ key, label, items }) => (
        <div key={key} className="admin-item">
          <p className="admin-item-title">{label}</p>
          <div className="admin-gallery-grid">
            {items.map((url, i) => (
              <div key={i} className="admin-gallery-item">
                {url && (
                  <img
                    src={resolveImageUrl(url, imageMap)}
                    alt=""
                    className="admin-gallery-thumb"
                  />
                )}
                <div className="admin-item-row">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setGallery(key, i, e.target.value)}
                    placeholder={`画像 ${i + 1} のURL`}
                  />
                  <label className="admin-file">
                    ↑
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) handleUploadGallery(key, i, f)
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="admin-save-row">
        <button className="admin-btn admin-btn-primary" onClick={() => onSave({ ...draft, images })}>
          保存
        </button>
      </div>
    </div>
  )
}
