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
const userController_1 = require("./userController");
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
        path: "/users/new",
        method: "post",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            //you need to await the db poll before returning the results
            // const allUsers = await getAllUsers();
            const user = yield userController_1.createUser(testUserCreate);
            res.json(user);
        })
    },
    {
        path: "/users",
        method: "get",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield userController_1.loginUser(testLoginUser);
            res.json(user);
        })
    }
];
//# sourceMappingURL=routes.js.map