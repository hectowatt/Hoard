import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import TableNoteColumn from "./TableNoteColumn.js";
import TableNote from "./TableNote.js";

@Entity({ name: "table_note_cell" })
export default class NoteTableCell {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "row_index", type: "int" })
    row_index: number;

    @Column({ name: "value", type: "text" })
    value: string;

    @ManyToOne(() => TableNote, tableNote => tableNote.id, { onDelete: "CASCADE" })
    tableNote: TableNote;

    @ManyToOne(() => TableNoteColumn, column => column.id, { onDelete: "CASCADE" })
    column: TableNoteColumn;
}