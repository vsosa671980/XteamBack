import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/saludo', (req, res) => {
    res.send('Saludo, mundo!');
  });


  
app.get('/salud2', (req, res) => {
    res.send('Saludo, mundo!');
  });

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});