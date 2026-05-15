"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'digidesa',
    password: process.env.DB_PASSWORD || 'password',
    port: Number(process.env.DB_PORT) || 5432,
});
exports.default = pool;
