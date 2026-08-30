import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  query,
  limit,
} from 'firebase/firestore'
import type { SiteContent } from '../data/content'
import { buildDefaultContent } from '../data/defaultContent'
import { db, isFirebaseConfigured } from '../lib/firebase'
import type { ImageMap } from '../lib/image'

const CONTENT_DOC = 'content/site'

interface ContentContextValue {
  /** 現在のコンテンツ（Firestore から取得、未設定ならデフォルト） */
  content: SiteContent
  /** 画像参照（img:xxxx）→ dataURL のマップ */
  imageMap: ImageMap
  /** Firebase 接続中か */
  loading: boolean
  /** サーバーに保存済みのコンテンツがあるか */
  isLive: boolean
  /** コンテンツ全体を Firestore に保存 */
  saveContent: (next: SiteContent) => Promise<void>
  /** 部分更新（マージ）して保存 */
  updateContent: (patch: Partial<SiteContent>) => Promise<void>
}

const ContentContext = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => buildDefaultContent())
  const [imageMap, setImageMap] = useState<ImageMap>({})
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  // Firebase 設定が無い場合はデフォルトのまま
  const configured = isFirebaseConfigured()

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }
    // リアルタイム購読: 管理画面での保存が即座に反映される
    const unsub = onSnapshot(
      doc(db, CONTENT_DOC),
      (snap) => {
        if (snap.exists()) {
          setContent(snap.data() as SiteContent)
          setIsLive(true)
        } else {
          // まだ保存されていない → デフォルト
          setContent(buildDefaultContent())
          setIsLive(false)
        }
        setLoading(false)
      },
      (err) => {
        console.warn('content load failed', err)
        setLoading(false)
      },
    )
    return () => unsub()
  }, [configured])

  // 画像マップの購読（img:xxxx → dataURL）
  useEffect(() => {
    if (!configured) {
      setImageMap({})
      return
    }
    const unsub = onSnapshot(
      query(collection(db, 'images'), limit(500)),
      (snap) => {
        const map: ImageMap = {}
        snap.forEach((d) => {
          const data = d.data() as { data?: string }
          if (data.data) map[`img:${d.id}`] = data.data
        })
        setImageMap(map)
      },
      (err) => {
        console.warn('images load failed', err)
      },
    )
    return () => unsub()
  }, [configured])

  const saveContent = useCallback(
    async (next: SiteContent) => {
      setContent(next)
      if (!configured) return
      try {
        await setDoc(doc(db, CONTENT_DOC), next)
        setIsLive(true)
      } catch (err) {
        console.warn('content save failed', (err as Error).message)
      }
    },
    [configured],
  )

  const updateContent = useCallback(
    async (patch: Partial<SiteContent>) => {
      setContent((prev) => {
        const next = { ...prev, ...patch }
        void saveContent(next)
        return next
      })
    },
    [saveContent],
  )

  const value = useMemo(
    () => ({ content, imageMap, loading, isLive, saveContent, updateContent }),
    [content, imageMap, loading, isLive, saveContent, updateContent],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
