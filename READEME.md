# Express backend with PostgreSQL DB

## Instructions:

- `yarn install`
- The following requires db-migrate to be installed globally. See [docs](https://db-migrate.readthedocs.io/en/latest/) for running in local env.
- `db-migrate db:create todo_rails_api_development`
- `db-migrate db:create todo_rails_api_test`
- `db-migrate up:all` Will install all migrations to test and development dbs
- `yarn start`

## Resources and references followed:

- [Blog Post](https://itnext.io/production-ready-node-js-rest-apis-setup-using-typescript-postgresql-and-redis-a9525871407)

- [TypeScript references for PG-Promise](https://github.com/vitaly-t/pg-promise/tree/master/typescript)

- [JWT Token design from this medium post](https://medium.com/javascript-in-plain-english/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4)

**_Dependencies_**

- express
- jsonwebtoken
- bcrypt
- cors
- dotenv
- pg-promise
- db-migrate-pg [docs](https://db-migrate.readthedocs.io/en/latest/)

## Structure

- src

  - middleware/

    - common.ts (imports: cors, compression, request parsing, jwt)
    - errorHandlers.ts (manages err outputs and logging(eventually))
    - index.ts (easy export)
    - jwt.ts (jwt token creation and checking)

  - services/ (all models and their routes)

    - model/
      - modelRoutes.ts (routes exported to index)
      - modelController.ts (sql and database exchanges, logic for managing requests)
      - modelXType.test.ts (tests)
    - index.ts (export of all routes)

  - utils/

    - ErrorHandler.ts (insert custom messages)
    - httpErrors.ts (super err class construction and customization)
    - index.ts (custom type definitions)
    - db.ts (database setup and exports)
    - db-config.json (database configuration)

  - server.ts (main entry point, server port, unhandled rejections )

### Notes:

- (done) clean up package.json and remove unused packages from other approaches (not sure if I need babel etc)

<strong>Routes: </strong>

- POST `/create-user`
  - <strong>USERNAME is unique</strong>
  - create new user with { user: {:firstName, :lastName, :username, :password } }
  - returns:
  ```
  {
    success: true/false,
      if true -->
      {
     user: { :firstName, :lastName, :username, lists: [ :id, :heading, :toDos [ :id, :listId, :title, :description, :due ] ] },
     token: JWT token
     }
      if false --> errors: [ 'of error message strings' ]
    }
  ```
- POST `/login` - login user with { user: { :username, :password } } - returns:

  ````
  {
  success: true/false,
   if true -->
  {
   user: {
  :firstName, :lastName, :username, lists: [ :id, :heading, :toDos [ :id, :listId, :title, :description, :due ] ]
  },
  token: JWT token
  }

        if false --> errors: { messages: ['Wrong Username or Password'] }
      }
      ```

  <strong>- JWT Auth Routes -</strong>
  ````

<strong>Must have: <span>&nbsp;&nbsp;</span> `"authorization": "Bearer *token*"`</strong>

- GET `/users/show`

  - auto login route for user with JWT Token
  - returns:

  ```
  {
    success: true or false,
    if true -->
      user: { :firstName, :lastName, :username, lists: [ :id, :heading, :toDos [ :id, :listId, :title, :description, :due ] ] }

    if false --> errors: [ 'Wrong Username or Password' ]
  }
  ```

- POST `/lists`

  - create new list with {list: { :heading } }
  - returns:

  ```
  {
    success: true or false,
    if true -->
      lists: [ :id, :heading, :toDos [ :id, :listId, :title, :description, :due ] ]

    if false --> errors: [ messages: [ 'error message strings' ] ]
  }
  ```

- DELETE `/lists/:id`

  - destroy list with {list: { :id } } and destroy all dependents
  - returns:

  ```
  {
    success: true or false,
    if true -->
      lists: [ :id, :heading, :toDos [ :id, :listId, :title, :description, :due ] ]

    if false --> errors: [ messages: [ 'List was not destroyed' ] ]
  }
  ```

- POST `/to_dos`

  - creates a todo with { todo: { :listId, :title, :description?, :due? } }
  - returns:

  ```
  {
    success: true or false,
    if true -->
      toDo: { :id, :listId, :title, :description, :due }
    if false --> errors: [ messages: [ 'error message strings' ] ]
  }
  ```

- DELETE `/to_dos/:id`
  - destroys a toDo with { todo: { :listId, :title, :description?, :due? }
  - returns:
  ```
  {
    success: true or false,
    if true -->
      toDoId: deleted toDo's id,
      toDoListId: deleted toDo's list_id
    if false --> errors: [ messages: [ 'ToDo was not deleted' ] ]
  }
  ```
