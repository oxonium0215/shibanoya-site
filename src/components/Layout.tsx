import { NavLink, Outlet } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { ShibaIcon } from './icons'

const navItems = [
  { to: '/', label: 'ホーム' },
  { to: '/map', label: '町の地図' },
  { to: '/cafe', label: '純喫茶柴乃屋' },
  { to: '/lots', label: '別荘地分譲' },
  { to: '/registry', label: '土地登記簿' },
]

/** 令和の年（2018年 = 平成30年 = 令和元年） */
function reiwaYear(): string {
  return `令和${new Date().getFullYear() - 2018}年`
}

export default function Layout() {
  const { content } = useContent()
  const { town } = content

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
          © {reiwaYear()} {town.name}役場
          <br />
          純喫茶 柴乃屋 Instagram：
          <a href={town.instagramUrl} target="_blank" rel="noreferrer">
            {town.instagramHandle}
          </a>
          <br />
          <span className="footer-fictional">
            {town.name}は、純喫茶 柴乃屋の物語から生まれた架空の町です。
          </span>
        </p>
      </footer>
    </div>
  )
}
