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
exports.default = [
    {
        path: "/users",
        method: "get",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            //you need to await the db poll before returning the results
            const allUsers = yield userController_1.getAllUsers();
            res.json(allUsers);
        })
    }
];
//# sourceMappingURL=routes.js.map