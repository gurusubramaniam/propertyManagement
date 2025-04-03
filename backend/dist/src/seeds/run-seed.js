"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const initial_admin_seed_1 = require("./initial-admin.seed");
const initial_properties_seed_1 = require("./initial-properties.seed");
const initial_payments_seed_1 = require("./initial-payments.seed");
(0, dotenv_1.config)();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'vive_real_estate',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
});
async function runSeed() {
    try {
        await dataSource.initialize();
        console.log('Data Source has been initialized!');
        await (0, initial_admin_seed_1.seedInitialUsers)(dataSource);
        await (0, initial_properties_seed_1.seedInitialProperties)(dataSource);
        await (0, initial_payments_seed_1.seedInitialPayments)(dataSource);
        await dataSource.destroy();
        console.log('Data Source has been destroyed!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error during seed:', error);
        process.exit(1);
    }
}
runSeed();
//# sourceMappingURL=run-seed.js.map