// 公開ページ用の Firestore 読み取り（REST API）
// Firestore SDK（数百KB）を公開バンドルに含めないため、fetch で直接読みます。
// セキュリティルールで content / images は誰でも read 可能です。

import type { SiteContent } from '../data/content'
import type { ImageMap } from './image'
import { API_KEY, PROJECT_ID, isFirebaseConfigured } from './firebase-config'

const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

/** Firestore REST の Value 形式を JS の値へ変換する */
function parseValue(value: Record<string, unknown>): unknown {
  if ('nullValue' in value) return null
  if ('stringValue' in value) return value.stringValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return Number(value.doubleValue)
  if ('booleanValue' in value) return value.booleanValue
  if ('timestampValue' in value) return value.timestampValue
  if ('arrayValue' in value) {
    const arr = (value.arrayValue as { values?: Record<string, unknown>[] }).values ?? []
    return arr.map(parseValue)
  }
  if ('mapValue' in value) {
    const fields = (value.mapValue as { fields?: Record<string, Record<string, unknown>> })
      .fields ?? {}
    return parseFields(fields)
  }
  return null
}

function parseFields(
  fields: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(fields)) {
    out[key] = parseValue(value)
  }
  return out
}

/** content/site ドキュメントを取得（未作成なら null） */
export async function fetchSiteContent(): Promise<Partial<SiteContent> | null> {
  if (!isFirebaseConfigured()) return null
  const res = await fetch(`${BASE}/content/site?key=${API_KEY}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`content fetch failed: ${res.status}`)
  const doc = (await res.json()) as { fields?: Record<string, Record<string, unknown>> }
  return parseFields(doc.fields ?? {}) as Partial<SiteContent>
}

/** images コレクションを取得して imageMap を作る */
export async function fetchImages(): Promise<ImageMap> {
  if (!isFirebaseConfigured()) return {}
  const res = await fetch(`${BASE}/images?pageSize=300&key=${API_KEY}`)
  if (!res.ok) throw new Error(`images fetch failed: ${res.status}`)
  const json = (await res.json()) as {
    documents?: { name: string; fields?: Record<string, Record<string, unknown>> }[]
  }
  const map: ImageMap = {}
  for (const doc of json.documents ?? []) {
    const fields = parseFields(doc.fields ?? {}) as { data?: string }
    const id = doc.name.split('/').pop()
    if (id && fields.data) map[`img:${id}`] = fields.data
  }
  return map
}
