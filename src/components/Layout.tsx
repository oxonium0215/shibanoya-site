import { NavLink, Outlet } from 'react-router-dom'
import { town } from '../data/town'
import { ShibaIcon } from './icons'

const navItems = [
  { to: '/', label: 'ホーム' },
  { to: '/map', label: '町の地図' },
  { to: '/cafe', label: '純喫茶柴乃屋' },
  { to: '/lots', label: '別荘地分譲' },
  { to: '/registry', label: '土地登記簿' },
]

export default function Layout() {
  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="brand">
            <ShibaIcon size={30} className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">{town.name}</span>
              <span className="brand-kana">{town.kana}</span>
            </span>
          </NavLink>
          <nav className="site-nav" aria-label="メインナビゲーション">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p className="footer-motto">{town.motto}</p>
        <p className="footer-copy">
          © 令和6年 {town.name}役場（デモサイト）
          <br />
          純喫茶 柴乃屋 Instagram：
          <a href="https://www.instagram.com/cafe_shibanoya/" target="_blank" rel="noreferrer">
            @cafe_shibanoya
          </a>
        </p>
      </footer>
    </div>
  )
}
