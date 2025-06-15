import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1749970836485 implements MigrationInterface {
    name = 'InitialSchema1749970836485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "password"
                RENAME COLUMN "password_hash" TO "password_hashed"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "password"
                RENAME COLUMN "password_hashed" TO "password_hash"
        `);
    }

}
