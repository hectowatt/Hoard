export class InitialSchema1750585081061 {
    constructor() {
        this.name = 'InitialSchema1750585081061';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "table_note_column" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "order" integer NOT NULL,
                "noteId" uuid,
                CONSTRAINT "PK_72237b0712452e76e396d8e6c2c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "table_note_cell" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "row_index" integer NOT NULL,
                "value" text NOT NULL,
                "noteId" uuid,
                "columnId" uuid,
                CONSTRAINT "PK_ec2465dc634f22cd9f25397a89a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
            ADD CONSTRAINT "FK_ca013f6d9f8582095102873ee87" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_1ee5456a281ded3a883b1af2a7b" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_e1363aa24c35f1d60968eae9360" FOREIGN KEY ("columnId") REFERENCES "table_note_column"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_e1363aa24c35f1d60968eae9360"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_1ee5456a281ded3a883b1af2a7b"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column" DROP CONSTRAINT "FK_ca013f6d9f8582095102873ee87"
        `);
        await queryRunner.query(`
            DROP TABLE "table_note_cell"
        `);
        await queryRunner.query(`
            DROP TABLE "table_note_column"
        `);
    }
}
//# sourceMappingURL=1750585081061-InitialSchema.js.map