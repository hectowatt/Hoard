export class InitialSchema1751777758120 {
    constructor() {
        this.name = 'InitialSchema1751777758120';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "label" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "labelname" text NOT NULL,
                "createdate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_2786044518f8470dc4cf7ff2ca7" UNIQUE ("labelname"),
                CONSTRAINT "PK_5692ac5348861d3776eb5843672" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "note" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" text NOT NULL,
                "content" text NOT NULL,
                "label_id" uuid,
                "is_deleted" boolean NOT NULL DEFAULT false,
                "deletedate" TIMESTAMP,
                "is_locked" boolean NOT NULL DEFAULT false,
                "createdate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "table_note" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" text NOT NULL,
                "label_id" uuid,
                "is_deleted" boolean NOT NULL DEFAULT false,
                "deletedate" TIMESTAMP,
                "is_locked" boolean NOT NULL DEFAULT false,
                "createdate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d87feb0b383023399302f21b51b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "table_note_column" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                "order" integer NOT NULL DEFAULT '0',
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
            CREATE TABLE "password" (
                "password_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "password_hashed" text NOT NULL,
                CONSTRAINT "PK_ae3c9ececc9e15d40199ba93578" PRIMARY KEY ("password_id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD CONSTRAINT "FK_c0f7461fdc1dd48bb8cca0ba6de" FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note"
            ADD CONSTRAINT "FK_3b3a77dac446c76e219da7969b3" FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column"
            ADD CONSTRAINT "FK_ca013f6d9f8582095102873ee87" FOREIGN KEY ("noteId") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_1ee5456a281ded3a883b1af2a7b" FOREIGN KEY ("noteId") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "table_note" DROP CONSTRAINT "FK_3b3a77dac446c76e219da7969b3"
        `);
        await queryRunner.query(`
            ALTER TABLE "note" DROP CONSTRAINT "FK_c0f7461fdc1dd48bb8cca0ba6de"
        `);
        await queryRunner.query(`
            DROP TABLE "password"
        `);
        await queryRunner.query(`
            DROP TABLE "table_note_cell"
        `);
        await queryRunner.query(`
            DROP TABLE "table_note_column"
        `);
        await queryRunner.query(`
            DROP TABLE "table_note"
        `);
        await queryRunner.query(`
            DROP TABLE "note"
        `);
        await queryRunner.query(`
            DROP TABLE "label"
        `);
    }
}
//# sourceMappingURL=1751777758120-InitialSchema.js.map