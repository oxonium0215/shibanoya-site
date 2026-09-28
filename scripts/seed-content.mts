/**
 * 現在のデフォルトコンテンツ（src/data/defaultContent.ts）を Firebase プロジェクトの
 * Firestore ドキュメント content/site に書き込む（＝新仕様へ移行する）スクリプト。
 *
 * 使い方:
 *   npx esbuild scripts/seed-content.mts --bundle --platform=node --format=esm --outfile=scratch/seed.mjs
 *   node scratch/seed.mjs
 */
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { buildDefaultContent } from '../src/data/defaultContent'

const PROJECT_ID = 'shigbanocho-site'

// --- Firebase CLI の認証情報からアクセストークンを得る ---
const CLIENT_ID =
  '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com'
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi'

function readRefreshToken(): string {
  const candidates = [
    path.join(homedir(), '.config', 'configstore', 'firebase-tools.json'),
    path.join(process.env.APPDATA ?? '', 'configstore', 'firebase-tools.json'),
  ]
  for (const p of candidates) {
    try {
      const raw = JSON.parse(readFileSync(p, 'utf-8')) as {
        tokens?: { refresh_token?: string }
      }
      if (raw.tokens?.refresh_token) return raw.tokens.refresh_token
    } catch {
      // 次を試す
    }
  }
  throw new Error('firebase-tools の認証情報が見つかりません。firebase login を実行してください。')
}

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: readRefreshToken(),
    }),
  })
  const json = (await res.json()) as { access_token?: string }
  if (!json.access_token) throw new Error('アクセストークンの取得に失敗しました')
  return json.access_token
}

// --- JS の値を Firestore REST の Value 形式へ変換 ---
function toValue(v: unknown): unknown {
  if (v === null || v === undefined) return { nullValue: null }
  if (typeof v === 'string') return { stringValue: v }
  if (typeof v === 'number') {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
  }
  if (typeof v === 'boolean') return { booleanValue: v }
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } }
  if (typeof v === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, toValue(x)]),
        ),
      },
    }
  }
  return { nullValue: null }
}

async function main() {
  const content = buildDefaultContent()
  const token = await getAccessToken()

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/content/site`
  const body = JSON.stringify({ fields: (toValue(content) as { mapValue: { fields: unknown } }).mapValue.fields })

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Firestore への書き込みに失敗: ${res.status} ${text.slice(0, 300)}`)
  }

  console.log(
    `書き込み完了: 地区${content.districts.length} / 区画${content.lots.length} / お知らせ${content.news.length} / 住人${content.residents.length}`,
  )
}

await main()
