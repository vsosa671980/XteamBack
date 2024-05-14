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
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

declare const nodemailerConfig: any;


const app = express();
const PORT = 8000;


//Mail 
// Middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
  host: 'smtp.servidor-correo.net', // SMTP host
  port: 25, // Port
  secure: false, 
  auth: {
    user: "vsosa@vdevit.com",
    pass: "Suse@2029"
  }
});

// Ruta para enviar correo electrónico
app.post('/send-email', (req, res) => {
  // Extrae los detalles del correo electrónico del cuerpo de la solicitud
  //const { to, subject, text } = req.body;


  // Detalles del correo electrónico
  const mailOptions = {
    from: 'vsosa@vdevit.com',
    to: "vsosa@vdevit.com",
    subject: "Verificacion de Correo",
    text: "Pincha sobre el enlaze para verificar el correo electronico",
    html:"<div><h1>Verificacion de Correo </H1><a>Pincha sobre el enlace</<a></div>"
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error", error);
      res.status(500).send("Error al enviar el correo electrónico");
    } else {
      console.log("Email sent");
      res.status(200).send("Correo electrónico enviado exitosamente");
    }
  });
});






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