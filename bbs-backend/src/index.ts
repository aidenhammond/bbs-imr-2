/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'
import cors from 'cors'
//import sqlite3 from "sqlite3";
//import { open, Database } from "sqlite";
import UserController from "./controllers/UserController";
import PostController from "./controllers/PostController";
import { verifyAdmin, verifyJWT } from "./JWTManager";
import PermissionController from "./controllers/PermissionController";
import { Database } from "bun:sqlite";

let db: Database;
dotenv.config();
const app: Application = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//let db: Database<sqlite3.Database, sqlite3.Statement>;
async function initializeDatabase() {
  try {
    db = new Database("bbs_message_storage.db"); 
    new PermissionController();
    new UserController();
    new PostController();
    console.log('Database opened successfully');
  } catch (err: any) {
    console.error('Error opening database:', err.message);
    throw err;
  }
}

const startServer = async () => {

  // Getting all posts
  app.get('/posts', PostController.getPostsRoute);

  // Getting a single post
  app.get('/posts/:id', PostController.getAPostRoute);

  // Posting a post
  app.post('/posts', verifyJWT, PostController.postUnverifiedPostRoute);

  // Registeration route
  app.post("/register", UserController.register);

  // Login route
  app.post("/user/login", UserController.login);

  // Returns a token for maintaining login state
  app.post("/user/login/:token", UserController.getLoginToken);

  app.delete("/user/token", UserController.deleteToken);

  // Auto login function
  app.get("/auto-login", verifyJWT, UserController.autoLogin);

  app.get("/admin/unverified-posts", verifyJWT, verifyAdmin, PostController.getAllUnverifiedPostsRoute);

  app.post("/admin/verify-posts", verifyJWT, verifyAdmin, PostController.verifyPostsRoute);

  app.get("/admin/users", verifyJWT, verifyAdmin, UserController.getAllUsersRoute);

  app.delete("/admin/users", verifyJWT, verifyAdmin, UserController.removeUsersRoute);
  const PORT = process.env.PORT || 8000;
   // Allow all origins for CORS
  const corsOptions ={
    origin: '*',//'http://localhost:3000', 
    //credentials:true,            //access-control-allow-credentials:true
    optionsSuccessStatus:200,
    methods: ['GET', 'POST', 'DELETE'],
    //  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
 }
  app.use(cors(/*corsOptions*/));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
};


initializeDatabase().then(() => {
  // Your database is now opened, you can execute your queries here
  // or start your application
  // Initializing tables
  startServer();
});
//startServer();

export {db};

