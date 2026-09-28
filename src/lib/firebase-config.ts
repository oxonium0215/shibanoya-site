// Firebase の設定値と判定（SDK を一切 import しない軽量モジュール）
// 公開ページは Firestore REST API を使うため、SDK を持ち込まないよう分離しています。

const env = import.meta.env

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
}

export const PROJECT_ID = firebaseConfig.projectId
export const API_KEY = firebaseConfig.apiKey

/** Firebase が設定済みか */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain,
  )
}
