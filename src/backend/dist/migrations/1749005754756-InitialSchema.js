export class InitialSchema1749005754756 {
    constructor() {
        this.name = 'InitialSchema1749005754756';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "sync_log" DROP CONSTRAINT "FK_1a97f3d57171d7caedd5d454258"
        `);
        await queryRunner.query(`
            ALTER TABLE "password" DROP CONSTRAINT "FK_48c238df4d6d0916c701b8eb237"
        `);
        await queryRunner.query(`
            CREATE TABLE "note" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" text NOT NULL,
                "content" text NOT NULL,
                "label" text,
                "createdate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "sync_log"
            ADD CONSTRAINT "FK_1a97f3d57171d7caedd5d454258" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD CONSTRAINT "FK_48c238df4d6d0916c701b8eb237" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "password" DROP CONSTRAINT "FK_48c238df4d6d0916c701b8eb237"
        `);
        await queryRunner.query(`
            ALTER TABLE "sync_log" DROP CONSTRAINT "FK_1a97f3d57171d7caedd5d454258"
        `);
        await queryRunner.query(`
            DROP TABLE "note"
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD CONSTRAINT "FK_48c238df4d6d0916c701b8eb237" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "sync_log"
            ADD CONSTRAINT "FK_1a97f3d57171d7caedd5d454258" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
}
//# sourceMappingURL=1749005754756-InitialSchema.js.map