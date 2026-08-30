// Firebase 初期化
// 環境変数: VITE_FIREBASE_API_KEY など（.env に設定）
// 未設定の場合はビルド時ダミー（アプリはデフォルトコンテンツで動作）

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

/** Firebase が設定済みか */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain,
  )
}

/**
 * 画像をブラウザ内で縮小・圧縮し、Firestore の images コレクションに保存する。
 * 返り値は参照 ID（"img:xxxx"）。公開ページは imageMap で dataURL に解決する。
 * （Firebase Storage は無料プランで使えないため、Firestore に直接保存する）
 */
export async function uploadImage(file: File): Promise<string> {
  const dataUrl = await compressImage(file, 1200, 0.82)
  const docRef = await addDoc(collection(db, 'images'), {
    data: dataUrl,
    mime: 'image/jpeg',
    createdAt: new Date().toISOString(),
  })
  return `img:${docRef.id}`
}

/**
 * 画像を縮小・圧縮して dataURL を返す。
 * - 最大辺を maxSize に制限（縦横比は維持）
 * - JPEG に変換（透明 PNG は白背景に合成）
 */
export function compressImage(
  file: File,
  maxSize: number,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      try {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('canvas context unavailable')
        // PNG の透明部分を白に
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      } catch (e) {
        reject(e)
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('画像を読み込めませんでした'))
    }
    img.src = url
  })
}
