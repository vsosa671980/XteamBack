"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("./user/userModel");
const rolModel_1 = require("./rol/rolModel");
//Relationship between User and Roles One-to-Much
rolModel_1.Rol.hasMany(userModel_1.User);
userModel_1.User.belongsTo(rolModel_1.Rol);
