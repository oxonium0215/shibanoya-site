// 管理画面専用の Firestore 書き込み（Firebase SDK を使用）
// 動的 import 経由で読み込まれ、公開バンドルには含まれません。
import { doc, setDoc } from 'firebase/firestore'
import type { SiteContent } from '../data/content'
import { db } from './firebase'

const CONTENT_DOC = 'content/site'

/** コンテンツ全体を Firestore に保存する */
export async function saveContentToFirestore(next: SiteContent): Promise<void> {
  await setDoc(doc(db, CONTENT_DOC), next)
}
