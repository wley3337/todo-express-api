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
// import * as promise from 'bluebird'; // promise managing library. May want to drop
const pg_promise_1 = __importDefault(require("pg-promise"));
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
const db = pgp(dbConfig);
exports.db = db;
//# sourceMappingURL=db.js.map