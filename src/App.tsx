import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import CafePage from './pages/CafePage'
import LotsPage from './pages/LotsPage'
import RegistryPage from './pages/RegistryPage'
import NewsPage from './pages/NewsPage'

// 管理画面は公開ページと分離して遅延読み込みする
// （Firebase Auth・Radix・各エディタを公開バンドルに含めない）
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))

const adminFallback = (
  <div className="flex min-h-screen items-center justify-center bg-paper-2 text-sm text-muted">
    読み込み中…
  </div>
)

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:districtId" element={<MapPage />} />
        <Route path="/cafe" element={<CafePage />} />
        <Route path="/lots" element={<LotsPage />} />
        <Route path="/lots/:districtId" element={<LotsPage />} />
        <Route path="/registry" element={<RegistryPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
      {/* 管理画面（レイアウトなし・専用スタイル） */}
      <Route
        path="/admin"
        element={<Suspense fallback={adminFallback}>{<AdminPage />}</Suspense>}
      />
      <Route
        path="/admin/*"
        element={<Suspense fallback={adminFallback}>{<AdminPage />}</Suspense>}
      />
    </Routes>
  )
}
