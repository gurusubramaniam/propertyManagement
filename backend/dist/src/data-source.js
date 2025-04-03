"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: parseInt(configService.get('DB_PORT') || '5432'),
    username: configService.get('DB_USERNAME') || 'postgres',
    password: configService.get('DB_PASSWORD') || 'postgres',
    database: configService.get('DB_NAME') || 'vive_real_estate',
    entities: [(0, path_1.join)(__dirname, '**', '*.entity.{ts,js}')],
    migrations: [(0, path_1.join)(__dirname, 'migrations', '*.{ts,js}')],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map