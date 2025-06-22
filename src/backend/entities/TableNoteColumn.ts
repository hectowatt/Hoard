import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Note from "./Note.js";

@Entity()
export default class NoteTableColumn {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    order: number;

    @ManyToOne(() => Note, note => note.id, { onDelete: "CASCADE" })
    note: Note;
}