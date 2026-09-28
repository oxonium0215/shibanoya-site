# 柴ノ町役場 公式サイト

純喫茶柴乃屋（Instagram: @cafe_shibanoya）の物語の中にある架空の町「柴ノ町」の公式サイトです。

## 構成

- **フロントエンド**: React 18 + Vite + TypeScript（HashRouter）
- **ホスティング**: Firebase Hosting（無料プラン）
- **DB**: Cloud Firestore（コンテンツの保存・公開・画像の保存）
- **認証**: Firebase Authentication（メール+パスワード）

管理画面（`/#/admin`）で編集すると、**Firestore に即時保存され、サイト全体にリアルタイム反映**されます。Git やデプロイ作業は不要です。

公開URL: **https://shibanocho-site.web.app**

### 地区・街区モデル

別荘地は「地区・街区」単位で管理します。管理画面の「地区」タブで地区を追加し、
「地図」タブで地区マーカーと各区画の位置を調整できます。
区画番号は地区ごとに採番し、接頭辞を付けられます（例：柴ノ川地区 → 川1、川2 …）。

### 画像の保存について

Firebase Storage は無料プラン（Spark）で利用できないため、**画像はブラウザ内で自動縮小・圧縮（最大幅1200px・JPEG）して Firestore に直接保存**します。アップロード作業に特別な操作は不要で、完全無料（クレカ登録不要）で運用できます。

## セットアップ（開発者）

### 1. Firebase プロジェクト作成

1. [Firebase コンソール](https://console.firebase.google.com/) でプロジェクトを作成
2. 「Hosting」「Firestore Database」「Authentication」を有効化
   - **Authentication**: ログイン方法で「メール/パスワード」を有効化
   - **Firestore**: 本番モードで作成
3. プロジェクト設定 → マイアプリ → Web アプリを追加し、設定値を `.env` にコピー

### 2. 環境変数

`.env` ファイルを作成し、`.env.example` の各項目を埋めます（値は Firebase コンソールの「プロジェクト設定 → マイアプリ」から取得）。

### 3. プロジェクト ID の設定

`.firebaserc` の `shibanoya-town` を、作成したプロジェクトの ID に書き換えます。またはターミナルで `npx firebase use --add` を実行して選択します。

### 4. デプロイ

```bash
npm install
npm run login          # 初回のみ（Firebase にログイン）
npm run deploy         # ビルド + Hosting デプロイ
```

デプロイ後、`https://shibanocho-site.web.app` で公開されます（`firebase.json` の `hosting.site` で指定）。

### 5. セキュリティルールの反映

```bash
npm run deploy:all     # Hosting + Firestore ルールをまとめて反映
```

初回は `npm run deploy:all` を使ってください。

### 6. 管理用アカウントの作成

Firebase コンソール → Authentication → Users → 「ユーザーを追加」で、相手方に渡すメールアドレス+パスワードを作成します。

相手方は `https://shibanocho-site.web.app/#/admin` にアクセスし、受け取ったメール+パスワードでログインするだけで編集できます（Google アカウントの作成は不要）。

## 管理画面でできること

| タブ | できること |
| --- | --- |
| お知らせ | 追加・編集・削除（カテゴリーは5種から選択） |
| サイト設定 | 町の名前・キャッチコピー・開町日・Instagram/ショップURL・町長あいさつ・店長/事務長情報 |
| 地区 | 地区・街区の追加・編集・削除（種別・状況・区画番号の接頭辞・図面サイズ） |
| 住人・登記 | 住人の氏名・ハンドル・権利証番号・掲載許可、地区ごとの区画の追加・編集・削除 |
| 地図 | 町全体図の地区マーカー／施設の座標、各地区の区画の座標をスライダーで編集 |
| 画像 | ヒーロー・カフェ・店長・事務長・ギャラリー写真の差し替え（アップロード可） |

保存すると Firestore に書き込まれ、**即座にサイトへ反映**されます。

## ローカル開発

```bash
npm install
npm run dev        # http://localhost:5173
```

Firebase の設定（`.env`）が無い場合は、サイトはデフォルトコンテンツで表示され、管理画面のログインはできません。

## 開発方針（UI）

- **アイコン**: `@tabler/icons-react` を使用します。**アイコンの自前 SVG 直書きは禁止**です。
  バレル import は tree-shake が効かず全アイコンを巻き込むため、`src/components/icons.tsx` で
  個別ファイル（`@tabler/icons-react/dist/esm/icons/*.mjs`）から読み込んで再エクスポートしています。
  新しいアイコンが必要なときも、同じファイルに追加してください。
  - 例外: 地図キャンバス（`MapPage` / 管理画面の地図エディタ）は「データ図」であってアイコンではないため SVG で描画します。`public/favicon.svg` はアセットです。
- **レイアウト**: Tailwind CSS（`src/styles/tailwind.css`）。preflight は既存デザインと衝突するため読み込まず、
  既存 CSS は `@layer legacy` に置いて Tailwind ユーティリティが上書きできるレイヤー順にしています。
  デザイントークン（色・フォント）は `@theme` に移植済みなので `bg-paper` `text-ink` `font-display` などが使えます。
- **対話部品（管理画面・モーダル）**: Radix UI のプリミティブ（Tabs / Checkbox / Dialog）を使用します。
  見た目は Tailwind クラスで調整し、フォーカストラップやキーボード操作・ARIA はライブラリに任せます。

## データの場所

- コンテンツ: Firestore の `content/site` ドキュメント
- アップロード画像: Firestore の `images` コレクション（dataURL として保存）

## 注意

- 無料プラン（Spark）の範囲内で運用できます（月間 10GB 転送・読み書き回数に制限あり。小規模サイトなら十分）
- 管理画面のログインアカウントは Firebase コンソールから管理できます（追加・削除・パスワード変更）
