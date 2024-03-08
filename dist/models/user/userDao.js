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
exports.UserDao = void 0;
const userModel_1 = require("./userModel");
class UserDao {
    /*
    Method for create the User
    *
    */
    createUser(name, surname, age, email, rol) {
        try {
            // Crea un nuevo usuario en la base de datos
            const newUser = userModel_1.User.create({
                name: "Vicente",
                surname: surname,
                age: age,
                email: email,
                rol: rol
            });
            return newUser;
        }
        catch (error) {
            console.error("Error al crear el usuario:", error);
            throw error;
        }
    }
    deleteUser() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateUser() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    findUserForId() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /// --- TODO OBTEIN THE NAME OF THE ROLE --- ///
    listUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.User.findAll();
                return users;
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.UserDao = UserDao;
