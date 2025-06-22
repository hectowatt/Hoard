import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1750582581315 implements MigrationInterface {
    name = 'InitialSchema1750582581315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "note_table_column" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "order" integer NOT NULL,
                "noteId" uuid,
                CONSTRAINT "PK_6ca627ec89cd64ccf777e2d1006" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "note_table_cell" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "row_index" integer NOT NULL,
                "value" text NOT NULL,
                "noteId" uuid,
                "columnId" uuid,
                CONSTRAINT "PK_3e15574a59f648c2c08ff69b67d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD "is_table" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "note_table_column"
            ADD CONSTRAINT "FK_fe94b5468579c69e1d517eba95e" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "note_table_cell"
            ADD CONSTRAINT "FK_1fe0f166969e1553a977f0c36fa" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "note_table_cell"
            ADD CONSTRAINT "FK_1ba5bc978a9495b1ce890f91322" FOREIGN KEY ("columnId") REFERENCES "note_table_column"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "note_table_cell" DROP CONSTRAINT "FK_1ba5bc978a9495b1ce890f91322"
        `);
        await queryRunner.query(`
            ALTER TABLE "note_table_cell" DROP CONSTRAINT "FK_1fe0f166969e1553a977f0c36fa"
        `);
        await queryRunner.query(`
            ALTER TABLE "note_table_column" DROP CONSTRAINT "FK_fe94b5468579c69e1d517eba95e"
        `);
        await queryRunner.query(`
            ALTER TABLE "note" DROP COLUMN "is_table"
        `);
        await queryRunner.query(`
            DROP TABLE "note_table_cell"
        `);
        await queryRunner.query(`
            DROP TABLE "note_table_column"
        `);
    }

}
