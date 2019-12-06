"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig = __importStar(require("./db-config.json"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import * as promise from 'bluebird'; // promise managing library. May want to drop
// import { IInitOptions, IDatabase, IMain } from 'pg-promise';
// import { promises } from 'dns';
// import { *** potential defined functions from models ***} from '../services/model';
// the majority of this file is from: https://github.com/vitaly-t/pg-promise-demo/blob/master/TypeScript/db/index.ts
// pg-promise initialization options:  
// const initOptions: IInitOptions = {
//     promiseLib: promise,
// }
// initialize the library:
const pgp = pg_promise_1.default();
exports.pgp = pgp;
//configuration string for database
// const configStr: string = `postgresql://localhost:5432/todo_rails_api_development`
// creates a db poll with configStr
// const db = pgp(configStr);
// or you can use the JSON config file
//not sure what type to return here
const config = (setup = process.env.NODE_ENV) => {
    const env = setup;
    switch (env) {
        case 'development':
            console.log('Database: Development DB');
            return pgp(dbConfig.development);
        case 'test':
            console.log('Database: Test DB');
            return pgp(dbConfig.test);
        case 'production':
            console.log('Database: Production DB');
            return pgp(dbConfig.production);
        default:
            console.log('Database: Default DB');
            return pgp(dbConfig.development);
    }
};
exports.config = config;
const db = config();
exports.db = db;
//# sourceMappingURL=db.js.map