// Firebase アプリの初期化（管理画面で SDK を使うための土台）
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './firebase-config'

/** Firebase アプリ本体 */
export const app = initializeApp(firebaseConfig)

export { isFirebaseConfigured } from './firebase-config'
