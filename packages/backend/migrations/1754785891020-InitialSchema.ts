import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1754785891020 implements MigrationInterface {
    name = 'InitialSchema1754785891020'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "hoard_user"
        `);
    }

}
