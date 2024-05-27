import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../services/tocken';
import { UserDao } from '../repositories/UserDao';
import { User } from '../models/user/User';


const UserVerification = (req:any,res:any,next:any)=>{

    try {
        const tokenService = new TokenGenerator()
        const payload = tokenService.checkToken(req,res)
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