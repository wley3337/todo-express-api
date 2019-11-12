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
Object.defineProperty(exports, "__esModule", { value: true });
const usersController_1 = require("./usersController");
// JWT USER_ID FROM TOKEN: parseInt(res.locals.jwtPayload.user_id)
const testUserCreate = {
    firstName: "testWill",
    lastName: "testLey",
    username: "test123",
    password: "123"
};
const testLoginUser = {
    username: "wley3337",
    password: "123"
};
const badUserLogin = {
    username: "wley3337",
    password: "12"
};
exports.default = [
    {
        path: "/users/show",
        method: "get",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = parseInt(res.locals.jwtPayload.user_id);
            const allUsers = yield usersController_1.getUser(userId);
            res.json(allUsers);
        })
    },
    {
        path: "/users",
        method: "get",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            //you need to await the db poll before returning the results
            // const allUsers = await getAllUsers();
            const allUsers = yield usersController_1.getAllUsers();
            res.json(allUsers);
        })
    },
    {
        path: "/users/new",
        method: "post",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            //you need to await the db poll before returning the results
            // const allUsers = await getAllUsers();
            const user = yield usersController_1.createUser(testUserCreate);
            res.json(user);
        })
    },
    {
        path: "/users",
        method: "post",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield usersController_1.loginUser(req.body.user);
            res.json(user);
        })
    }
];
//# sourceMappingURL=usersRoutes.js.map