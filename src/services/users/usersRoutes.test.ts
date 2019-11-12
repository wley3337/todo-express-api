import express, { Router } from 'express';
import request from 'supertest';
import { applyMiddleware, applyRoutes } from '../../utils';
import middleware from '../../middleware';
import errorHandlers from '../../middleware/errorHandlers';
import routes from './usersRoutes';


describe("User Routes", () =>{
    let router: Router;

    beforeEach(()=>{
        router = express();
        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
    });
    describe("POST /users", ()=>{
        test("returns route successfully", async() =>{
            const response = await request(router).post("/users");
            expect(response.status).toEqual(200);
        })
    })
})