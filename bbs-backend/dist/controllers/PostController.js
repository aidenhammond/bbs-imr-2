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
const __1 = require("..");
class PostController {
    constructor() {
        this.initPostTable();
        this.initUnverifiedPostTable();
    }
    initPostTable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.run(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title	TEXT NOT NULL,
                name	TEXT NOT NULL,
                callsign	TEXT NOT NULL,
                content 	TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        });
    }
    initUnverifiedPostTable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.run(`
            CREATE TABLE IF NOT EXISTS unverified_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title	TEXT NOT NULL,
                name	TEXT NOT NULL,
                callsign	TEXT NOT NULL,
                content 	TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        });
    }
    static getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("in getAllPosts");
            try {
                let posts = yield __1.db.all('SELECT * FROM posts');
                return posts;
            }
            catch (error) {
                console.log("Error: " + error);
            }
            return [];
        });
    }
    static getAllUnverifiedPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("in getAllUnverifiedPosts");
            try {
                let posts = yield __1.db.all('SELECT * FROM unverified_posts');
                return posts;
            }
            catch (error) {
                console.log("Error: " + error);
            }
            return [];
        });
    }
    static addUnverifiedPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.run(`
          INSERT INTO unverified_posts (title, name, callsign, content) VALUES (?, ?, ?, ?)
      `, post.title, post.name, post.callsign, post.content);
            console.log(post);
        });
    }
    ;
    static removeUnverifiedPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.run(`
          DELETE FROM unverified_posts WHERE title=? AND name=? AND callsign=? AND content=?
      `, [post.title, post.name, post.callsign, post.content]);
        });
    }
    ;
    static addVerifiedPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.run(`
          INSERT INTO posts (title, name, callsign, content) VALUES (?, ?, ?, ?)
      `, post.title, post.name, post.callsign, post.content);
        });
    }
    ;
    static getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = `SELECT * FROM posts WHERE id = ?`;
            return (yield __1.db.get(request, [id], (err, row) => {
                console.log(row);
                if (err) {
                    console.error(`Error retrieving post with ID ${id}:`, err);
                    console.log("failed1");
                    return null;
                }
                else if (!row) {
                    console.log("failed2");
                    return null;
                }
                else {
                    const post = {
                        id: row.id,
                        title: row.title,
                        name: row.name,
                        callsign: row.callsign,
                        content: row.content,
                        created_at: row.created_at,
                    };
                    console.log(post);
                    return post;
                }
            })) || null;
        });
    }
    static verifyPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Adding post to verified posts");
            this.addVerifiedPost(post);
            console.log("Removing unverified post");
            this.removeUnverifiedPost(post);
            return false;
        });
    }
    static getPostsRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getting all posts");
            const posts = yield PostController.getAllPosts();
            //console.log(posts);
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.json(JSON.stringify(posts)).status(200);
        });
    }
    static getAllUnverifiedPostsRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getting all posts");
            const posts = yield PostController.getAllUnverifiedPosts();
            //console.log(posts);
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.json(JSON.stringify(posts)).status(200);
        });
    }
    static getAPostRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log("got a single request");
            const post = yield PostController.getPostById(Number(id));
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.status(200);
            res.json(post || {});
        });
    }
    static postUnverifiedPostRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            yield PostController.addUnverifiedPost(post);
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.status(200);
            res.json({ message: 'Post added' });
        });
    }
    static verifyPostsRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = req.body;
            for (let post of posts) {
                PostController.verifyPost(post);
            }
            res.sendStatus(200);
        });
    }
}
exports.default = PostController;
