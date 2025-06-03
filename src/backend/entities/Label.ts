import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "label"})
export default class Label{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    // title
    @Column({type: "text", nullable: false, unique: true})
    labelname: string;

    // createdate
    @CreateDateColumn({name: "createdate", type: "timestamp"})
    createdate: Date;
} 