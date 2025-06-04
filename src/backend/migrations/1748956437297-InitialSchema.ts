import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1748956437297 implements MigrationInterface {
    name = 'InitialSchema1748956437297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "table_note" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" text NOT NULL,
                "column1" text,
                "column2" text,
                "column3" text,
                "column4" text,
                "column5" text,
                "createdate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d87feb0b383023399302f21b51b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "notes"
            ADD "label" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notes" DROP COLUMN "label"
        `);
        await queryRunner.query(`
            DROP TABLE "table_note"
        `);
    }

}
