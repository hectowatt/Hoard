import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import  Notes from "./Note.js";

@Entity({name: "sync_log" })
export class SyncLog {
    // id (主キー)
    @PrimaryGeneratedColumn()
    id: number;

    // note_id (外部キー)
    @Column({ type: "uuid", nullable: true })
    note_id: string | null;

    // Notesエンティティとのリレーション
    @ManyToOne(() => Notes, { onDelete: "CASCADE" }) // 外部キー制約を設定
    @JoinColumn({ name: "note_id" }) // 外部キーのカラム名を指定
    note: Notes | null;

    // device_id
    @Column({ type: "text", nullable: false })
    device_id: string;

    // timestamp
    @Column({ name: "timestamp", type: "timestamp", default: () => "now()" })
    timestamp: Date;
}