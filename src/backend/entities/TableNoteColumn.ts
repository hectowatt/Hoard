import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Note from "./Note.js";

@Entity({ name: "table_note_column" })
export default class NoteTableColumn {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "name", type: "text" })
    name: string;

    @Column({ name: "order", type: "int", default: 0 })
    order: number;

    @ManyToOne(() => Note, note => note.id, { onDelete: "CASCADE" })
    note: Note;
}