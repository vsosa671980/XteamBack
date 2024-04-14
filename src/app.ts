import express, { response } from 'express';
import { TokenGenerator} from './services/tocken';
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';
import { routerUser } from './Routes/UserRoute';
dotenv.config();


import { createTablesDb } from './database/migrations/queriesDatabase_01';

const app = express();
const PORT = 3000;

app.use(express.json());TokenGenerator

app.use("/user",routerUser)




//createTablesDb();

//Route for Users

//app.use("/users",userRouter);
//  const token = new tockenGenerator();
//  app.use('/salud3', token.checkToken);
 // app.post('/salud3',token.checkToken, (req, res) => {
  //  res.send('Saludo, mundo has pasado la validacion de del token!');
 // });
app.post("/json",(req,resp) => {
  console.log(req.body);
  resp.json({result:"Hola desde json"})
})

 

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});