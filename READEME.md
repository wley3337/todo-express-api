# Express backend with PostgreSQL DB

## Resources and references followed:

* [Blog Post](https://itnext.io/production-ready-node-js-rest-apis-setup-using-typescript-postgresql-and-redis-a9525871407)

* [TypeScript references for PG-Promise](https://github.com/vitaly-t/pg-promise/tree/master/typescript)


## Structure 
* src
  - middleware
    * common.ts (cors, compression, request parsing)
    * errorHandlers.ts (manages err outputs and logging(eventually))
    * index.ts (easy export)

  - services (all models and their routes)
    * model
      - modelRoutes.ts
      - modelController.ts
      - modelXtype.test.ts

  - utils
    * ErrorHandler.ts (insert custom messages)
    * httpErrors.ts (super err class construction and customization)
    * index.ts (custom type definitions)

  - server.ts (main entry point, server port, unhandled rejections )

