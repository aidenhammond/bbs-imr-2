/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import {hash, compare} from 'bcrypt';
//import { sign, verify} from "jsonwebtoken"
import PermissionController from './PermissionController';
import {db} from '..';
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import NodeCache from "node-cache";
import { SignJWT, jwtVerify} from 'jose';
import { JWT_SECRET } from "JWTManager";

interface User {
  id: number;
  username: string;
  role_id: number;
  email: string;
  passwordHash?: string;
}


export const invalidatedTokens = new NodeCache({ stdTTL: 3600*24 }); // Cache with a default time-to-live of 24 hours


class UserController {

  constructor() {
    this.initUserTable();
  }

  async initUserTable() {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id	INTEGER NOT NULL,
        email	TEXT NOT NULL UNIQUE,
        password_hash	INTEGER NOT NULL,
        role_id	INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY(id AUTOINCREMENT),
        FOREIGN KEY(role_id) REFERENCES roles(id)
      );
    `).run();
  }


  static async checkEmailRole(email: string, role_id: number) : Promise<{found: boolean, message: string}> {
    let return_value: {found: boolean, message: string} | undefined = await db.query('SELECT role_id FROM users WHERE email = $email').get({$email: email});

     /* (err: any, row: any) => {
        if (err) {
          console.log(err);
          return {found: false, message: "Error: " + err};
        } else if (row === undefined) {
          return {found: false, message: "Email not found in database"}; // Email not found in database
        } else {
          return {found: row.role_id === role_id, message: "Role validated successfully"}; // Check whether role ID matches
        }
      }
    );*/
    return return_value || {found: false, message: "return value undefined"};
  }

  static async register(req: Request, res: Response) {
    console.log("register called")
    try {
        const { email, password } = req.body;
        // Hash the password using Bun / bcrypt
        const hashedPassword = await Bun.password.hash(password, {
          "algorithm": "bcrypt",
          "cost":10
        });

        // Register the users information to the database
        await UserController.registerUser(email, hashedPassword);
        
        // Get the basic user role from the permissions database
        let basic_user_role = await PermissionController.getBasicUserRole();
        
        // Using the secret, sign a token to be returned
        const token = await new SignJWT({ email: email, role_id: basic_user_role })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setIssuer('urn:example:issuer')
          .setAudience('urn:example:audience')
          .setExpirationTime('2h')
          .sign(JWT_SECRET);//ign({ email: email, role: basic_user_role}, JWT_SECRET, { expiresIn: "1h" });
        console.log("Register token: " + token);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(201).json({ message: "User registered successfully", token});
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error registering user" });
      }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as {email: string, password: string};
      const user: User = await UserController.getUser(email);
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      if (!user) {
        console.log("Inv email")
        return res.status(400).json({ message: "Invalid email or password" });
      }
      console.log("user: " + user.passwordHash!);
      const passwordValid = await Bun.password.verify(password, user.password_hash);

      if (!passwordValid) {
        console.log("Inv pass")
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      const token = await new SignJWT({ email: email, role_id: user.role_id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer('urn:example:issuer')
      .setAudience('urn:example:audience')
      .setExpirationTime('2h')
      .sign(JWT_SECRET);//sign({ email: email, role_id: user.role_id}, JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Logged in successfully", token: token, role_id: user.role_id }); // TODO Take out role_id
    } catch (error) {
      console.log(error)

      res.status(500).json({ message: "Error logging in" });
    }
  }

  static async getLoginToken(req: Request, res: Response) {
    const { token } = req.params;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET); //as { email: string , role_id: number };
      const { email, role_id } = payload as { email: string , role_id: number };
      let check: {found: boolean, message: string} = await this.checkEmailRole(email, role_id);
      if (check.found) res.status(200).json({ message: 'Login successful' });
      else throw new Error(check.message);
    }
    catch (error: any) {
      console.log(error);
      res.status(401).json({ message: 'Invalid token' });
    }
  }

  static async autoLogin(req: Request, res: Response) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json({role_id: req.user?.role_id}).status(200);
  }

  static async logout(req: Request, res: Response) {
    const token = req.headers.authorization;
  
    if (!token) {
        res.json({ message: 'No token provided' });
        res.sendStatus(401);
        return;
    }
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload && !invalidatedTokens.has(token)) {
      invalidatedTokens.set(token, true);
    }
    //const {email, role_id} = payload as { email: string, role_id: number};
    // Invalidate the token by adding it to the cache
    res.json({ message: 'Logout successful' });
  }

  static async removeUser(user: User) {
    const query = await db.prepare("DELETE FROM users WHERE id = $id AND email = $email");
    query.run({$id: user.id,$email: user.email});
  }



  static async getUser(email: string): Promise<User> {
    let user_query = await db.prepare('SELECT * FROM users WHERE email = $email');
    let user: User = await user_query.get({$email : email});
    return user;
  }

  static async registerUser(email: string, hashedPassword: string) {
    let register_query = await db.prepare("INSERT INTO users (email, password_hash) VALUES ($email, $hashedPassword)");
    await register_query.run({$email: email, $hashedPassword: hashedPassword});
  }

  static async deleteToken(req: Request, res: Response) {
    // TODO
    //res.sendStatus(200);
  }

  static async removeUsersRoute(req: Request, res: Response) {
    const { users } = req.body as { users: User[] }
    for (let user of users) {
      UserController.removeUser(user);
    }
    // TODO handle errors
    res.status(200);
  }
  static async getAllUsersRoute(req: Request, res: Response) {
    let users = await db.query('SELECT id, email, role_id FROM users').all();
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.status(200);
    res.json(users);
  }
}




export default UserController
export { User }