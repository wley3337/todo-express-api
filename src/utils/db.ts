import * as dbConfig from './db-config.json';
import pgPromise from 'pg-promise';


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
const pgp= pgPromise();

//configuration string for database
    // const configStr: string = `postgresql://localhost:5432/todo_rails_api_development`
// creates a db poll with configStr
    // const db = pgp(configStr);

// or you can use the JSON config file
const db = pgp(dbConfig)

//exports the db and a way to custom initialize through pgp 
export { db, pgp };
