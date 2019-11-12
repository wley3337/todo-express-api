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
const db_1 = require("../../utils/db");
const toDosController_1 = require("../toDos/toDosController");
exports.getUserListsById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userLists = yield db_1.db.any('SELECT * FROM lists WHERE user_id = $1', userId);
    //when mapping with async functions you need to wrap the map in a promise.all since each
    //iteration of the map returns a promise object, you need to wait until all promise objects 
    //have resolved.
    return Promise.all(userLists.map((list) => __awaiter(void 0, void 0, void 0, function* () { return yield serializeList(list); })));
});
const serializeList = (list) => __awaiter(void 0, void 0, void 0, function* () {
    const listToDos = yield toDosController_1.getListToDos(list.id);
    return {
        id: list.id,
        heading: list.heading,
        toDos: listToDos
    };
});
//# sourceMappingURL=listsController.js.map