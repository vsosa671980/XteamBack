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
exports.UserController = void 0;
const userDao_1 = require("./userDao");
class UserController {
    constructor() {
        this.dao = new userDao_1.UserDao();
    }
    createUser(name, surname, age, email, rol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Creando usuario con nombre: ${name}`);
                const newUser = yield this.dao.createUser(name, surname, age, email, rol);
                // Puedes hacer algo con el nuevo usuario, como devolverlo como respuesta HTTP o imprimirlo
                console.log('Usuario creado:', newUser.toJSON());
                return newUser;
            }
            catch (error) {
                // Manejar el error adecuadamente, como enviar una respuesta de error HTTP
                console.error('Error al crear el usuario:', error);
                throw error;
            }
        });
    }
}
exports.UserController = UserController;
