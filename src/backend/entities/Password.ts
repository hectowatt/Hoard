import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import Notes from "./Notes.js";

@Entity({ schema: "hoard", name: "password" })
export class Password {
    // note_id (主キーかつ外部キー)
    @PrimaryColumn("uuid")
    note_id: string;

    // password_hash
    @Column({ type: "text", nullable: false })
    password_hash: string;

    // Notesエンティティとのリレーション
    @OneToOne(() => Notes, { onDelete: "CASCADE" }) // 外部キー制約を設定
    @JoinColumn({ name: "note_id" }) // 外部キーのカラム名を指定
    note: Notes;
}