"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserController_1 = require("./controllers/UserController");
function verifyJWT(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        console.log(token);
        if (UserController_1.invalidatedTokens.has(token)) {
            res.status(403).json({ message: 'This token has been invalidated' });
            return;
        }
        console.log("Not invalidated");
        const JWT_SECRET = process.env.JWT_SECRET;
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("Failed to verify. Error: " + err);
                console.log(decoded);
                res.status(403).json({ message: 'Invalid or expired token' });
            }
            else {
                req.user = decoded;
                //@ts-ignore
                console.log("Good token. " + req.user);
                next();
            }
        });
    }
    else {
        res.status(401).json({ message: 'No token provided' });
    }
}
exports.verifyJWT = verifyJWT;
function verifyAdmin(req, res, next) {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.role_id) || req.user.role_id !== 2) {
        res.status(402).json({ message: 'Not an admin' });
    }
    else {
        next();
    }
}
exports.verifyAdmin = verifyAdmin;
