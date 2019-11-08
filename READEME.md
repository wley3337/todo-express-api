# Express backend with PostgreSQL DB

## Resources and references followed:

* [Blog Post](https://itnext.io/production-ready-node-js-rest-apis-setup-using-typescript-postgresql-and-redis-a9525871407)

* [TypeScript references for PG-Promise](https://github.com/vitaly-t/pg-promise/tree/master/typescript)


## Structure 
* src
  - middleware/
    * common.ts (cors, compression, request parsing)
    * errorHandlers.ts (manages err outputs and logging(eventually))
    * index.ts (easy export)

  - services/ (all models and their routes)
    * model/
      - modelRoutes.ts (routes exported to index)
      - modelController.ts (sql and database exchanges, logic for managing requests)
      - modelXtype.test.ts (tests)
    * index.ts (export of all routes)

  - utils/
    * ErrorHandler.ts (insert custom messages)
    * httpErrors.ts (super err class construction and customization)
    * index.ts (custom type definitions)
    * db.ts (database setup and exports)
    * db-config.json (database configuration)

  - server.ts (main entry point, server port, unhandled rejections )

### Notes:

  - clean up package.json and remove unused packages from other approaches (not sure if I need babel etc)
