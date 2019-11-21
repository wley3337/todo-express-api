"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersRoutes_1 = __importDefault(require("./users/usersRoutes"));
const listsRoutes_1 = __importDefault(require("./lists/listsRoutes"));
const toDosRoutes_1 = __importDefault(require("./toDos/toDosRoutes"));
exports.default = [...usersRoutes_1.default, ...listsRoutes_1.default, ...toDosRoutes_1.default];
//# sourceMappingURL=index.js.map