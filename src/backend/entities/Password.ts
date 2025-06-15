import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";

@Entity({ name: "password" })
export default class Password {
    // note_id (主キーかつ外部キー)
    @PrimaryColumn("uuid")
    password_id: string;

    // password_hashed
    @Column({ name: "password_hashed", type: "text", nullable: false })
    password_hashed: string;
}