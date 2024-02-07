// Import the libraries

import jwt from "jsonwebtoken";
import { randomBytes } from 'crypto';

 /**
     * Clase for generate object token
   
     */

export class tockenGenerator{

    /**
     * Crea una instancia de TokenGenerator.
     * @param {object} payload - La información que se incluirá en el token.
     * @param {string} secretKey - La clave secreta para firmar el token.
     */

    payload:object;
    secretKey:string;
    token:string;

    constructor(payload:object)
    {
        this.payload = payload;
        this.secretKey = randomBytes(32).toString('hex');
        this.token = this.setToken();
    }

     /**
     * Genera un token JWT utilizando el payload y la clave secreta proporcionados.
     * @returns {string} El token JWT generado.
     * @private
     */

    setToken():string{
       const token =  jwt.sign(this.payload,this.secretKey);
       return token;
    }


}