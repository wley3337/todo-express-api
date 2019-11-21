import express, { Router } from 'express';
import request from 'supertest';
import { applyMiddleware, applyRoutes } from '../../utils';
import middleware from '../../middleware';
import errorHandlers from '../../middleware/errorHandlers';
import routes from './toDosRoutes';
import { generateJWT } from '../../middleware/jwt';
import { db } from '../../utils/db';
import { createPasswordDigest, UserSchema } from '../users/usersController';
import { ListSchemaType } from '../lists/listsController';
import { toDoSchemaType, CreationToDo, SerializedToDo } from './toDosController';

describe('ToDo Routes', ()=>{
    let router: Router;
    let testUser:UserSchema;
    let testList:ListSchemaType;

    beforeAll( async()=>{
        const passwordDigestResponseObj = await createPasswordDigest('123');
        testUser = await db.one('INSERT INTO users(first_name, last_name, username, password_digest, created_at, updated_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', ['testFirstName', 'testLastName', 'test123', passwordDigestResponseObj.passwordDigest ]);
        testList = await db.one('INSERT INTO lists(heading, user_id, display_order, created_at, updated_at) VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [ "Test List", testUser.id, 0 ] );
        
    });
    beforeEach(()=>{
        router = express();
        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
    });
    afterAll(async()=>{
        await db.any('DELETE FROM users');
        await db.any('DELETE FROM lists');
        await db.any('DELETE FROM to_dos');
    });

  
    describe("post /to_dos", ()=>{
        test("is a protected route", async()=>{
            const response = await request(router).post("/to_dos/")
            expect(response.status).toEqual(401)
        });
        test("toDo is properly created with a token", async()=>{
            const testToken = generateJWT({ user_id: testUser.id })
            const toDoToAdd = { listId: testList.id, title: "toDoTest2", description:"testDescription", due: "2019-12-9"}
            const response = await request(router).post("/to_dos/").set('authorization', `Bearer ${testToken}`).send({to_do: toDoToAdd})
            expect(response.status).toEqual(200)
            expect(response.body.toDo.title).toEqual("toDoTest2")
        });
    })

    describe("delete /to_dos/:id", () =>{
        test("protected route", async()=>{
            const response = await request(router).delete("/to_dos/1")
            expect(response.status).toEqual(401) 
        });
        test("toDo is properly deleted and returns toDoId and toDoListId", async()=>{
            const testToken = generateJWT({ user_id: testUser.id })

            const testToDo = await db.one('INSERT INTO to_dos(list_id, title, description, due, created_at, updated_at) VALUES($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [testList.id, "test toDo", "test toDo description", "2019-12-01"]);
            const serializedToDo:SerializedToDo = { id: testToDo.id, listId: testToDo.list_id, title:testToDo.title, description: testToDo.description, due: testToDo.due }

            const response = await request(router).delete(`/to_dos/${testToDo.id}`).set('authorization', `Bearer ${testToken}`).send({to_do: serializedToDo}) 
            
            expect(response.body.toDoId).toEqual(parseInt(testToDo.id));
            expect(response.body.toDoListId).toEqual(parseInt(testToDo.list_id));
        })
    })

})