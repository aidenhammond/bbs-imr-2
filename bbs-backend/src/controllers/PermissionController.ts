/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import {db} from "..";

class PermissionController {

    constructor() {
        this.initPermissionsTable();
        this.initRolesTable();
        this.initRolePermissionsTable();
    }

    async initPermissionsTable() {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS permissions (
                id	INTEGER NOT NULL,
                name	TEXT NOT NULL UNIQUE,
                PRIMARY KEY(id AUTOINCREMENT)
            );
        `).run();


    }

    async initRolesTable() {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS roles (
                id	INTEGER NOT NULL,
                name	TEXT NOT NULL UNIQUE,
                PRIMARY KEY(id AUTOINCREMENT)
            );
        `).run();
    }

    async initRolePermissionsTable() {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS role_permissions (
            id	INTEGER,
            role_id	INTEGER NOT NULL,
            permission_id	INTEGER NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY(permission_id) REFERENCES permissions(id),
            FOREIGN KEY(role_id) REFERENCES roles(id)
            );
        `).run();
    }

    static async getBasicUserRole(): Promise<number | null> {
        const dbInstance = await db;
        const row = dbInstance.prepare('SELECT id FROM roles WHERE name = "user";').get();
      
        if (!row) {
          console.log('No matching row found');
          return null;
        }
      
        return Number(row.id);
      };
    

    
}

export default PermissionController