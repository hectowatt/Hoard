export class InitialSchema1749969150713 {
    constructor() {
        this.name = 'InitialSchema1749969150713';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "password" DROP CONSTRAINT "FK_48c238df4d6d0916c701b8eb237"
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
                RENAME COLUMN "note_id" TO "password_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
                RENAME CONSTRAINT "PK_48c238df4d6d0916c701b8eb237" TO "PK_ae3c9ececc9e15d40199ba93578"
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD "is_locked" boolean NOT NULL DEFAULT false
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "note" DROP COLUMN "is_locked"
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
                RENAME CONSTRAINT "PK_ae3c9ececc9e15d40199ba93578" TO "PK_48c238df4d6d0916c701b8eb237"
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
                RENAME COLUMN "password_id" TO "note_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD CONSTRAINT "FK_48c238df4d6d0916c701b8eb237" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
}
//# sourceMappingURL=1749969150713-InitialSchema.js.map