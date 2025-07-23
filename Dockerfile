# ベースイメージとしてNode.jsを使用
FROM node:22.14.0

# 作業ディレクトリを設定
WORKDIR /app

# backendの依存関係をインストール
COPY ./packages/backend/package*.json ./packages/backend/
RUN cd ./packages/backend && npm install

# frontendの依存関係をインストール
COPY ./packages/frontend/package*.json ./packages/frontend/
RUN cd ./packages/frontend && npm install

# ソースコードをコピー
COPY ./packages ./packages