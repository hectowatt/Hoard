import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "note"})
export default class Note{

    // primary key
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // title
    @Column({type: "text", nullable: false})
    title: string;

    // content
    @Column({type: "text", nullable: false})
    content: string;

    // content
    // TODO: ラベルを複数追加できるようにしたい
    @Column({type: "text", nullable: true})
    label: string;

    // createdate
    @CreateDateColumn({name: "createdate", type: "timestamp"})
    createdate: Date;

    // updatedate
   @UpdateDateColumn({name: "updatedate", type: "timestamp"})
    updatedate: Date;
} 