# 柴ノ町役場 公式サイト

純喫茶柴乃屋（Instagram: @cafe_shibanoya）の物語の中にある架空の町「柴ノ町」の公式サイトです。

## 構成

- **フロントエンド**: React 18 + Vite + TypeScript（HashRouter）
- **ホスティング**: Firebase Hosting（無料プラン）
- **DB**: Cloud Firestore（コンテンツの保存・公開・画像の保存）
- **認証**: Firebase Authentication（メール+パスワード）

管理画面（`/#/admin`）で編集すると、**Firestore に即時保存され、サイト全体にリアルタイム反映**されます。Git やデプロイ作業は不要です。

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

デプロイ後、`https://<project-id>.web.app` で公開されます。

### 5. セキュリティルールの反映

```bash
npm run deploy:all     # Hosting + Firestore ルールをまとめて反映
```

初回は `npm run deploy:all` を使ってください。

### 6. 管理用アカウントの作成

Firebase コンソール → Authentication → Users → 「ユーザーを追加」で、相手方に渡すメールアドレス+パスワードを作成します。

相手方は `https://<project-id>.web.app/#/admin` にアクセスし、受け取ったメール+パスワードでログインするだけで編集できます（Google アカウントの作成は不要）。

## 管理画面でできること

| タブ | できること |
| --- | --- |
| お知らせ | 追加・編集・削除 |
| サイト設定 | 町の名前・キャッチコピー・町長あいさつ・店長/事務長情報 |
| 登記簿 | 住人（所有者）の名前・ハンドル・権利証番号・区画の詳細 |
| 地図 | 背景画像の設定（縦横比に自動対応）・施設/区画の座標をスライダーで編集 |
| 画像 | ヒーロー・ギャラリー写真の差し替え（アップロード可） |

保存すると Firestore に書き込まれ、**即座にサイトへ反映**されます。

## ローカル開発

```bash
npm install
npm run dev        # http://localhost:5173
```

Firebase の設定（`.env`）が無い場合は、サイトはデフォルトコンテンツで表示され、管理画面のログインはできません。

## データの場所

- コンテンツ: Firestore の `content/site` ドキュメント
- アップロード画像: Firestore の `images` コレクション（dataURL として保存）

## 注意

- 無料プラン（Spark）の範囲内で運用できます（月間 10GB 転送・読み書き回数に制限あり。小規模サイトなら十分）
- 管理画面のログインアカウントは Firebase コンソールから管理できます（追加・削除・パスワード変更）
