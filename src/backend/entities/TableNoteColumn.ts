import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Note from "./Note.js";
import TableNote from "./TableNote.js";

@Entity({ name: "table_note_column" })
export default class NoteTableColumn {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "name", type: "text" })
    name: string;

    @Column({ name: "order", type: "int", default: 0 })
    order: number;

    @ManyToOne(() => TableNote, note => note.id, { onDelete: "CASCADE" })
    note: Note;
}