import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import Label from "./Label.js";

@Entity({ name: "table_note" })
export default class TableNote {

    // primary key
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // title
    @Column({ name: "title", type: "text", nullable: false })
    title: string;

    // label_id
    @Column({ name: "label_id", type: "uuid", nullable: true })
    label_id: string | null;

    // TODO: ラベルを複数追加できるようにしたい
    @ManyToOne(() => Label, label => label.notes, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "label_id" })
    label: Label | null;

    // is_deleted
    @Column({ name: "is_deleted", type: "boolean", default: false })
    is_deleted: boolean;

    // deletedata
    @Column({ name: "deletedate", type: "timestamp", nullable: true })
    deletedate: Date | null;

    // is_locked
    @Column({ name: "is_locked", type: "boolean", default: false })
    is_locked: boolean;

    // createdate
    @CreateDateColumn({ name: "createdate", type: "timestamp" })
    createdate: Date;

    // updatedate
    @UpdateDateColumn({ name: "updatedate", type: "timestamp" })
    updatedate: Date;
} 