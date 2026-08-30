// 画像パスを解決するヘルパー
// 画像の参照文字列を実際の URL に解決する。
// - "img:xxxx" → Firestore の images コレクションから取得した dataURL（imageMap）
// - http(s):// → そのまま（外部URL）
// - / で始まる絶対パス → そのまま（Firebase Hosting はルートで配信）

export type ImageMap = Record<string, string>

/**
 * 画像参照を解決する。
 * @param src 参照文字列（img:xxxx / URL / 絶対パス）
 * @param imageMap Firestore から取得した画像マップ（img:xxxx → dataURL）
 */
export function resolveImageUrl(src: string, imageMap?: ImageMap): string {
  if (!src) return src
  if (src.startsWith('img:')) {
    return imageMap?.[src] || src
  }
  return src
}
