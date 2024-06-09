// Import the libraries
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from 'dotenv';
import { DecodedToken } from '../interfaces/DecodedToken';
import { UserDao } from '../repositories/UserDao';
import { User } from '../models/user/User';

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
    checkToken(req: Request) {
        // Obtener el token
        let tokenReceived: string | undefined;
        // Check the headers
        if (req.headers.authorization) {
            //Get the token from headers.authorization
            tokenReceived = req.headers.authorization.split(" ")[1]; 
        } else {     
            throw new Error('Token not supplied');
        }
        try {
            // Create the payloas object
            let payload: DecodedToken | undefined;
            if (tokenReceived) {
                let decoded= jwt.verify(tokenReceived, this.secretKey)
                console.log(decoded)
                //Check and return the payload
                if (typeof decoded !== "string"){
                     payload = decoded as DecodedToken;
                     return payload
                }else{
                    throw new Error('Token inválido');
                }
            }
        } catch (error) {
            console.log('Error al verificar el token:', error);
            throw new Error('Token inválido');
        
       }
    }

    async checkTokenVerification(tokenReceived:string){
       console.log(tokenReceived)
        try{
            let decoded= jwt.verify(tokenReceived, this.secretKey) as DecodedToken
            //User Id received 
            console.log("Payload", decoded)
            let IdUser = decoded.IdUser;
            console.log("User del Usuario" , IdUser)     
            // Get the the user
            const userDao = new UserDao();
            const user= await userDao.findUserById(IdUser);
             // Check if user is found
           if (user != undefined) {
            console.log(user)
            console.log("Usuario", user.id);
            if (user.id) {
                // Update the camp of verified in the user
                await userDao.setVerificationUser(user.id)
            }
            return true;
          }

          return false;
                  
        }catch(error){
            console.log('Error al verificar el token:', error);

        }

    }
}



export {TokenGenerator}