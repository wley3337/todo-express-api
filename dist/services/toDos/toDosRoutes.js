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
const toDosController_1 = require("./toDosController");
exports.default = [
    {
        path: "/to_dos/",
        method: "post",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const toDo = req.body.to_do;
            const newToDo = yield toDosController_1.createToDo(toDo);
            res.json(newToDo);
        })
    },
    {
        path: "/to_dos/:id",
        method: "delete",
        handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const toDo = req.body.to_do;
            const deletedToDo = yield toDosController_1.deleteToDo(toDo);
            res.json(deletedToDo);
        })
    },
];
//# sourceMappingURL=toDosRoutes.js.map