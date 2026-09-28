import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Tailwind はレイアウト用途で段階導入（既存 CSS は legacy レイヤーで共存）
  plugins: [react(), tailwindcss()],
  // 相対パスでも公開できるように base を設定（静的ホスティングのサブディレクトリ配信にも対応）
  base: './',
})
