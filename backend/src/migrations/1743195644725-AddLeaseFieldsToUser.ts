import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLeaseFieldsToUser1743195644725 implements MigrationInterface {
    name = 'AddLeaseFieldsToUser1743195644725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "zipCode"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."properties_type_enum"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "bedrooms"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "bathrooms"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "squareFootage"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "amenities"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "ownerId" uuid`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "status" character varying NOT NULL DEFAULT 'available'`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "images" character varying`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "amenities" character varying`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "squareFootage" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "bathrooms" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "bedrooms" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."properties_type_enum" AS ENUM('house', 'apartment', 'condo', 'townhouse', 'land')`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "type" "public"."properties_type_enum" NOT NULL DEFAULT 'house'`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "zipCode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "state" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "city" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
