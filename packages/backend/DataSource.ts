import "reflect-metadata";
import { DataSource } from "typeorm";
import Note from "./entities/Note.js";
import Label from "./entities/Label.js";
import TableNote from "./entities/TableNote.js";
import TableNoteColumn from "./entities/TableNoteColumn.js";
import TableNoteCell from "./entities/TableNoteCell.js";
import Password from "./entities/Password.js";
import HoardUser from "./entities/HoardUser.js";

export const AppDataSource: DataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST || "localhost",
    port: parseInt(process.env.PG_PORT || "5432"),
    username: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "password",
    database: process.env.PG_DATABASE || "mydatabase",
    synchronize: true, // 開発環境ではtrue、本番環境ではfalseにする
    logging: false,
    entities: process.env.NODE_ENV === "development" ? ["./entities/*.ts"] : ["dist/entities/*.js"],
    migrations: process.env.NODE_ENV === "development" ? ["./migrations/*.ts"] : ["dist/migrations/*.js"],
    subscribers: [],
});