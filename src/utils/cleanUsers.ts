//const cron = require('node-cron');
import {UserDao} from "../repositories/UserDao"
import cron from 'node-cron';

// Crea una instancia de UserDao
const dao = new UserDao();

// Define  the task each several time
cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando tarea programada de limpieza de usuarios...');

  try {
    // Lógica para verificar y eliminar usuarios
    await dao.cleanupUsers();
    console.log('Tarea programada completada.');
  } catch (error) {
    console.error('Error durante la ejecución de la tarea programada:', error);
  }
});