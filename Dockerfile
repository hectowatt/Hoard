# ベースイメージとしてNode.jsを使用
FROM node:22.14.0

# 作業ディレクトリを設定
WORKDIR /app

# backendの依存関係をインストール
COPY ./src/backend/package*.json ./src/backend/
RUN cd ./src/backend && npm install

# frontendの依存関係をインストール
COPY ./src/frontend/package*.json ./src/frontend/
RUN cd ./src/frontend && npm install

# ソースコードをコピー
COPY ./src ./src