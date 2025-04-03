import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { seedInitialUsers } from './initial-admin.seed';
import { seedInitialProperties } from './initial-properties.seed';

config();

const dataSource = new DataSource({
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

        await seedInitialUsers(dataSource);
        await seedInitialProperties(dataSource);
        
        await dataSource.destroy();
        console.log('Data Source has been destroyed!');
        process.exit(0);
    } catch (error) {
        console.error('Error during seed:', error);
        process.exit(1);
    }
}

runSeed(); 