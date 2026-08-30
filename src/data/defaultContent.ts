import type { SiteContent } from './content'
import { town, facilities, newsItems } from './town'
import { lots } from './lots'
import { residents } from './residents'

/** サーバーが無い・未編集の場合に使うデフォルト（ビルトイン）コンテンツ */
export function buildDefaultContent(): SiteContent {
  return {
    town: {
      name: town.name,
      kana: town.kana,
      motto: town.motto,
      regulars: town.regulars,
      area: town.area,
      established: town.established,
      mayor: {
        name: town.mayor.name,
        title: town.mayor.title,
        occupation: town.mayor.occupation,
        greeting: town.mayor.greeting,
      },
      cafeManager: { ...town.cafeManager },
      officeManager: { ...town.officeManager },
    },
    facilities: facilities.map((f) => ({ ...f })),
    news: newsItems.map((n) => ({ ...n })),
    lots: lots.map((l) => ({ ...l })),
    residents: residents.map((r) => ({ ...r })),
    cafeMenu: [
      {
        name: '抹茶ラテ',
        price: '550円',
        desc: '柴ノ町商店街のお茶屋さんで教えてもらった宇治抹茶。柴犬のお顔のラテアートが自慢。',
      },
      {
        name: '柴犬三色団子',
        price: '600円',
        desc: '白柴さん・赤柴さん・黒柴さんをイメージした3色の団子を一本の串に。抹茶ラテとのセットも。',
      },
      {
        name: '柴犬クッキー',
        price: '400円',
        desc: '町長も大好物の名物クッキー。お土産に大人気。',
      },
      {
        name: 'コーヒーゼリー バニラアイスのせ',
        price: '650円',
        desc: 'SHIBANO FARM のバニラアイスをのせた夏の定番。',
      },
      {
        name: '柴乃屋特製ナポリタン',
        price: '800円',
        desc: 'アルバイトの子たちの賄いにも登場する人気メニュー。',
      },
      {
        name: '七色かき氷 バニラアイスのせ',
        price: '700円',
        desc: 'お盆の時期に登場する特別メニュー。お空組の子たちへの想いを込めて。',
      },
    ],
    mapBackground: '',
    mapBackgroundSize: null,
    images: {
      hero: '/images/bannar.jpg',
      profile: '/images/profile.jpg',
      cafe: '/images/sangoku-dango.jpg',
      galleryHome: ['', '', '', '', '', ''],
      galleryCafe: ['', '', '', '', '', ''],
    },
  }
}
