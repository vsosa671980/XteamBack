import dotenv from 'dotenv';
import nodemailer from 'nodemailer';


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
        console.log(text)
        console.log(html)
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
            if(error){
                console.log(error)
            }else{
                console.log('Email sent:'+ info.response)
            }
        })
       }
}