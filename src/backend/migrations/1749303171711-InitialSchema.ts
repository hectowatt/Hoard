import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1749303171711 implements MigrationInterface {
    name = 'InitialSchema1749303171711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD "is_deleted" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD "deletedate" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "note" DROP COLUMN "deletedate"
        `);
        await queryRunner.query(`
            ALTER TABLE "note" DROP COLUMN "is_deleted"
        `);
    }

}
