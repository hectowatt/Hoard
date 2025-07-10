var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import Label from "./Label.js";
let Note = class Note {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Note.prototype, "id", void 0);
__decorate([
    Column({ name: "title", type: "text", nullable: false }),
    __metadata("design:type", String)
], Note.prototype, "title", void 0);
__decorate([
    Column({ name: "content", type: "text", nullable: false }),
    __metadata("design:type", String)
], Note.prototype, "content", void 0);
__decorate([
    Column({ name: "label_id", type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Note.prototype, "label_id", void 0);
__decorate([
    ManyToOne(() => Label, label => label.notes, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "label_id" }),
    __metadata("design:type", Label)
], Note.prototype, "label", void 0);
__decorate([
    Column({ name: "is_deleted", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Note.prototype, "is_deleted", void 0);
__decorate([
    Column({ name: "deletedate", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Note.prototype, "deletedate", void 0);
__decorate([
    Column({ name: "is_locked", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Note.prototype, "is_locked", void 0);
__decorate([
    CreateDateColumn({ name: "createdate", type: "timestamp" }),
    __metadata("design:type", Date)
], Note.prototype, "createdate", void 0);
__decorate([
    UpdateDateColumn({ name: "updatedate", type: "timestamp" }),
    __metadata("design:type", Date)
], Note.prototype, "updatedate", void 0);
Note = __decorate([
    Entity({ name: "note" })
], Note);
export default Note;
//# sourceMappingURL=Note.js.map