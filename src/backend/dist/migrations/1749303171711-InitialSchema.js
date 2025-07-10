export class InitialSchema1749303171711 {
    constructor() {
        this.name = 'InitialSchema1749303171711';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD "is_deleted" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD "deletedate" TIMESTAMP
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "note" DROP COLUMN "deletedate"
        `);
        await queryRunner.query(`
            ALTER TABLE "note" DROP COLUMN "is_deleted"
        `);
    }
}
//# sourceMappingURL=1749303171711-InitialSchema.js.map