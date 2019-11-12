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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../utils/db");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt = __importStar(require("bcrypt"));
const listsController_1 = require("../lists/listsController");
dotenv_1.default.config();
//schema:
// id             
// first_name 
// last_name 
// username 
// password_digest <-- ruby default salt value (cost) seems to be 12 
// created_at  
// updated_at
exports.getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () { return yield db_1.db.any('SELECT * FROM Users'); });
exports.getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield db_1.db.one('SELECT * FROM users WHERE id = $1', userId); });
// create user -- username must be unique
exports.createUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const newUsername = newUser.username;
    const userExists = yield db_1.db.any('SELECT * FROM Users WHERE username = $1', newUsername);
    if (userExists.length > 0) {
        console.log('userExists: ', userExists);
        const saltRounds = "12";
        const hash = userExists[0].password_digest;
        let result = yield authenticatePassword("12", hash);
        console.log("stuffds", result.success);
        // const createdUser = await db.one('INSERT INTO users (first_name, last_name, username, password_digest), VALUES $1, $2, $3, $4',[newUser.firstName, newUser.lastName, newUser.username,] )
    }
    else {
        return { success: false, errors: { messages: ['Username is taken, please choose another.'] } };
    }
});
// get a user by username
exports.loginUser = (userToLogin) => __awaiter(void 0, void 0, void 0, function* () {
    const username = userToLogin.username;
    const password = userToLogin.password;
    const existingUser = yield db_1.db.one('SELECT * FROM Users WHERE username = $1', username);
    if (existingUser) {
        const existingHash = existingUser.password_digest;
        const authenticated = yield authenticatePassword(password, existingHash);
        if (authenticated.success) {
            const userLists = yield listsController_1.getUserListsById(existingUser.id);
            return { success: true, user: existingUser, lists: userLists };
        }
        else {
            return { success: false, errors: { messages: "Wrong username or password" } };
        }
    }
});
// get a user by jwt token
//helper functions:
const authenticatePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, res) {
            if (res == true) {
                return resolve({ success: true });
            }
            else {
                return resolve({ success: false, error: err });
            }
        });
    });
    return response;
});
//# sourceMappingURL=usersController.js.map