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
const jwt_1 = require("../../middleware/jwt");
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
//returns {success: true, user: {user: serializedUser, lists: [serializedLists] } }
exports.getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.one('SELECT * FROM users WHERE id = $1', userId);
    if (user) {
        const serializedUser = exports.serializeUser(user);
        const serializedLists = yield listsController_1.getUserListsById(user.id);
        return { success: true, user: { user: serializedUser, lists: serializedLists } };
    }
    else {
        return { success: false, errors: { messages: ["Please login"] } };
    }
});
// create user -- username must be unique
exports.createUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const newUsername = newUser.username;
    //check to see if the username is taken
    const userExists = yield db_1.db.any('SELECT * FROM users WHERE username = $1', newUsername);
    if (userExists.length === 0) {
        const passwordDigestResponseObj = yield exports.createPasswordDigest(newUser.password);
        if (passwordDigestResponseObj.success) {
            const createdUser = yield db_1.db.one('INSERT INTO users(first_name, last_name, username, password_digest, created_at, updated_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [newUser.firstName, newUser.lastName, newUser.username, passwordDigestResponseObj.passwordDigest]);
            const token = jwt_1.generateJWT({ user_id: createdUser.id });
            const user = exports.serializeUser(createdUser);
            return { success: true, user: { user: user, lists: [] }, token: token };
        }
        else {
            return { success: false, errors: { messages: ['An error occurred creating your password'] } };
        }
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
            const token = jwt_1.generateJWT({ user_id: existingUser.id });
            const userLists = yield listsController_1.getUserListsById(existingUser.id);
            const user = exports.serializeUser(existingUser);
            return { success: true, user: { user: user, lists: userLists }, token: token };
        }
        else {
            return { success: false, errors: { messages: "Wrong username or password" } };
        }
    }
});
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
exports.createPasswordDigest = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordDigestResponse = yield new Promise((resolve, reject) => {
        bcrypt.hash(password, 12, (err, hash) => {
            if (hash) {
                return resolve({ success: true, passwordDigest: hash });
            }
            else {
                return resolve({ success: false, error: err });
            }
        });
    });
    return passwordDigestResponse;
});
exports.serializeUser = (user) => {
    return { firstName: user.first_name, lastName: user.last_name, username: user.username };
};
//# sourceMappingURL=usersController.js.map