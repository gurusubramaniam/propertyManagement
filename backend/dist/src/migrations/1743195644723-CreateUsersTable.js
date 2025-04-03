"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersTable1743195644723 = void 0;
class CreateUsersTable1743195644723 {
    name = 'CreateUsersTable1743195644723';
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'owner', 'tenant')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'tenant',
                "phone" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
exports.CreateUsersTable1743195644723 = CreateUsersTable1743195644723;
//# sourceMappingURL=1743195644723-CreateUsersTable.js.map