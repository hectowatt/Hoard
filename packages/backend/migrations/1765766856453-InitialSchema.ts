import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1765766856453 implements MigrationInterface {
    name = 'InitialSchema1765766856453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "table_note_column" DROP CONSTRAINT "FK_37c7563317669eec23c737eecc9"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_ca83547a76c08f413d498b5fbd2"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_e1363aa24c35f1d60968eae9360"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
                RENAME COLUMN "tableNoteId" TO "table_note_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP COLUMN "tableNoteId"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP COLUMN "columnId"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD "table_note_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD "column_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
            ALTER COLUMN "table_note_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
            ADD CONSTRAINT "FK_b6b2de6df4e7ce8d3f424c5f799" FOREIGN KEY ("table_note_id") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_806b99a454a2596aec72950ba8d" FOREIGN KEY ("table_note_id") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_bed327ffc93e2ad4e4a6dabb058" FOREIGN KEY ("column_id") REFERENCES "table_note_column"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_bed327ffc93e2ad4e4a6dabb058"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_806b99a454a2596aec72950ba8d"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column" DROP CONSTRAINT "FK_b6b2de6df4e7ce8d3f424c5f799"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
            ALTER COLUMN "table_note_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP COLUMN "column_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP COLUMN "table_note_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD "columnId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD "tableNoteId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
                RENAME COLUMN "table_note_id" TO "tableNoteId"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_e1363aa24c35f1d60968eae9360" FOREIGN KEY ("columnId") REFERENCES "table_note_column"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_ca83547a76c08f413d498b5fbd2" FOREIGN KEY ("tableNoteId") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
            ADD CONSTRAINT "FK_37c7563317669eec23c737eecc9" FOREIGN KEY ("tableNoteId") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
