"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.dbConfig = void 0;
exports.connectDB = connectDB;
const dotenv_1 = __importDefault(require("dotenv"));
const mssql_1 = __importDefault(require("mssql"));
dotenv_1.default.config();
exports.dbConfig = {
    server: process.env.DB_HOST, // "localhost\\SQLEXPRESS"
    port: Number(process.env.DB_PORT) || 14330,
    user: process.env.DB_USER, // "sa" o "DOMINIO\\Usuario"
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // desarrollo local
        trustServerCertificate: true
    }
};
async function connectDB() {
    if (!exports.pool) {
        exports.pool = await mssql_1.default.connect(exports.dbConfig);
        console.log('Conectado a SQL Server');
    }
    return exports.pool;
}
