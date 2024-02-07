import express from 'express';
import { tockenGenerator } from './services/tocken';
const app = express();
const PORT = 3000;


const payload = { userId: 123 };
const tokenGenerator = new tockenGenerator(payload);

const token = tokenGenerator.token;


app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');

});

app.get('/saludo', (req, res) => {
    res.send('Saludo, mundo!');
  });


  
app.get('/salud2', (req, res) => {
    res.send('Saludo, mundo!');
  });

  app.get('/token', (req, res) => {
    res.json({
      token:token
    });
  });

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});