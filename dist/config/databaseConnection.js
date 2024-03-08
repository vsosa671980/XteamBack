"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionDB = void 0;
const sequelize_1 = require("sequelize");
class ConnectionDB {
    constructor() { }
    /**
     * Connection to database method
     */
    connectionDB() {
        const sequelize = new sequelize_1.Sequelize('xteamBack', 'root', '123456', {
            host: 'localhost',
            dialect: 'mysql'
        });
        try {
            sequelize.authenticate();
            console.log('Connection has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        //this.syncDB(sequelize);
        return sequelize;
    }
}
exports.ConnectionDB = ConnectionDB;
