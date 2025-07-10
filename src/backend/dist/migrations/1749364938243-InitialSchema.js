export class InitialSchema1749364938243 {
    constructor() {
        this.name = 'InitialSchema1749364938243';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "note"
                RENAME COLUMN "label" TO "label_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "note" DROP COLUMN "label_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD "label_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD CONSTRAINT "FK_c0f7461fdc1dd48bb8cca0ba6de" FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "note" DROP CONSTRAINT "FK_c0f7461fdc1dd48bb8cca0ba6de"
        `);
        await queryRunner.query(`
            ALTER TABLE "note" DROP COLUMN "label_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD "label_id" text
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
                RENAME COLUMN "label_id" TO "label"
        `);
    }
}
//# sourceMappingURL=1749364938243-InitialSchema.js.map