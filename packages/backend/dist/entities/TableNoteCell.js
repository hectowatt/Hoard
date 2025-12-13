var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import TableNoteColumn from "./TableNoteColumn.js";
import TableNote from "./TableNote.js";
let TableNoteCell = class TableNoteCell {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], TableNoteCell.prototype, "id", void 0);
__decorate([
    Column({ name: "row_index", type: "int" }),
    __metadata("design:type", Number)
], TableNoteCell.prototype, "row_index", void 0);
__decorate([
    Column({ name: "value", type: "text" }),
    __metadata("design:type", String)
], TableNoteCell.prototype, "value", void 0);
__decorate([
    Column({ name: "table_note_id", type: "uuid" }),
    __metadata("design:type", String)
], TableNoteCell.prototype, "table_note_id", void 0);
__decorate([
    Column({ name: "column_id", type: "uuid" }),
    __metadata("design:type", String)
], TableNoteCell.prototype, "column_id", void 0);
__decorate([
    ManyToOne(() => TableNote, tableNote => tableNote.id, { onDelete: "CASCADE" }),
    JoinColumn({ name: "table_note_id" }),
    __metadata("design:type", TableNote)
], TableNoteCell.prototype, "tableNote", void 0);
__decorate([
    ManyToOne(() => TableNoteColumn, column => column.id, { onDelete: "CASCADE" }),
    JoinColumn({ name: "column_id" }),
    __metadata("design:type", TableNoteColumn)
], TableNoteCell.prototype, "column", void 0);
TableNoteCell = __decorate([
    Entity({ name: "table_note_cell" })
], TableNoteCell);
export default TableNoteCell;
//# sourceMappingURL=TableNoteCell.js.map