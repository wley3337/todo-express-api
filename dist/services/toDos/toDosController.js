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
        id: toDo.id,
        listId: toDo.list_id,
        title: toDo.title,
        description: toDo.description,
        due: toDo.due
    };
};
exports.destroyToDoById = (toDoId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.one('DELETE FROM to_dos WHERE id = $1 RETURNING id', toDoId);
    return true;
});
//# sourceMappingURL=toDosController.js.map