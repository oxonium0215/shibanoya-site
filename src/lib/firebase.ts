// 公開ページが使う Firebase の軽量セット（Firestore のみ）
// ※ Firebase Auth は管理画面専用のため lib/firebase-auth.ts に分離しています。

import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { app } from './firebase-app'

export { isFirebaseConfigured } from './firebase-app'

export const db = getFirestore(app)

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
