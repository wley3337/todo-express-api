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
exports.getListToDos = (list_id) => __awaiter(void 0, void 0, void 0, function* () {
    const listToDos = yield db_1.db.any('SELECT * FROM to_dos WHERE list_id = $1', list_id);
    return listToDos.map(toDo => serializeToDo(toDo));
});
const serializeToDo = (toDo) => {
    return {
        id: parseInt(toDo.id),
        listId: toDo.list_id,
        title: toDo.title,
        description: toDo.description,
        due: toDo.due
    };
};
exports.destroyToDoById = (toDoId) => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield db_1.db.one('DELETE FROM to_dos WHERE id = $1 RETURNING id', toDoId);
    return id;
});
//{ success: true , toDo: new_to_do.serialize }
exports.createToDo = (toDo) => __awaiter(void 0, void 0, void 0, function* () {
    const listId = toDo.listId;
    const title = toDo.title;
    const description = toDo.description || "";
    const due = toDo.due;
    const newToDo = yield db_1.db.one('INSERT INTO to_dos(list_id, title, description, due, created_at, updated_at) VALUES($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [listId, title, description, due]);
    if (newToDo.id) {
        return { success: true, toDo: serializeToDo(newToDo) };
    }
    else {
        return { success: false, errors: { messages: "ToDo did not create" } };
    }
});
//{ success: true, toDoId: delete_params[:id], toDoListId: list_id}
exports.deleteToDo = (toDo) => __awaiter(void 0, void 0, void 0, function* () {
    const toDoId = yield exports.destroyToDoById(toDo.id);
    const toDoListId = toDo.listId;
    if (toDoId.id) {
        return { success: true, toDoId: parseInt(toDoId.id), toDoListId: toDoListId };
    }
    else {
        return { success: false, errors: { messages: "ToDo did not delete" } };
    }
});
//# sourceMappingURL=toDosController.js.map