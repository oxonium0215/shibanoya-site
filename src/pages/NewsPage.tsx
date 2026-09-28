import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { NEWS_CATEGORIES } from '../data/town'

const ALL = 'すべて'

export default function NewsPage() {
  const { content } = useContent()
  const { town, news } = content
  const [category, setCategory] = useState<string>(ALL)

  // 実際に存在するカテゴリのみ選択肢に出す（＋定義済みカテゴリ）
  const categories = Array.from(
    new Set<string>([...NEWS_CATEGORIES, ...news.map((n) => n.category)]),
  )
  const results =
    category === ALL ? news : news.filter((n) => n.category === category)

  return (
    <div>
      <h1 className="page-title">お知らせ</h1>
      <p className="page-lead">
        {town.name}からのお知らせ一覧です。カテゴリーで絞り込めます。
      </p>

      <div className="news-filter" role="group" aria-label="カテゴリーで絞り込む">
        {[ALL, ...categories].map((c) => (
          <button
            key={c}
            type="button"
            className={`filter-chip${category === c ? ' active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="search-count">{results.length} 件のお知らせ</p>

      {results.length === 0 ? (
        <div className="card registry-empty">
          <p>該当するお知らせはありません。</p>
        </div>
      ) : (
        <ul className="news-list">
          {results.map((n) => (
            <li key={n.title} className="news-item">
              <span className="news-date">{n.date}</span>
              <div>
                <span className="badge">{n.category}</span>
                <p className="news-title">{n.title}</p>
                {n.body && <p className="news-body">{n.body}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="page-actions">
        <Link className="btn btn-secondary" to="/">
          ホームへ戻る
        </Link>
      </div>
    </div>
  )
}
