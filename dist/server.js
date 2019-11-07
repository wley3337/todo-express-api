"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// import { pool } from "config";
// initialize configuration of ENV
dotenv_1.default.config();
// use the ENV file port assignment
const PORT = process.env.SERVER_PORT;
const app = express_1.default();
// bodyparser setup
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get("/", (req, res) => { res.send("Hello Wil"); });
// start express server
app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server Started at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map