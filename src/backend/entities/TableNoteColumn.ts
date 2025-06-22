import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Note from "./Note.js";

@Entity({ name: "table_note_column" })
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