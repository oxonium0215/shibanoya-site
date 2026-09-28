import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { SiteContent } from '../data/content'
import { buildDefaultContent } from '../data/defaultContent'
import { fetchImages, fetchSiteContent } from '../lib/firestore-rest'
import { isFirebaseConfigured } from '../lib/firebase-config'
import type { ImageMap } from '../lib/image'
import { normalizeContent } from '../lib/normalize'

/** 再表示時に再取得するまでの最短間隔（ミリ秒） */
const REFRESH_INTERVAL = 30_000

interface ContentContextValue {
  /** 現在のコンテンツ（Firestore から取得、未設定ならデフォルト） */
  content: SiteContent
  /** 画像参照（img:xxxx）→ dataURL のマップ */
  imageMap: ImageMap
  /** 読み込み中か */
  loading: boolean
  /** 保存済みのコンテンツを取得できたか */
  isLive: boolean
  /** コンテンツ全体を保存（管理画面のみ。SDK を動的読み込み） */
  saveContent: (next: SiteContent) => Promise<void>
  /** 部分更新（マージ）して保存 */
  updateContent: (patch: Partial<SiteContent>) => Promise<void>
  /** 再取得 */
  refresh: () => Promise<void>
}

const ContentContext = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => buildDefaultContent())
  const [imageMap, setImageMap] = useState<ImageMap>({})
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const lastFetchedAt = useRef(0)

  const configured = isFirebaseConfigured()

  const refresh = useCallback(async () => {
    if (!configured) {
      setLoading(false)
      return
    }
    try {
      const [raw, images] = await Promise.all([fetchSiteContent(), fetchImages()])
      if (raw) {
        setContent(normalizeContent(raw))
        setIsLive(true)
      } else {
        // まだ保存されていない → デフォルト
        setContent(buildDefaultContent())
        setIsLive(false)
      }
      setImageMap(images)
      lastFetchedAt.current = Date.now()
    } catch (err) {
      console.warn('content load failed', (err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [configured])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // タブに戻ってきたときに再取得（更新を反映しやすくする）
  useEffect(() => {
    if (!configured) return
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastFetchedAt.current < REFRESH_INTERVAL) return
      void refresh()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [configured, refresh])

  const saveContent = useCallback(
    async (next: SiteContent) => {
      // 画面には即時反映
      setContent(next)
      if (!configured) return
      try {
        // Firestore SDK は管理画面の保存時のみ読み込む（公開バンドルに含めない）
        const { saveContentToFirestore } = await import('../lib/firestore-write')
        await saveContentToFirestore(next)
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
    () => ({ content, imageMap, loading, isLive, saveContent, updateContent, refresh }),
    [content, imageMap, loading, isLive, saveContent, updateContent, refresh],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
