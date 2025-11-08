# exam-share-frontend

## 概要

大学の試験情報や過去問、メモ、写真などを共有できる Web アプリケーションです。Angular と Firebase を利用しています。

## 使用技術

- Angular 19
- Angular Universal (SSR)
- Firebase (Firestore, Storage)
- TypeScript
- Node.js / Express

## 環境構築

1. リポジトリをクローン
   ```powershell
   git clone https://github.com/iori-sutani/exam-share.git
   cd exam-share/frontend
   ```
2. 依存パッケージのインストール
   ```powershell
   npm install
   ```

## 開発サーバーの起動

```powershell
npm start
```

`http://localhost:4200` でアプリを確認できます。

## SSR（サーバーサイドレンダリング）起動手順

1. SSR ビルド
   ```powershell
   npm run build:ssr
   ```
2. SSR サーバー起動
   ```powershell
   npm run serve:ssr
   ```
   `http://localhost:4000` で SSR 版アプリを確認できます。

## メールアドレスバリデーションについて

- 現在はテスト用として `00000000@ed.tmu.ac.jp` のみ投稿可能です。
- メールアドレスチェックの方法については検討中です。

## ディレクトリ構成

```
frontend/
  ├── src/
  │   ├── app/         # Angularアプリ本体
  │   ├── environments # 環境設定
  │   ├── server/      # SSR用サーバーコード
  │   └── index.html
  ├── public/          # 公開用静的ファイル
  ├── .env.example     # 環境変数サンプル
  ├── firebase.json    # Firebase設定
  ├── package.json     # npmスクリプト・依存
  └── README.md
```
