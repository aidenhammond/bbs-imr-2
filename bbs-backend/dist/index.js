"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const UserController_1 = __importDefault(require("./controllers/UserController"));
const PostController_1 = __importDefault(require("./controllers/PostController"));
const JWTManager_1 = require("./JWTManager");
const PermissionController_1 = __importDefault(require("./controllers/PermissionController"));
dotenv.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
let db;
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            exports.db = db = yield (0, sqlite_1.open)({
                filename: './bbs_message_storage.db',
                driver: sqlite3_1.default.Database,
            });
            new PermissionController_1.default();
            new UserController_1.default();
            new PostController_1.default();
            console.log('Database opened successfully');
        }
        catch (err) {
            console.error('Error opening database:', err.message);
            throw err;
        }
    });
}
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // Getting all posts
    app.get('/posts', PostController_1.default.getPostsRoute);
    // Getting a single post
    app.get('/posts/:id', PostController_1.default.getAPostRoute);
    // Posting a post
    app.post('/posts', JWTManager_1.verifyJWT, PostController_1.default.postUnverifiedPostRoute);
    // Registeration route
    app.post("/register", UserController_1.default.register);
    // Login route
    app.post("/user/login", UserController_1.default.login);
    // Returns a token for maintaining login state
    app.post("/user/login/:token", UserController_1.default.getLoginToken);
    app.delete("/user/token", UserController_1.default.deleteToken);
    // Auto login function
    app.get("/auto-login", JWTManager_1.verifyJWT, UserController_1.default.autoLogin);
    app.get("/admin/unverified-posts", JWTManager_1.verifyJWT, JWTManager_1.verifyAdmin, PostController_1.default.getAllUnverifiedPostsRoute);
    app.post("/admin/verify-posts", JWTManager_1.verifyJWT, JWTManager_1.verifyAdmin, PostController_1.default.verifyPostsRoute);
    app.get("/admin/users", JWTManager_1.verifyJWT, JWTManager_1.verifyAdmin, UserController_1.default.getAllUsersRoute);
    app.delete("/admin/users", JWTManager_1.verifyJWT, JWTManager_1.verifyAdmin, UserController_1.default.removeUsersRoute);
    const PORT = process.env.PORT || 8000;
    // Allow all origins for CORS
    const corsOptions = {
        origin: true,
        //credentials:true,            //access-control-allow-credentials:true
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'DELETE'],
        //  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
    };
    app.use((0, cors_1.default)( /*corsOptions*/));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
});
initializeDatabase().then(() => {
    // Your database is now opened, you can execute your queries here
    // or start your application
    // Initializing tables
    startServer();
});
