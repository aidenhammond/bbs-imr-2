/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { Request, Response, NextFunction } from "express";
import { User } from "./controllers/UserController";
import { invalidatedTokens } from "./controllers/UserController";
import * as jose from "jose"

export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

declare module "express-serve-static-core" {
    export interface Request {
      user?: User;
    }
  }

export async function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
        console.log(token);
        if (invalidatedTokens.has(token)) {
            res.status(403).json({ message: 'This token has been invalidated' });
            return;
        }
        try {
          const { payload } = await jose.jwtVerify(token, JWT_SECRET);
          console.log("exp: " + payload.exp!);
          console.log("date: " + Date.now() / 1000);
          if (payload.exp! < Date.now() / 1000 ) {
            res.status(403).json({ message: 'Expired token' });
            return;
          }
          let user: User = payload as {
            id: number;
            username: string;
            role_id: number;
            email: string;
          };
          req.user = user;
          //@ts-ignore
          next();
        } 
        catch (error) {
          res.status(403).json({ message: 'Invalid token' });
        }
    } else {
      res.status(401).json({ message: 'No token provided' });
    }
  }

  export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user?.role_id || req.user.role_id !== 2) {
      res.status(402).json({ message: 'Not an admin' });
    }
    else {
      next();
    }
  }
  