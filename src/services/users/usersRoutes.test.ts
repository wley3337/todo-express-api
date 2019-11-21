import express, { Router } from 'express';
import request from 'supertest';
import { applyMiddleware, applyRoutes } from '../../utils';
import middleware from '../../middleware';
import errorHandlers from '../../middleware/errorHandlers';
import routes from './usersRoutes';
import { generateJWT } from '../../middleware/jwt';
import { db } from '../../utils/db';
import { createPasswordDigest } from './usersController';


describe("User Routes", () =>{
    let router: Router;
    beforeAll(async()=>{
        const passwordDigestResponseObj = await createPasswordDigest('123');
        await db.one('INSERT INTO users(first_name, last_name, username, password_digest, created_at, updated_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP', ['testFirstName', 'testLastName', 'test123', passwordDigestResponseObj.passwordDigest ])
    })
    afterAll(async()=>{
        await db.one('DELETE FROM users WHERE username = test123')
    })
    beforeEach(()=>{
        router = express();
        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
    });
    describe("GET /users/show", ()=>{
        //calls getUser
        test("protected route", async() =>{
            
            const testToken = generateJWT({ user_id: 1 })
            const response = await request(router).get("/users/show").set('authorization', `Bearer ${testToken}`);
            expect(response.status).toEqual(401);
        })
    })
    describe("GET /users", ()=>{
        //calls getAllUsers
        test('protected route', async()=>{
            const response = await request(router).get("/users");
            expect(response.status).toEqual(401);
        })
    })
    
    describe("POST /create-user", ()=>{
        //calls createUser
        test("not a protected route", async ()=>{
            const createUser = jest.fn()
            const response = await request(router).post("/create-user");
            expect(response.status).toEqual(200);
        })
    })
    describe("POST /login", ()=>{
        //calls loginUser
        test("not a protected route", async ()=>{
            const response = await request(router).post("/login");
            expect(response.status).toEqual(200);
        })
    })
})