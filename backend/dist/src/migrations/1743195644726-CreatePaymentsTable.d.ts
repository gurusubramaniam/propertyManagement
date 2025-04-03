import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreatePaymentsTable1743195644726 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
