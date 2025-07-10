export class InitialSchema1751777212813 {
    constructor() {
        this.name = 'InitialSchema1751777212813';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "table_note_column" DROP CONSTRAINT "FK_ca013f6d9f8582095102873ee87"
        `);
        await queryRunner.query(`
            ALTER TABLE "table_note_cell" DROP CONSTRAINT "FK_1ee5456a281ded3a883b1af2a7b"
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
            ALTER TABLE "note" DROP COLUMN "is_table"
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
    }
    async down(queryRunner) {
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
            ALTER TABLE "note"
            ADD "is_table" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            DROP TABLE "table_note"
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
//# sourceMappingURL=1751777212813-InitialSchema.js.map