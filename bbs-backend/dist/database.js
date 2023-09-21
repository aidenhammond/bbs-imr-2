"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*export const connectPostDatabase = async () => {
    const db = await open({
        filename: 'bbs_message_storage.db',
        driver: sqlite3.Database,
      }).catch((err: any) => {
        console.error('Error opening database:', err.message);
        throw err;
      });
  
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
  
    const getAllPosts = async () => {
      const posts = await db.all(`
        SELECT * FROM posts
      `);
      return posts;
    };
  
    const addPost = async (post: Post) => {
      await db.run(`
        INSERT INTO posts (title, name, callsign, content) VALUES (?, ?, ?, ?)
      `, post.title, post.name, post.callsign, post.content);
    };

    const getPostById = async (id: number): Promise<Post | null> => {
      console.log(id)
      let request = `SELECT * FROM posts WHERE id = ?`
      return await db.get(request, [id], (err: any, row: any) => {
        console.log(row)
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
          const post: Post = {
            id: row.id,
            title: row.title,
            name: row.name,
            callsign: row.callsign,
            content: row.content,
            created_at: row.created_at,
          };
          console.log(post)
          return post;
        }
      }) || null;
    }
  
    return { getAllPosts, addPost, getPostById };
  };

  export async function connectUserDatabase() {
    const db = await open({
      filename: "./bbs_message_storage.db",
      driver: sqlite3.Database,
    });
  
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id	INTEGER NOT NULL,
        email	TEXT NOT NULL UNIQUE,
        password_hash	INTEGER NOT NULL,
        role_id	INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY(id AUTOINCREMENT),
        FOREIGN KEY(role_id) REFERENCES roles(id)
      );
    `);

    


    
  
    return { registerUser, getUser, checkEmailRole};
  }


*/ 
