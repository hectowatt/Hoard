import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "table_note" })
export default class TableNote {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text", nullable: false })
    title: string;

    @Column({ type: "text", nullable: true })
    column1: string;

    @Column({ type: "text", nullable: true })
    column2: string;

    @Column({ type: "text", nullable: true })
    column3: string;

    @Column({ type: "text", nullable: true })
    column4: string;

    @Column({ type: "text", nullable: true })
    column5: string;

    @CreateDateColumn({ name: "createdate", type: "timestamp" })
    createdate: Date;

    @UpdateDateColumn({ name: "updatedate", type: "timestamp" })
    updatedate: Date;
}