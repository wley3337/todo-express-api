import http from "http";
import express from 'express';
import { applyMiddleware, applyRoutes } from './utils';
import middleware from './middleware';
import routes from './services';


//create the router 'app' in other models I've seen
const router = express();

//apply the middle ware like cors auth etc to the application
applyMiddleware(middleware, router);
applyRoutes(routes, router);

const { PORT = 3000 } = process.env; 

const server = http.createServer(router);

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
