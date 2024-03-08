// Import the libraries
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';
import { DecodedToken } from '../interfaces/DecodedToken';
import { env } from 'process';
dotenv.config();


 /**
     * Clase for generate object token
   
     */
export class tockenGenerator{
    secretKey: string
    /**
     * Crea una instancia de TokenGenerator.
     * @param {object} payload - La información que se incluirá en el token.
     * @param {string} secretKey - La clave secreta para firmar el token.
     */
    constructor(){
          const secret = process.env.TOCKEN_SECRET;
          if (!secret) {
            throw new Error('TOCKEN_SECRET not found in environment variables.');
        }
          this.secretKey = secret;
          this.checkToken = this.checkToken.bind(this);
    }
     /**
     * Genera un token JWT utilizando el payload y la clave secreta proporcionados.
     * @returns {string} El token JWT generado.
     * .
     * @private
     */

    setToken(payload:object):string{
        const token =  jwt.sign(payload,this.secretKey);
        return token;
    }
    
    /**
     * Create middleware for check tokens
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    checkToken(req: Request, res: Response, next: NextFunction) {
        // Obtener el token
        let tokenReceived: string | undefined;
        if (req.headers.authorization) {
            tokenReceived = req.headers.authorization.split(" ")[1];
        } else {
            return res.status(401).json({ mensaje: 'Token no proporcionado' });
        }
        // Revisar el token
        try {
            // Verificar el token
            let result: DecodedToken | undefined;
            if (tokenReceived) {
                //const decoded = jwt.verify(tokenReceived, this.secretKey) as DecodedToken;
                let decoded= jwt.verify(tokenReceived, this.secretKey)
                if (typeof decoded !== "string"){
                     result = decoded as DecodedToken;
                }
                if(result !== undefined){
                    console.log(result.rol)      
                     
                }
                // Agregar el payload decodificado al objeto de solicitud para su uso posterior
                // req.usuario = decoded;
                // Continuar con el siguiente middleware
                next();
            } else {
                return res.status(401).json({ mensaje: 'Token no proporcionado' });
            }
        } catch (error) {
            console.log('Error al verificar el token:', error);
            if (tokenReceived) {
                return res.status(401).json({ mensaje: 'Token inválido', token: tokenReceived, error: error });
            } else {
                return res.status(401).json({ mensaje: 'Token no proporcionado', error: error });
            }
    }
    
    }

}