import express, { response } from 'express';
import { Sequelize } from 'sequelize';
import { TokenGenerator} from './services/tocken';
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';
import { routerUser } from './Routes/UserRoute';
import cors from 'cors';
import { createTablesDb } from './database/migrations/queriesDatabase_01';
import { TrainingRouter } from './Routes/TrainingRoutes';
import { routerPayment } from './Routes/paymentRoute';


const app = express();
const PORT = 8000;

// For using dotenv
dotenv.config();
//Middlewares
app.use(cors());
app.use(express.json());
//Routes
app.use("/user",routerUser)
app.use("/training",TrainingRouter)
app.use("/payment",routerPayment)


//createTablesDb();
const sequelize = new Sequelize('database', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});


// Testing the connection 
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('La conexión se ha establecido exitosamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
}
testConnection();
 

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});