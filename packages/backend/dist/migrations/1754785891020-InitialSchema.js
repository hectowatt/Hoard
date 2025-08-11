export class InitialSchema1754785891020 {
    constructor() {
        this.name = 'InitialSchema1754785891020';
    }
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "hoard_user"
        `);
    }
}
//# sourceMappingURL=1754785891020-InitialSchema.js.map