

# DOTENV

## DB_HOST=localhost
DB_USER=usuario
DB_PASS=contraseña

require('dotenv').config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;