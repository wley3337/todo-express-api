import express, { Router } from 'express';
import request from 'supertest';
import { applyMiddleware, applyRoutes } from '../../utils';
import middleware from '../../middleware';
import errorHandlers from '../../middleware/errorHandlers';
import routes from './listsRoutes';
import { generateJWT } from '../../middleware/jwt';
import { db } from '../../utils/db';
import { createPasswordDigest, UserSchema } from '../users/usersController';
import { ListSchemaType, SerializedListType } from './listsController';
import { SerializedToDo } from '../toDos/toDosController';

describe('Lists Routes', ()=>{
    let router: Router;
    let testUser:UserSchema;
    let testList:ListSchemaType;
  

    beforeAll( async()=>{
        await db.any('DELETE FROM users');
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
        await db.any('DELETE FROM users');
        await db.any('DELETE FROM lists');
        await db.any('DELETE FROM to_dos');
    });

  
    describe("post /lists", ()=>{
        test("is a protected route", async()=>{
            const response = await request(router).post("/lists")
            expect(response.status).toEqual(401)
        });

        test("List is properly created with a token", async()=>{
            const testToken = generateJWT({ user_id: testUser.id });
            const listToAdd = { heading: "test list 2"}
            const response = await request(router).post("/lists").set('authorization', `Bearer ${testToken}`).send( { list: listToAdd } )
            expect(response.status).toEqual(200)
            expect(response.body.list.heading).toEqual("test list 2")
        });
    })

    describe("delete /lists/:id", () =>{
        test("protected route", async()=>{
            const response = await request(router).delete("/lists/1")
            expect(response.status).toEqual(401) 
        });
        test("List is properly deleted and deletes all toDos associated with list. Returns old list", async()=>{
            const testToken = generateJWT({ user_id: testUser.id });
            testList = await db.one('INSERT INTO lists(heading, user_id, display_order, created_at, updated_at) VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [ "Test List", testUser.id, 0 ] );

            const testToDo = await db.one('INSERT INTO to_dos(list_id, title, description, due, created_at, updated_at) VALUES($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [testList.id, "test toDo", "test toDo description", "2019-12-01"]);

            const serializedToDo:SerializedToDo = { id: testToDo.id, listId: testToDo.list_id, title:testToDo.title, description: testToDo.description, due: testToDo.due }

            const serializedList:SerializedListType={ id: parseInt(testList.id), heading: testList.heading, toDos:[serializedToDo] }

            const response = await request(router).delete(`/lists/${testList.id}`).set('authorization', `Bearer ${testToken}`).send({list: serializedList}) 
            const shouldBeEmpty = await db.any('SELECT * FROM to_dos WHERE id = $1', [serializedToDo.id])
            expect(shouldBeEmpty.length).toEqual(0);
            expect(response.body.list.heading).toEqual(serializedList.heading);
        })
    })

})