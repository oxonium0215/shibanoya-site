import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ContentProvider } from './context/ContentContext'
import './styles/global.css'

// HashRouter を使うことで、静的ホスティング（Firebase Hosting 等）でも
// サーバー側の設定なしに /map や /registry のようなURLで配信できる。
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ContentProvider>
        <App />
      </ContentProvider>
    </HashRouter>
  </StrictMode>,
)