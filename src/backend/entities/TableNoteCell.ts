import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Note from "./Note.js";
import TableNoteColumn from "./TableNoteColumn.js";

@Entity()
export class NoteTableCell {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    row_index: number;

    @Column({ type: "text" })
    value: string;

    @ManyToOne(() => Note, note => note.id, { onDelete: "CASCADE" })
    note: Note;

    @ManyToOne(() => TableNoteColumn, column => column.id, { onDelete: "CASCADE" })
    column: TableNoteColumn;
}