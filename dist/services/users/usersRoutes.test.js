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
const usersRoutes_1 = __importDefault(require("./usersRoutes"));
const jwt_1 = require("../../middleware/jwt");
const db_1 = require("../../utils/db");
const usersController_1 = require("./usersController");
describe("User Routes", () => {
    let router;
    let testUser;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.any('DELETE FROM users');
        const passwordDigestResponseObj = yield usersController_1.createPasswordDigest('123');
        testUser = yield db_1.db.one('INSERT INTO users(first_name, last_name, username, password_digest, created_at, updated_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', ['testFirstName', 'testLastName', 'test123', passwordDigestResponseObj.passwordDigest]);
    }));
    beforeEach(() => {
        router = express_1.default();
        utils_1.applyMiddleware(middleware_1.default, router);
        utils_1.applyRoutes(usersRoutes_1.default, router);
        utils_1.applyMiddleware(errorHandlers_1.default, router);
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const x = yield db_1.db.any('DELETE FROM users');
    }));
    describe("GET /users/show", () => {
        //calls getUser
        test("protected route", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield supertest_1.default(router).get("/users/show");
            expect(response.status).toEqual(401);
        }));
        test("returns user when token is given", () => __awaiter(void 0, void 0, void 0, function* () {
            const testToken = jwt_1.generateJWT({ user_id: testUser.id });
            const response = yield supertest_1.default(router).get("/users/show").set('authorization', `Bearer ${testToken}`);
            expect(response.body.user.user.username).toEqual('test123');
        }));
    });
    describe("GET /users", () => {
        //calls getAllUsers
        test('protected route', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield supertest_1.default(router).get("/users");
            expect(response.status).toEqual(401);
        }));
        test('returns all users when token is given', () => __awaiter(void 0, void 0, void 0, function* () {
            const testToken = jwt_1.generateJWT({ user_id: testUser.id });
            const response = yield supertest_1.default(router).get("/users").set('authorization', `Bearer ${testToken}`);
            const allUsers = yield db_1.db.any('SELECT * FROM users');
            expect(response.body.allUsers.length).toEqual(allUsers.length);
        }));
    });
    describe("POST /create-user", () => {
        //calls createUser
        test("not a protected route", () => __awaiter(void 0, void 0, void 0, function* () {
            const testCreateUser = { user: { firstName: 'testFN2', lastName: 'testLN2', username: 'testUN2', password: '123' } };
            const response = yield supertest_1.default(router).post("/create-user").send(testCreateUser);
            expect(response.status).toEqual(200);
            expect(response.body.user.user.username).toEqual('testUN2');
        }));
        test("cannot create user with existing username", () => __awaiter(void 0, void 0, void 0, function* () {
            const createUserBadUsername = { user: { firstName: 'testFN2', lastName: 'testLN2', username: 'test123', password: '123' } };
            const response = yield supertest_1.default(router).post("/create-user").send(createUserBadUsername);
            expect(response.status).toEqual(200);
            expect(response.body.success).toBeFalsy;
        }));
    });
    describe("POST /login", () => {
        //calls loginUser
        test("not a protected route and logs in user with existing credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            const existingUserLoginInFormation = { user: { username: "test123", password: '123' } };
            const response = yield supertest_1.default(router).post("/login").send(existingUserLoginInFormation);
            expect(response.status).toEqual(200);
            expect(response.body.user.user.username).toEqual('test123');
        }));
    });
});
//# sourceMappingURL=usersRoutes.test.js.map