"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/ping', async (_req, res) => {
    await (0, db_1.connectDB)();
    const result = await db_1.pool.request().query('SELECT 1 + 1 AS result');
    res.json(result.recordset);
});
const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
