import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddLeaseFieldsToUser1743195644725 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
