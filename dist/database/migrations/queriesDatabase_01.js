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
exports.createTablesDb = void 0;
const connection_1 = require("../connection");
function createTablesDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Establecer la conexión
            const conn = yield connection_1.connectionDB.connect();
            if (conn) {
                // Tabla de Usuarios
                const createTableUser = `
                CREATE TABLE IF NOT EXISTS Users (
                    idUser INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    surname VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    age INT,
                    rol VARCHAR(255) NOT NULL DEFAULT 'user',
                    status VARCHAR(85),
                    category VARCHAR(255),
                    img VARCHAR(255)
                );
            `;
                yield conn.query(createTableUser);
                console.log("Tabla de Usuarios creada");
                // Tabla de Pagos
                const createPayment = `
                CREATE TABLE IF NOT EXISTS payments (
                    idPay INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    idUser INT,
                    FOREIGN KEY (idUser) REFERENCES Users(idUser)
                );
            `;
                yield conn.query(createPayment);
                console.log("Tabla de Pagos creada");
            }
            // Cerrar la conexión
            if (conn) {
                yield conn.end();
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createTablesDb = createTablesDb;
createTablesDb();
