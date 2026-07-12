# Suzutaku Playground

> Play with ideas. / 遊びながら、ちょっと発見する。

日本・科学・遊びをテーマにした、ブラウザで手軽に短時間で遊べるインタラクティブなミニゲーム集です。

---

## 🚀 プロジェクト概要

「Suzutaku Playground」は、日常のちょっとした疑問や文化、科学的なコンセプトを、長いテキストを読むのではなく「実際に触って遊んで理解する」ための場所です。

### 現在収録されているゲーム
1. **コンビニで1000円使おう (Spend ¥1000 at a Konbini)**
   - **カテゴリ**: Japan 🇯🇵
   - **概要**: 予算1000円を超えないように商品をカゴに追加していき、会計時にその組み合わせに応じたユニークな買い物称号を獲得するゲーム。

---

## 🛠️ 技術スタック

- **フレームワーク**: React (TypeScript)
- **ビルドツール**: Vite
- **ルーティング**: React Router DOM (SPA)
- **スタイリング**: Vanilla CSS (CSS変数を使用したカラーパレット・レスポンシブ対応)
- **多言語対応 (i18n)**: 独自 Context による「日本語 / 英語」のリアルタイム切り替え

---

## 📂 ディレクトリ構造

```
suzutaku-playground/
├── public/                  # 静的アセット
├── src/
│   ├── components/          # 共通コンポーネント (Header, Footer, Card等)
│   ├── data/                # ゲームやカテゴリの定義データ
│   ├── games/               # 各ゲームのソースコード
│   │   └── konbini1000/     # 「コンビニで1000円使おう」ゲーム
│   ├── i18n/                # 多言語翻訳データ (en, ja, Context)
│   ├── pages/               # ページコンポーネント (Home, Games, About等)
│   ├── styles/              # デザインシステム (変数、グローバルCSS)
│   ├── App.tsx              # ルーティングおよびプロバイダー設定
│   └── main.tsx             # アプリケーションのエントリーポイント
├── index.html               # メインHTML (Google Fonts、SEOタグ設定)
├── vercel.json              # Vercel用のSPAルーティングリライト設定
└── package.json             # 依存パッケージ定義
```

---

## 💻 ローカル開発手順

ローカルマシンでアプリケーションを実行し、確認・開発を行うには以下の手順を行います。

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
npm run dev
```
起動後、コンソールに表示されるURL（通常は `http://localhost:5173/`）にブラウザでアクセスします。

### 3. プロダクションビルドの検証
本番環境にデプロイする前に、エラーがないかビルドを検証できます。
```bash
npm run build
```

---

## 🌐 デプロイ手順 (Vercelへの公開方法)

本プロジェクトは Vercel に簡単にデプロイできるように設定されています。

### 方法1：GitHub 連携による自動デプロイ（推奨）
1. プロジェクトコードを自身の GitHub リポジトリにプッシュします。
2. [Vercel](https://vercel.com/) にログインし、「**Add New...**」 > 「**Project**」 を選択します。
3. 対象の GitHub リポジトリをインポートします。
4. 設定はデフォルト（Vite）のままで、「**Deploy**」ボタンをクリックします。
   - 以降、`main` ブランチにプッシュするたびに自動でビルド・再デプロイが行われます。

### 方法2：Vercel CLI による手動デプロイ
1. ターミナルで Vercel にログインします。
   ```bash
   npx vercel login
   ```
2. プロジェクトのルートディレクトリでデプロイを実行します。
   ```bash
   npx vercel
   ```
3. プロダクションへのデプロイ（リリース）を行います。
   ```bash
   npx vercel --prod
   ```

### ⚠️ ルーティングに関する注意
React Router を使用したSPA（シングルページアプリケーション）では、Vercel などのホスティング先で直リンク（例: `/games` や `/about`）に直接アクセスした際、デフォルトでは404エラーが発生します。

本プロジェクトでは、すべてのリクエストを `index.html` にルーティングし直す設定ファイルを [vercel.json](file:///Users/suzutaku/Desktop/game/Suzutaku%20Playground/vercel.json) として同梱しているため、Vercel上でも直リンクが正常に動作します。
