import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { FireworksIcon, RiverIcon, ForestIcon } from '../components/icons'

export default function LotsPage() {
  const { content } = useContent()
  const { town, lots, residents } = content
  const phase1Lots = lots.filter((l) => l.phase === 1)
  const phase2Lots = lots.filter((l) => l.phase === 2)
  const residentById = Object.fromEntries(residents.map((r) => [r.id, r]))

  return (
    <div>
      <h1 className="page-title">別荘地分譲のご案内</h1>
      <p className="page-lead">
        「柴ノ別荘地」は、{town.name}のなかでも特に眺望の良い場所に広がる別荘地です。
        第1期（10区画）は常連様1,000名突破記念のプレゼント企画で完売いたしました。
        第2期は常連様2,000名突破記念として、20区画を公開抽選会で分譲いたしました。
      </p>

      {/* エリア紹介 */}
      <section>
        <h2 className="section-title">別荘地のエリア</h2>
        <div className="area-grid">
          <div className="card area-card">
            <div className="area-photo">
              <FireworksIcon size={36} className="area-icon" aria-hidden="true" />
            </div>
            <p className="area-name">花火を一望できる人気エリア</p>
            <p className="area-desc">夏祭りの花火が楽しめる、いちばん人気の高台。</p>
          </div>
          <div className="card area-card">
            <div className="area-photo">
              <RiverIcon size={36} className="area-icon" aria-hidden="true" />
            </div>
            <p className="area-name">川のせせらぎが心地よい川沿いエリア</p>
            <p className="area-desc">柴ノ川のせせらぎが聞こえる、静かな川沿い。</p>
          </div>
          <div className="card area-card">
            <div className="area-photo">
              <ForestIcon size={36} className="area-icon" aria-hidden="true" />
            </div>
            <p className="area-name">静かな森に包まれた癒しのエリア</p>
            <p className="area-desc">山側の静かな森。秋の紅葉が楽しめます。</p>
          </div>
        </div>
      </section>

      {/* 第1期 */}
      <section>
        <h2 className="section-title">
          第1期 <span className="badge badge-sold">完売済み</span>
        </h2>
        <p className="section-note">
          常連様1,000名突破を記念して、10区画を特別住民として先着10名様へプレゼント。
          おかげさまで全区画にオーナー様が決まりました。
        </p>
        <div className="lot-grid">
          {phase1Lots.map((lot) => {
            const owner = lot.ownerId ? residentById[lot.ownerId] : undefined
            return (
              <div key={lot.id} className="card lot-card">
                <div
                  className="lot-swatch"
                  style={{ background: owner?.color ?? '#e8b877' }}
                  aria-hidden="true"
                />
                <div className="lot-card-body">
                  <p className="lot-card-title">
                    第{lot.number}区画
                    <span className="badge badge-sold">完売</span>
                  </p>
                  <p className="lot-card-area">{lot.area} ㎡</p>
                  {lot.note && <p className="lot-card-note">{lot.note}</p>}
                  {owner && (
                    <p className="lot-card-owner">
                      所有者：{owner.name}（{owner.handle}）
                      <br />
                      <span className="lot-card-date">引き渡し：{lot.acquiredDate}</span>
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 第2期 */}
      <section>
        <h2 className="section-title">
          第2期 <span className="badge badge-available">分譲決定</span>
        </h2>
        <p className="section-note">
          常連様2,000名突破を記念し、第二期「柴ノ別荘地」全20区画をプレゼント。
          公開抽選会（Instagram LIVE）にて当選者が決定いたしました。
        </p>
        <div className="lot-grid">
          {phase2Lots.map((lot) => (
            <div key={lot.id} className="card lot-card lot-card-future">
              <div className="lot-swatch lot-swatch-future" aria-hidden="true" />
              <div className="lot-card-body">
                <p className="lot-card-title">
                  第{lot.number}区画
                  <span className="badge badge-available">当選者決定</span>
                </p>
                <p className="lot-card-area">{lot.area} ㎡</p>
                <p className="lot-card-note">公開抽選会にて当選者が決定いたしました。</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 住人一覧 */}
      <section>
        <h2 className="section-title">柴ノ町の住人（第1期 10名）</h2>
        <p className="section-note">
          第1期で分譲された別荘地に、現在10名の柴犬たちが暮らしています。
        </p>
        <div className="resident-grid">
          {residents.map((r) => (
            <div key={r.id} className="card resident-card">
              <div className="resident-head">
                <div
                  className="resident-dot"
                  style={{ background: r.color }}
                  aria-hidden="true"
                />
                <div>
                  <p className="resident-name">{r.name}</p>
                  <p className="resident-handle">{r.handle}</p>
                </div>
              </div>
              <p className="resident-date">移住：{r.movedInDate}</p>
            </div>
          ))}
        </div>
        <p className="section-note note-sample">
          ※ 名前・ハンドルはサンプルです。実際の当選者の方のお名前にお書き換えください。
        </p>
      </section>

      <div className="page-actions">
        <Link className="btn" to="/map">
          地図で区画を見る
        </Link>
        <Link className="btn btn-secondary" to="/registry">
          土地登記簿を閲覧する
        </Link>
      </div>
    </div>
  )
}
