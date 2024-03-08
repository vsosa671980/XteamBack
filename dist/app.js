"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tocken_1 = require("./services/tocken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const queriesDatabase_01_1 = require("./database/migrations/queriesDatabase_01");
const app = (0, express_1.default)();
const PORT = 3000;
(0, queriesDatabase_01_1.createTablesDb)();
//Route for Users
//app.use("/users",userRouter);
//  const token = new tockenGenerator();
//  app.use('/salud3', token.checkToken);
// app.post('/salud3',token.checkToken, (req, res) => {
//  res.send('Saludo, mundo has pasado la validacion de del token!');
// });
app.get('/token', (req, res) => {
    const user = {
        userId: 123,
        rol: "Admin"
    };
    const payload = { userId: user.userId,
        rol: user.userId };
    if (user) {
        const token = new tocken_1.tockenGenerator();
        const tokenGenerad = token.setToken(payload);
        res.json({
            token: tokenGenerad
        });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
