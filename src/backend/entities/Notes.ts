import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({schema: "hoard", name: "notes"})
export default class Notes{

    // primary key
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // title
    @Column({type: "text", nullable: false})
    title: string;

    // content
    @Column({type: "text", nullable: false})
    content: string;

    // createdate
    @CreateDateColumn({name: "createdate", type: "timestamp"})
    createdate: Date;

    // updatedate
   @UpdateDateColumn({name: "updatedate", type: "timestamp"})
    updatedate: Date;
} 