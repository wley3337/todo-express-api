"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const utils_1 = require("../../utils");
const middleware_1 = __importDefault(require("../../middleware"));
const errorHandlers_1 = __importDefault(require("../../middleware/errorHandlers"));
const toDosRoutes_1 = __importDefault(require("./toDosRoutes"));
const jwt_1 = require("../../middleware/jwt");
const db_1 = require("../../utils/db");
const usersController_1 = require("../users/usersController");
describe('ToDo Routes', () => {
    let router;
    let testUser;
    let testList;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.any('DELETE FROM users');
        const passwordDigestResponseObj = yield usersController_1.createPasswordDigest('123');
        testUser = yield db_1.db.one('INSERT INTO users(first_name, last_name, username, password_digest, created_at, updated_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', ['testFirstName', 'testLastName', 'test123', passwordDigestResponseObj.passwordDigest]);
        testList = yield db_1.db.one('INSERT INTO lists(heading, user_id, display_order, created_at, updated_at) VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', ["Test List", testUser.id, 0]);
    }));
    beforeEach(() => {
        router = express_1.default();
        utils_1.applyMiddleware(middleware_1.default, router);
        utils_1.applyRoutes(toDosRoutes_1.default, router);
        utils_1.applyMiddleware(errorHandlers_1.default, router);
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.any('DELETE FROM users');
        yield db_1.db.any('DELETE FROM lists');
        yield db_1.db.any('DELETE FROM to_dos');
    }));
    describe("post /to_dos", () => {
        test("is a protected route", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield supertest_1.default(router).post("/to_dos/");
            expect(response.status).toEqual(401);
        }));
        test("toDo is properly created with a token", () => __awaiter(void 0, void 0, void 0, function* () {
            const testToken = jwt_1.generateJWT({ user_id: testUser.id });
            const toDoToAdd = { listId: testList.id, title: "toDoTest2", description: "testDescription", due: "2019-12-9" };
            const response = yield supertest_1.default(router).post("/to_dos/").set('authorization', `Bearer ${testToken}`).send({ to_do: toDoToAdd });
            expect(response.status).toEqual(200);
            expect(response.body.toDo.title).toEqual("toDoTest2");
        }));
    });
    describe("delete /to_dos/:id", () => {
        test("protected route", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield supertest_1.default(router).delete("/to_dos/1");
            expect(response.status).toEqual(401);
        }));
        test("toDo is properly deleted and returns toDoId and toDoListId", () => __awaiter(void 0, void 0, void 0, function* () {
            const testToken = jwt_1.generateJWT({ user_id: testUser.id });
            const testToDo = yield db_1.db.one('INSERT INTO to_dos(list_id, title, description, due, created_at, updated_at) VALUES($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [testList.id, "test toDo", "test toDo description", "2019-12-01"]);
            const serializedToDo = { id: testToDo.id, listId: testToDo.list_id, title: testToDo.title, description: testToDo.description, due: testToDo.due };
            const response = yield supertest_1.default(router).delete(`/to_dos/${testToDo.id}`).set('authorization', `Bearer ${testToken}`).send({ to_do: serializedToDo });
            expect(response.body.toDoId).toEqual(parseInt(testToDo.id));
            expect(response.body.toDoListId).toEqual(parseInt(testToDo.list_id));
        }));
    });
});
//# sourceMappingURL=toDosRoutes.test.js.map