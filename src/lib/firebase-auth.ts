// 管理画面専用の Firebase Auth。
// 公開ページのバンドルに firebase/auth を含めないため、別モジュールに分離しています。
import { getAuth } from 'firebase/auth'
import { app } from './firebase-app'

export const auth = getAuth(app)
