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
class PermissionController {
    constructor() {
        this.initPermissionsTable();
        this.initRolesTable();
        this.initRolePermissionsTable();
    }
    initPermissionsTable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.exec(`
        CREATE TABLE IF NOT EXISTS permissions (
            id	INTEGER NOT NULL,
            name	TEXT NOT NULL UNIQUE,
            PRIMARY KEY(id AUTOINCREMENT)
        );
    `);
        });
    }
    initRolesTable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.exec(`
            CREATE TABLE IF NOT EXISTS roles (
                id	INTEGER NOT NULL,
                name	TEXT NOT NULL UNIQUE,
                PRIMARY KEY(id AUTOINCREMENT)
            );
        `);
        });
    }
    initRolePermissionsTable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.db.exec(`
            CREATE TABLE IF NOT EXISTS role_permissions (
            id	INTEGER,
            role_id	INTEGER NOT NULL,
            permission_id	INTEGER NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY(permission_id) REFERENCES permissions(id),
            FOREIGN KEY(role_id) REFERENCES roles(id)
            );
        `);
        });
    }
    static getBasicUserRole() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = yield __1.db;
            const row = yield dbInstance.get('SELECT id FROM roles WHERE name = ?;', ['user']);
            if (!row) {
                console.log('No matching row found');
                return null;
            }
            console.log(row);
            return Number(row.id);
        });
    }
    ;
}
exports.default = PermissionController;
