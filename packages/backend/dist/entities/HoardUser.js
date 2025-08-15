var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
let HoardUser = class HoardUser {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], HoardUser.prototype, "id", void 0);
__decorate([
    Column({ name: "username", type: "text", nullable: false, unique: true }),
    __metadata("design:type", String)
], HoardUser.prototype, "username", void 0);
__decorate([
    Column({ name: "password", type: "text", nullable: false }),
    __metadata("design:type", String)
], HoardUser.prototype, "password", void 0);
__decorate([
    CreateDateColumn({ name: "createdate", type: "timestamp" }),
    __metadata("design:type", Date)
], HoardUser.prototype, "createdate", void 0);
__decorate([
    UpdateDateColumn({ name: "updatedate", type: "timestamp" }),
    __metadata("design:type", Date)
], HoardUser.prototype, "updatedate", void 0);
HoardUser = __decorate([
    Entity({ name: "hoard_user" })
], HoardUser);
export default HoardUser;
//# sourceMappingURL=HoardUser.js.map