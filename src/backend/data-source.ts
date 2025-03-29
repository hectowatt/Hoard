import "reflect-metadata";
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";

export const AppDataSource: DataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST || "localhost",
    port: parseInt(process.env.PG_PORT || "5432"),
    username: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "password",
    database: process.env.PG_DATABASE || "mydatabase",
    synchronize: true, // 開発環境ではtrue、本番環境ではfalseにする
    logging: false,
    entities: ["entities/*.ts"], // エンティティのパス
    migrations: ["migrations/*.ts"], // マイグレーションのパス
    subscribers: [],
});