// Import the libraries
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';
import { DecodedToken } from '../interfaces/DecodedToken';
import { env } from 'process';
dotenv.config();


/**
     * Create new instance of token
     * @param {object} payload - La información que se incluirá en el token.
     * @param {string} secretKey - La clave secreta para firmar el token.
     */
class TokenGenerator{
  
        secretKey: string
    
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
     * @Param {object} payload
     * @returns {string} El token JWT generado.
     * 
     */
    setToken(payload:object,expiration:string="1h"):string{
        const options = {
            expiresIn: expiration // Token expirará en 1 hora desde la emisión
          };
        //Create token 
        const token =  jwt.sign(payload,this.secretKey,options);
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
        // Check the headers
        if (req.headers.authorization) {
            //Get the token from headers.authorization
            tokenReceived = req.headers.authorization.split(" ")[1]; 
        } else {     
            return res.status(401).json({ mensaje: 'Token not Supply error' });
        }
        try {
            // Verificar el token
            let result: DecodedToken | undefined;
            if (tokenReceived) {
                //const decoded = jwt.verify(tokenReceived, this.secretKey) as DecodedToken;
                // Check if token is valid
                let decoded= jwt.verify(tokenReceived, this.secretKey)
                console.log(decoded)
                if (typeof decoded !== "string"){
                     result = decoded as DecodedToken;
                     let rol = result.rol
                     let idUser = result.userId
                     let name = result.name
                     console.log(rol,idUser,name)
                }
                if(result !== undefined){
                    let rol = result.rol
                    console.log(rol)    
                    next();
                }

            } else {
                return res.status(401).json({ mensaje: 'Token not Supply' });
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

    checkTokenVerification(token:string){

        try{
            let decoded= jwt.verify(token, this.secretKey) as DecodedToken;
            if (decoded){
                let idUser = decoded.userId
            }

        }catch{

        }

    }
}



export {TokenGenerator}