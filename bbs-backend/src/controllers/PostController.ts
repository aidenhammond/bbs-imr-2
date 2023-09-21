/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import Post from "../Post";
import { Request, Response } from "express";
import {db} from "..";

class PostController {

    constructor() {
      this.initPostTable();
      this.initUnverifiedPostTable();
    }

    async initPostTable() {
        await db.run(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title	TEXT NOT NULL,
                name	TEXT NOT NULL,
                callsign	TEXT NOT NULL,
                content 	TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
      }

    async initUnverifiedPostTable() {
      await db.run(`
            CREATE TABLE IF NOT EXISTS unverified_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title	TEXT NOT NULL,
                name	TEXT NOT NULL,
                callsign	TEXT NOT NULL,
                content 	TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    static async getAllPosts(): Promise<Post[]> {
      console.log("in getAllPosts")
      try {
        let get_posts = db.prepare('SELECT * FROM posts')
        let posts: Post[] = await get_posts.all();
        return posts;
      }
      catch (error: any) {
        console.log("Error: " + error)
      }
      return [];
    }

    static async getAllUnverifiedPosts(): Promise<Post[]> {
      console.log("in getAllUnverifiedPosts")
      try {
        let get_unverif_posts = db.prepare('SELECT * FROM unverified_posts');
        let posts: Post[] = await get_unverif_posts.all()
        return posts;
      }
      catch (error: any) {
        console.log("Error: " + error)
      }
      return [];
    }
    
    static async addUnverifiedPost(post: Post) {
      let add_post_query = await db.prepare(`
          INSERT INTO unverified_posts (title, name, callsign, content) VALUES ($title, $name, $callsign, $content)`);
      add_post_query.run({$title: post.title,$name: post.name, $callsign: post.callsign, $content: post.content})
    };

    static async removeUnverifiedPost(post: Post) {
      let remove_post_query = db.prepare(`
          DELETE FROM unverified_posts WHERE title=$title AND name=$name AND callsign=$callsign AND content=$content
      `);
      remove_post_query.run({$title: post.title,$name: post.name, $callsign: post.callsign, $content: post.content});
    };

    static async addVerifiedPost(post: Post) {
      let add_verif_post_query = db.prepare(`
          INSERT INTO posts (title, name, callsign, content) VALUES ($title, $name, $callsign, $content)
      `);
      add_verif_post_query.run({$title: post.title, $name: post.name, $callsign: post.callsign, $content: post.content});
    };



    static async getPostById(id: number): Promise<Post | null> {
        let request_query = db.prepare(`SELECT * FROM posts WHERE id = $id`);
        try {
          let row: Post = await request_query.get({$id: id});
          if (!row) {
            return null;
          }
          const post: Post = {
            id: row.id,
            title: row.title,
            name: row.name,
            callsign: row.callsign,
            content: row.content,
            created_at: row.created_at,
          };
          //console.log(post)
          return post; 
        } 
        catch (error) {
          console.error(`Error retrieving post with ID ${id}:`, error);
          console.log("failed1");
          return null;
        }
    }
    static async verifyPost(post: Post): Promise<boolean> {
      console.log("Adding post to verified posts");
      this.addVerifiedPost(post);
      console.log("Removing unverified post");
      this.removeUnverifiedPost(post);
      return false;
    }

    static async getPostsRoute(req: Request, res: Response) {
      console.log("getting all posts")
      const posts: Post[] = await PostController.getAllPosts();
      //console.log(posts);
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.json(JSON.stringify(posts)).status(200);
    }

    static async getAllUnverifiedPostsRoute(req: Request, res: Response) {
      console.log("getting all posts")
      const posts: Post[] = await PostController.getAllUnverifiedPosts();
      //console.log(posts);
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.json(JSON.stringify(posts)).status(200);
    }

    static async getAPostRoute(req: Request, res: Response) {
        const { id } = req.params;
        console.log("got a single request")
        const post: Post | null = await PostController.getPostById(Number(id));
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(200);
        res.json(post || {});
    }

    static async postUnverifiedPostRoute(req: Request, res: Response) {
        const post = req.body as Post;
        await PostController.addUnverifiedPost(post);
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(200);
        res.json({ message: 'Post added' });
    }
    
    static async verifyPostsRoute(req: Request, res: Response) {
      const posts: Post[] = req.body as Post[];
      for (let post of posts) {
        PostController.verifyPost(post);
      }
      res.sendStatus(200);
    }
}

export default PostController