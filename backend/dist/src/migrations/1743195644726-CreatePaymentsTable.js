"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentsTable1743195644726 = void 0;
class CreatePaymentsTable1743195644726 {
    name = 'CreatePaymentsTable1743195644726';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE "public"."payments_payment_method_enum" AS ENUM (
        'bank_transfer',
        'zelle',
        'venmo'
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "public"."payments_status_enum" AS ENUM (
        'pending',
        'completed',
        'failed'
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "amount" decimal(10,2) NOT NULL,
        "payment_method" "public"."payments_payment_method_enum" NOT NULL,
        "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending',
        "due_date" date NOT NULL,
        "paid_date" date,
        "transaction_id" character varying,
        "notes" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "tenant_id" uuid,
        "property_id" uuid,
        CONSTRAINT "PK_payments_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "payments"
      ADD CONSTRAINT "FK_payments_tenant"
      FOREIGN KEY ("tenant_id")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE "payments"
      ADD CONSTRAINT "FK_payments_property"
      FOREIGN KEY ("property_id")
      REFERENCES "properties"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_payments_tenant_id" ON "payments" ("tenant_id")
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_payments_property_id" ON "payments" ("property_id")
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_payments_status" ON "payments" ("status")
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_payments_due_date" ON "payments" ("due_date")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_payments_due_date"`);
        await queryRunner.query(`DROP INDEX "IDX_payments_status"`);
        await queryRunner.query(`DROP INDEX "IDX_payments_property_id"`);
        await queryRunner.query(`DROP INDEX "IDX_payments_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_property"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_tenant"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
    }
}
exports.CreatePaymentsTable1743195644726 = CreatePaymentsTable1743195644726;
//# sourceMappingURL=1743195644726-CreatePaymentsTable.js.map