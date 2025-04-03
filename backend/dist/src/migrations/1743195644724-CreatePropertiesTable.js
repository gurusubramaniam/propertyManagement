"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePropertiesTable1743195644724 = void 0;
class CreatePropertiesTable1743195644724 {
    name = 'CreatePropertiesTable1743195644724';
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TYPE "public"."properties_type_enum" AS ENUM('house', 'apartment', 'condo', 'townhouse', 'land')
        `);
        await queryRunner.query(`
            CREATE TABLE "properties" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "city" character varying NOT NULL,
                "state" character varying NOT NULL,
                "zipCode" character varying NOT NULL,
                "type" "public"."properties_type_enum" NOT NULL DEFAULT 'house',
                "price" numeric(10,2) NOT NULL,
                "bedrooms" integer NOT NULL,
                "bathrooms" integer NOT NULL,
                "squareFootage" integer NOT NULL,
                "description" character varying,
                "amenities" character varying,
                "images" character varying,
                "status" character varying NOT NULL DEFAULT 'available',
                "ownerId" uuid,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_properties_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "properties"
            ADD CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0"
            FOREIGN KEY ("ownerId")
            REFERENCES "users"("id")
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TYPE "public"."properties_type_enum"`);
    }
}
exports.CreatePropertiesTable1743195644724 = CreatePropertiesTable1743195644724;
//# sourceMappingURL=1743195644724-CreatePropertiesTable.js.map