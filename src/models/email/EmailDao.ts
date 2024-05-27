import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { TokenGenerator } from '../../services/tocken';
import { User } from '../user/User';
import { UserDao } from '../../repositories/UserDao';

//DOTENV
dotenv.config();
export class EmailVerification{

    static transporter(){
      const transp=  nodemailer.createTransport({
            host: process.env.HOST, // SMTP host
            port: 25, // Port
            secure: false, 
            auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSWORDMAIL
           }
        })
        return transp
       }

    static setOption(to:string,subject:string,text:string,html:string){
        const options = {
            from: process.env.USERMAIL,
            to:to,
            subject: subject,
            text: text,
            html: html
        }
        return options
    }
      static sendEmail(mailOptions:Object){
        const transp= this.transporter()
        transp.sendMail(mailOptions,(error,info) => {
          if (error){
            throw new Error()
          }
          console.log(info)
        })
       }


    static async sendEmailVerification(user:User){
        try{
            //Create the toker for the user
            //Payload of User
            //Get the id Of the user
            const userDao = new UserDao()
            console.log("Mail del Usuario" ,user.email)
            const userDatabase  = await userDao.findUSerByEmail(user.email)
            const id = userDatabase.idUser
            console.log("Usuario", userDatabase)
            console.log("Id del usuario",id)
            
            const payload = {
                "IdUser": id,
                "name":user.name,
                "rol":user.rol
            }
            //Create token Object
            const tokenService = new TokenGenerator();
            //Set the token
            const token =tokenService.setToken(payload) 
            //Create options for email
            const emailUser = user.email
            const subject = "Verificacion de Correo electronico"
            const text = "Pulsa el boton para enviar la verificacion de del correo"
            const html = `<a href="http://localhost:8000/user/verification?token=${token}" > Email Verificación</a>`;
            // Send the email Verification
            const optionsEmail = EmailVerification.setOption(emailUser,subject,text,html)
            //Send the email to the user
            EmailVerification.sendEmail(optionsEmail)
        }catch(error:any){
            console.log(error)
            throw new Error(error.message)
        }
    }
}