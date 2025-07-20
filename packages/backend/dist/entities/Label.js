var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import Note from "./Note.js";
let Label = class Label {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Label.prototype, "id", void 0);
__decorate([
    Column({ name: "labelname", type: "text", nullable: false, unique: true }),
    __metadata("design:type", String)
], Label.prototype, "labelname", void 0);
__decorate([
    CreateDateColumn({ name: "createdate", type: "timestamp" }),
    __metadata("design:type", Date)
], Label.prototype, "createdate", void 0);
__decorate([
    OneToMany(() => Note, note => note.label_id),
    __metadata("design:type", Array)
], Label.prototype, "notes", void 0);
Label = __decorate([
    Entity({ name: "label" })
], Label);
export default Label;
//# sourceMappingURL=Label.js.map