import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateUsersTable1743195644723 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
