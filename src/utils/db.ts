import * as dbConfig from "../../database.json";
import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

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
const pgp = pgPromise();

//configuration string for database
// const configStr: string = `postgresql://localhost:5432/todo_rails_api_development`
// creates a db poll with configStr
// const db = pgp(configStr);
// or you can use the JSON config file
//not sure what type to return here
const config = (setup = process.env.NODE_ENV) => {
  const env = setup;
  switch (env) {
    case "dev":
      console.log("Database: Development DB");
      return pgp(dbConfig.dev);
    case "test":
      console.log("Database: Test DB");
      return pgp(dbConfig.test);
    case "prod":
      console.log("Database: Production DB");
      return pgp(dbConfig.prod);
    default:
      console.log("Database: Default DB (Dev)");
      return pgp(dbConfig.dev);
  }
};

const db = config();

// const db = pgp(dbConfig.development)
//exports the db and a way to custom initialize through pgp
export { db, pgp, config };
