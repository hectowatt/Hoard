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
import TableNote from "./TableNote.js";
let NoteTableColumn = class NoteTableColumn {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], NoteTableColumn.prototype, "id", void 0);
__decorate([
    Column({ name: "name", type: "text" }),
    __metadata("design:type", String)
], NoteTableColumn.prototype, "name", void 0);
__decorate([
    Column({ name: "order", type: "int", default: 0 }),
    __metadata("design:type", Number)
], NoteTableColumn.prototype, "order", void 0);
__decorate([
    ManyToOne(() => TableNote, tableNote => tableNote.id, { onDelete: "CASCADE" }),
    __metadata("design:type", TableNote)
], NoteTableColumn.prototype, "tableNote", void 0);
NoteTableColumn = __decorate([
    Entity({ name: "table_note_column" })
], NoteTableColumn);
export default NoteTableColumn;
//# sourceMappingURL=TableNoteColumn.js.map