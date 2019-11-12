"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// , { algorithm: 'HS256', expiresIn:'1d' }
exports.checkJWT = (router) => {
    router.use((req, res, next) => {
        const path = req.path;
        const method = req.method;
        //non-auth route for user sign-up or login
        if (method === "POST" && (path === '/users' || path === '/users/new')) {
            next();
        }
        else {
            const rawToken = req.headers["authorization"];
            if (rawToken) {
                const token = rawToken.split(" ")[1];
                const key = process.env.SECRET_KEY;
                let jwtPayload;
                try {
                    jwtPayload = jwt.verify(token, key);
                    res.locals.jwtPayload = jwtPayload;
                }
                catch (err) {
                    res.status(401).send();
                    return;
                }
                next();
            }
            else {
                res.status(401).send();
                return;
            }
        }
    });
};
//# sourceMappingURL=jwt.js.map