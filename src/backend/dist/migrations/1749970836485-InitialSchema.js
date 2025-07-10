export class InitialSchema1749970836485 {
    constructor() {
        this.name = 'InitialSchema1749970836485';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "password"
                RENAME COLUMN "password_hash" TO "password_hashed"
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "password"
                RENAME COLUMN "password_hashed" TO "password_hash"
        `);
    }
}
//# sourceMappingURL=1749970836485-InitialSchema.js.map