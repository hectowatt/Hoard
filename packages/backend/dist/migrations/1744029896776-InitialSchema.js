export class InitialSchema1744029896776 {
    constructor() {
        this.name = 'InitialSchema1744029896776';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "notes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" text NOT NULL,
                "content" text NOT NULL,
                "createdate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "password" (
                "note_id" uuid NOT NULL,
                "password_hash" text NOT NULL,
                CONSTRAINT "PK_48c238df4d6d0916c701b8eb237" PRIMARY KEY ("note_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "sync_log" (
                "id" SERIAL NOT NULL,
                "note_id" uuid,
                "device_id" text NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5a1c2f181ab99c0757868c7d0fc" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "password"
            ADD CONSTRAINT "FK_48c238df4d6d0916c701b8eb237" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "sync_log"
            ADD CONSTRAINT "FK_1a97f3d57171d7caedd5d454258" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "sync_log" DROP CONSTRAINT "FK_1a97f3d57171d7caedd5d454258"
        `);
        await queryRunner.query(`
            ALTER TABLE "password" DROP CONSTRAINT "FK_48c238df4d6d0916c701b8eb237"
        `);
        await queryRunner.query(`
            DROP TABLE "sync_log"
        `);
        await queryRunner.query(`
            DROP TABLE "password"
        `);
        await queryRunner.query(`
            DROP TABLE "notes"
        `);
    }
}
//# sourceMappingURL=1744029896776-InitialSchema.js.map