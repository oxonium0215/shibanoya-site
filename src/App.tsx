import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import CafePage from './pages/CafePage'
import LotsPage from './pages/LotsPage'
import RegistryPage from './pages/RegistryPage'
import AdminPage from './pages/admin/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/cafe" element={<CafePage />} />
        <Route path="/lots" element={<LotsPage />} />
        <Route path="/registry" element={<RegistryPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
      {/* 管理画面（レイアウトなし・専用スタイル） */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
    </Routes>
  )
}
