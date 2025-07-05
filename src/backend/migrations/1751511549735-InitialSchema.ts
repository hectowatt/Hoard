import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1751511549735 implements MigrationInterface {
    name = 'InitialSchema1751511549735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "note" DROP COLUMN "is_table"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP COLUMN "column1"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP COLUMN "column2"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP COLUMN "column3"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP COLUMN "column4"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP COLUMN "column5"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD "label_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD "is_deleted" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD "deletedate" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD "is_locked" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD CONSTRAINT "FK_3b3a77dac446c76e219da7969b3" FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP CONSTRAINT "FK_3b3a77dac446c76e219da7969b3"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP COLUMN "is_locked"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP COLUMN "deletedate"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP COLUMN "is_deleted"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP COLUMN "label_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD "column5" text
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD "column4" text
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD "column3" text
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD "column2" text
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD "column1" text
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD "is_table" boolean NOT NULL DEFAULT false
        `);
    }

}
