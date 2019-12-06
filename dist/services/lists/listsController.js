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
    const listId = parseInt(list.id);
    const listToDos = yield toDosController_1.getListToDos(listId);
    return {
        id: listId,
        heading: list.heading,
        toDos: listToDos
    };
});
//{ success: true, list: serializedList } 
exports.createList = (list, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const createdList = yield db_1.db.one('INSERT INTO lists(heading, user_id, display_order, created_at, updated_at) VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [list.heading, userId, 0]);
    if (createdList.id) {
        const newSerializedList = yield serializeList(createdList);
        return { success: true, list: newSerializedList };
    }
    else {
        return { success: false, errors: { messages: "List did not save" } };
    }
});
//{ success: true, list: serializedList }
//not sure how to handle db errors here and if I'm creating a race condition with the db calls. 
exports.deleteList = (listId) => __awaiter(void 0, void 0, void 0, function* () {
    //get current list
    const list = yield db_1.db.one('SELECT * FROM lists WHERE id = $1 LIMIT 1', listId);
    if (list.id) {
        //serialize list for return 
        const listToReturn = yield serializeList(list);
        //destroy all toDos associated with this list
        listToReturn.toDos.forEach((toDo) => __awaiter(void 0, void 0, void 0, function* () { return yield toDosController_1.destroyToDoById(toDo.id); }));
        //destroy list 
        yield db_1.db.one('DELETE FROM lists WHERE id = $1 RETURNING *', listId);
        //return
        return { success: true, list: listToReturn };
    }
    else {
        return { success: false, errors: { messages: "List did not delete" } };
    }
});
//# sourceMappingURL=listsController.js.map