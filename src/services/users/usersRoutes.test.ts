import express, { Router } from 'express';
import request from 'supertest';
import { applyMiddleware, applyRoutes } from '../../utils';
import middleware from '../../middleware';
import errorHandlers from '../../middleware/errorHandlers';
import routes from './usersRoutes';
import { generateJWT } from '../../middleware/jwt';
import { db } from '../../utils/db';
import { createPasswordDigest, UserSchema } from './usersController';


describe("User Routes", () =>{
    let router: Router;
    let testUser:UserSchema;

    beforeAll( async()=>{
        const passwordDigestResponseObj = await createPasswordDigest('123');
        testUser = await db.one('INSERT INTO users(first_name, last_name, username, password_digest, created_at, updated_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', ['testFirstName', 'testLastName', 'test123', passwordDigestResponseObj.passwordDigest ]);
    });
    beforeEach(()=>{
        router = express();
        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
    });
    afterAll(async()=>{
        const x = await db.any('DELETE FROM users');
    });
    describe("GET /users/show", ()=>{
        //calls getUser
        test("protected route", async() =>{
            const response = await request(router).get("/users/show");
            expect(response.status).toEqual(401);
        });
        test("returns user when token is given", async()=>{
            const testToken = generateJWT({ user_id: testUser.id })
            const response = await request(router).get("/users/show").set('authorization', `Bearer ${testToken}`);
            expect(response.body.user.user.username).toEqual('test123')
        })
    });
    describe("GET /users", ()=>{
        //calls getAllUsers
        test('protected route', async()=>{
            const response = await request(router).get("/users");
            expect(response.status).toEqual(401);
        });
        test('returns all users when token is given', async()=>{
            const testToken = generateJWT({ user_id: testUser.id })
            const response = await request(router).get("/users").set('authorization', `Bearer ${testToken}`);
            const allUsers = await db.any('SELECT * FROM users')
            expect(response.body.allUsers.length).toEqual(allUsers.length)
        });
    });
    describe("POST /create-user", ()=>{
        //calls createUser
        test("not a protected route", async ()=>{
            const testCreateUser = {user: { firstName: 'testFN2', lastName: 'testLN2', username: 'testUN2', password: '123'}}
            const response = await request(router).post("/create-user").send(testCreateUser);
            expect(response.status).toEqual(200);
            expect(response.body.user.user.username).toEqual('testUN2');
        });
        test("cannot create user with existing username", async()=>{
            const createUserBadUsername = {user: { firstName: 'testFN2', lastName: 'testLN2', username: 'test123', password: '123'}}
            const response = await request(router).post("/create-user").send(createUserBadUsername);
            expect(response.status).toEqual(200);
           expect(response.body.errors.messages[0]).toEqual('Username is taken, please choose another.'); 
        });
    })
    describe("POST /login", ()=>{
        //calls loginUser
        test("not a protected route and logs in user with existing credentials", async ()=>{
            const existingUserLoginInFormation = {user: { username: "test123", password: '123'} }
            const response = await request(router).post("/login").send(existingUserLoginInFormation);
            expect(response.status).toEqual(200);
            expect(response.body.user.user.username).toEqual('test123')
        })
    })
})