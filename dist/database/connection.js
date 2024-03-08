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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
/*
* Connection to database
*
*/
class connectionDB {
    /*
    * Set the connection with the database
    * return: object connection
    */
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield promise_1.default.createPool({
                    host: 'localhost',
                    user: 'root',
                    password: "123456",
                    database: 'xteam',
                });
                console.log("connected with mysql");
                return connection;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.connectionDB = connectionDB;
