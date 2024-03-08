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
exports.User = void 0;
const databaseConnection_1 = require("../../config/databaseConnection");
const sequelize_1 = require("sequelize");
const roles_1 = require("../../enums/roles");
const conn = new databaseConnection_1.ConnectionDB();
const sequelizeInstance = conn.connectionDB();
const sequelize = new sequelize_1.Sequelize('xteamBack', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});
const User = sequelize.define('User', {
    idUser: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: roles_1.Roles.USER,
        validate: {
            //Check if is in Values allowed
            isIn: {
                //Arguments
                args: [Object.values(roles_1.Roles)],
                //Message of error
                msg: "Is not a valid Rol"
            }
        }
    }
});
exports.User = User;
function syncDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize.sync({ alter: true });
            console.log("Tables synchronized successfully with the models.");
        }
        catch (error) {
            console.error("Error synchronizing tables with models:", error);
        }
    });
}
syncDB();
