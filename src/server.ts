import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
// import { pool } from "config";

// initialize configuration of ENV
dotenv.config();

// use the ENV file port assignment
const PORT = process.env.SERVER_PORT;

const app = express();
// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => { res.send("Hello Wil"); });

// start express server
app.listen( PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server Started at http://localhost:${PORT}`);
});
