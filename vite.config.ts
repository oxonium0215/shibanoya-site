import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 相対パスでも公開できるように base を設定（GitHub Pages のサブディレクトリ配信にも対応）
  base: './',
})