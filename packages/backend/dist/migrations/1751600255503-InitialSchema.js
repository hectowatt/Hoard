export class InitialSchema1751600255503 {
    constructor() {
        this.name = 'InitialSchema1751600255503';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "table_note_column" DROP CONSTRAINT "FK_ca013f6d9f8582095102873ee87"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_1ee5456a281ded3a883b1af2a7b"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
            ADD CONSTRAINT "FK_ca013f6d9f8582095102873ee87" FOREIGN KEY ("noteId") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_1ee5456a281ded3a883b1af2a7b" FOREIGN KEY ("noteId") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_1ee5456a281ded3a883b1af2a7b"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column" DROP CONSTRAINT "FK_ca013f6d9f8582095102873ee87"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_1ee5456a281ded3a883b1af2a7b" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
            ADD CONSTRAINT "FK_ca013f6d9f8582095102873ee87" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
}
//# sourceMappingURL=1751600255503-InitialSchema.js.map