"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const middleware_1 = __importDefault(require("./middleware"));
const services_1 = __importDefault(require("./services"));
//create the router 'app' in other models I've seen
const router = express_1.default();
//apply the middle ware like cors auth etc to the application
utils_1.applyMiddleware(middleware_1.default, router);
utils_1.applyRoutes(services_1.default, router);
const { PORT = 3000 } = process.env;
const server = http_1.default.createServer(router);
server.listen(PORT, () => console.log(`Server is running: http://localhost:${PORT}...`));
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import express from "express";
// // import { pool } from "config";
// // initialize configuration of ENV
// dotenv.config();
// // use the ENV file port assignment
// const PORT = process.env.SERVER_PORT;
// const app = express();
// // bodyparser setup
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.get("/", (req, res) => { res.send("Hello Wl"); });
// // start express server
// app.listen( PORT, () => {
//     // tslint:disable-next-line:no-console
//     console.log(`Server Started at http://localhost:${PORT}`);
// });
//# sourceMappingURL=server.js.map