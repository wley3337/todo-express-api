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
const listsController_1 = require("./listsController");
exports.default = [
    {
        path: "/lists",
        method: "post",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = parseInt(res.locals.jwtPayload.user_id);
            const userAndNewList = yield listsController_1.createList(req.body.list, userId);
            res.json(userAndNewList);
        })
    },
    {
        path: "/lists/:id",
        method: "delete",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const listId = parseInt(req.body.list.id);
            const deletedList = yield listsController_1.deleteList(listId);
            res.json(deletedList);
        })
    },
];
//# sourceMappingURL=listsRoutes.js.map