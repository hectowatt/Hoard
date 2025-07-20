var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import TableNoteColumn from "./TableNoteColumn.js";
import TableNote from "./TableNote.js";
let NoteTableCell = class NoteTableCell {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], NoteTableCell.prototype, "id", void 0);
__decorate([
    Column({ name: "row_index", type: "int" }),
    __metadata("design:type", Number)
], NoteTableCell.prototype, "row_index", void 0);
__decorate([
    Column({ name: "value", type: "text" }),
    __metadata("design:type", String)
], NoteTableCell.prototype, "value", void 0);
__decorate([
    ManyToOne(() => TableNote, tableNote => tableNote.id, { onDelete: "CASCADE" }),
    __metadata("design:type", TableNote)
], NoteTableCell.prototype, "tableNote", void 0);
__decorate([
    ManyToOne(() => TableNoteColumn, column => column.id, { onDelete: "CASCADE" }),
    __metadata("design:type", TableNoteColumn)
], NoteTableCell.prototype, "column", void 0);
NoteTableCell = __decorate([
    Entity({ name: "table_note_cell" })
], NoteTableCell);
export default NoteTableCell;
//# sourceMappingURL=TableNoteCell.js.map