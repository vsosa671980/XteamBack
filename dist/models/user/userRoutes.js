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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const userDao_1 = require("./userDao");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const userRouter = (0, express_2.Router)();
exports.userRouter = userRouter;
const dao = new userDao_1.UserDao();
/* For create a new USer
*
*/
userRouter.post("/create", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    //Create the  UserDao Object
    const { name, surname, email, date, rol } = req.body;
    //Calculate the birthday
    const calculateDate = (date) => {
        const actualDate = new Date().getFullYear();
        const birthDate = new Date(date).getFullYear();
        const dateUser = actualDate - birthDate;
        return dateUser;
    };
    // Get the birthday
    const dateResult = calculateDate(date);
    //Pass the values
    try {
        const user = yield dao.createUser(name, surname, dateResult, email, rol);
        return resp.status(200).json({
            userCreated: user
        });
    }
    catch (error) {
        return resp.status(404).json({
            error: error
        });
    }
}));
/*
*For get all users
*
*
*/
userRouter.get("/listAll", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersList = yield dao.listUsers();
        resp.status(200).json({
            users: usersList
        });
    }
    catch (error) {
        resp.status(404).json({
            error: "Cant created the user"
        });
    }
}));
