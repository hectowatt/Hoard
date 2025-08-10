import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity({ name: "hoard_user" })
export default class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    // username
    @Column({ name: "username", type: "text", nullable: false, unique: true })
    username: string;

    // password
    @Column({ name: "password", type: "text", nullable: false })
    password: string;

    // createdate
    @CreateDateColumn({ name: "createdate", type: "timestamp" })
    createdate: Date;

    // updatedate
    @UpdateDateColumn({ name: "updatedate", type: "timestamp" })
    updatedate: Date;
}