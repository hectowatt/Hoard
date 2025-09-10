export class InitialSchema1757505663451 {
    constructor() {
        this.name = 'InitialSchema1757505663451';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "password" DROP CONSTRAINT "FK_48c238df4d6d0916c701b8eb237"
        `);
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
                "tableNoteId" uuid,
                CONSTRAINT "PK_72237b0712452e76e396d8e6c2c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "table_note_cell" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "row_index" integer NOT NULL,
                "value" text NOT NULL,
                "tableNoteId" uuid,
                "columnId" uuid,
                CONSTRAINT "PK_ec2465dc634f22cd9f25397a89a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "hoard_user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" text NOT NULL,
                "password" text NOT NULL,
                "createdate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_03f109fab281110ef8bb16564cc" UNIQUE ("username"),
                CONSTRAINT "PK_1409c3114677ea9242b088fd0d6" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "password" DROP CONSTRAINT "PK_48c238df4d6d0916c701b8eb237"
        `);
        await queryRunner.query(`
            ALTER TABLE "password" DROP COLUMN "note_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "password" DROP COLUMN "password_hash"
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD "password_id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD CONSTRAINT "PK_ae3c9ececc9e15d40199ba93578" PRIMARY KEY ("password_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD "password_hashed" text NOT NULL
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
            ADD CONSTRAINT "FK_37c7563317669eec23c737eecc9" FOREIGN KEY ("tableNoteId") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell"
            ADD CONSTRAINT "FK_ca83547a76c08f413d498b5fbd2" FOREIGN KEY ("tableNoteId") REFERENCES "table_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_ca83547a76c08f413d498b5fbd2"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_column" DROP CONSTRAINT "FK_37c7563317669eec23c737eecc9"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note" DROP CONSTRAINT "FK_3b3a77dac446c76e219da7969b3"
        `);
        await queryRunner.query(`
            ALTER TABLE "note" DROP CONSTRAINT "FK_c0f7461fdc1dd48bb8cca0ba6de"
        `);
        await queryRunner.query(`
            ALTER TABLE "password" DROP COLUMN "password_hashed"
        `);
        await queryRunner.query(`
            ALTER TABLE "password" DROP CONSTRAINT "PK_ae3c9ececc9e15d40199ba93578"
        `);
        await queryRunner.query(`
            ALTER TABLE "password" DROP COLUMN "password_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD "password_hash" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD "note_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD CONSTRAINT "PK_48c238df4d6d0916c701b8eb237" PRIMARY KEY ("note_id")
        `);
        await queryRunner.query(`
            DROP TABLE "hoard_user"
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
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD CONSTRAINT "FK_48c238df4d6d0916c701b8eb237" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
}
//# sourceMappingURL=1757505663451-InitialSchema.js.map