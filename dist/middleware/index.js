"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const jwt_1 = require("./jwt");
exports.default = [common_1.handleBodyRequestParsing, common_1.handleCompression, common_1.handleCors, jwt_1.checkJWT];
//# sourceMappingURL=index.js.map