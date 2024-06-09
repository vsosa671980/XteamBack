import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../services/tocken';
import { UserDao } from '../repositories/UserDao';
import { User } from '../models/user/User';
import { NextFunction } from 'express';



const UserVerification = (req:any,res:any,next:any)=>{

    try {
        const tokenService = new TokenGenerator()
        const payload = tokenService.checkToken(req)
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};


export const UserVerificated  = async (req:any, res:any, next:any) =>{
    try{
        const userDao = new UserDao();
        const {email} = req.body
        const user:User = await  userDao.findUSerByEmail(email)
        if(!user.verificated ) {
            let response = {
                status:"error",
                message:"Yo need to verify your account"
            }
            return res.status(400).json({
                response
            })
        }
        next();
    }catch (error:any) {
        console.log("error in UserVerificated", error);
        res.status(500).send("Internal Server Error");
    }
}
export const tockenVerification = async (req:any, res:any, next:NextFunction) =>{
    try{
        const tokenService = new TokenGenerator();
        //Check the token
        const payload = tokenService.checkToken(req);
        // Set the user Payload
        req.userPayload = payload;
        //Call the next middleware
        next();
    }catch(error:any){
        res.status(401).json({ 
            status: "error",
            message: error.message || 'Unauthorized access',
            error: error
        });
    }
}