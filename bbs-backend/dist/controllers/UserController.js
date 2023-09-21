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
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidatedTokens = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const PermissionController_1 = __importDefault(require("./PermissionController"));
const __1 = require("..");
const jsonwebtoken_2 = __importDefault(require("jsonwebtoken"));
const node_cache_1 = __importDefault(require("node-cache"));
exports.invalidatedTokens = new node_cache_1.default({ stdTTL: 3600 }); // Cache with a default time-to-live of 1 hour
class UserController {
    constructor() {
        this.initUserTable();
    }
    initUserTable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id	INTEGER NOT NULL,
        email	TEXT NOT NULL UNIQUE,
        password_hash	INTEGER NOT NULL,
        role_id	INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY(id AUTOINCREMENT),
        FOREIGN KEY(role_id) REFERENCES roles(id)
      );
    `);
        });
    }
    static checkEmailRole(email, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let return_value = yield __1.db.get('SELECT role_id FROM users WHERE email = ?', [email], (err, row) => {
                if (err) {
                    console.log(err);
                    return { found: false, message: "Error: " + err };
                }
                else if (row === undefined) {
                    return { found: false, message: "Email not found in database" }; // Email not found in database
                }
                else {
                    return { found: row.role_id === role_id, message: "Role validated successfully" }; // Check whether role ID matches
                }
            });
            return return_value || { found: false, message: "return value undefined" };
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("register called");
            try {
                const { email, password } = req.body;
                const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
                yield UserController.registerUser(email, hashedPassword);
                let basic_user_role = yield PermissionController_1.default.getBasicUserRole();
                const JWT_SECRET = process.env.JWT_SECRET;
                const token = (0, jsonwebtoken_1.sign)({ email: email, role: basic_user_role }, JWT_SECRET, { expiresIn: "1h" });
                console.log("Register token: " + token);
                res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
                res.status(201).json({ message: "User registered successfully", token });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Error registering user" });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield UserController.getUser(email);
                res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
                if (!user) {
                    console.log("Inv email");
                    return res.status(400).json({ message: "Invalid email or password" });
                }
                const passwordValid = yield (0, bcrypt_1.compare)(password, user.password_hash);
                if (!passwordValid) {
                    console.log("Inv pass");
                    return res.status(400).json({ message: "Invalid email or password" });
                }
                const JWT_SECRET = process.env.JWT_SECRET;
                const token = (0, jsonwebtoken_1.sign)({ email: email, role_id: user.role_id }, JWT_SECRET, { expiresIn: "1h" });
                res.json({ message: "Logged in successfully", token: token, role_id: user.role_id });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Error logging in" });
            }
        });
    }
    static getLoginToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            try {
                const JWT_SECRET = process.env.JWT_SECRET;
                const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
                let check = yield this.checkEmailRole(decoded.email, decoded.role_id);
                if (check.found)
                    res.status(200).json({ message: 'Login successful' });
                else
                    throw new Error(check.message);
            }
            catch (error) {
                console.log(error);
                res.status(401).json({ message: 'Invalid token' });
            }
        });
    }
    static autoLogin(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.json({ role_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.role_id }).status(200);
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            if (token) {
                const JWT_SECRET = process.env.JWT_SECRET;
                jsonwebtoken_2.default.verify(token, JWT_SECRET, (err, decoded) => {
                    if (err) {
                        res.status(403).json({ message: 'Invalid or expired token' });
                    }
                    else {
                        // Invalidate the token by adding it to the cache
                        exports.invalidatedTokens.set(token, true);
                        res.json({ message: 'Logout successful' });
                    }
                });
            }
            else {
                res.status(401).json({ message: 'No token provided' });
            }
        });
    }
    static removeUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.run("DELETE FROM users WHERE id = ? AND email =?", user.id, user.email);
        });
    }
    static getUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield __1.db.get('SELECT * FROM users WHERE email ="' + email + '"');
            console.log(user);
            return user;
        });
    }
    static registerUser(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.run("INSERT INTO users (email, password_hash) VALUES (?, ?)", email, hashedPassword);
        });
    }
    static deleteToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO
            //res.sendStatus(200);
        });
    }
    static removeUsersRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { users } = req.body;
            for (let user of users) {
                UserController.removeUser(user);
            }
            // TODO handle errors
            res.status(200);
        });
    }
    static getAllUsersRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield __1.db.all('SELECT id, email, role_id FROM users');
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.status(200);
            res.json(users);
        });
    }
}
exports.default = UserController;
