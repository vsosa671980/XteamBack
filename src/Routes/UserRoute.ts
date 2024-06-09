import { Router, } from "express";
import { UserDao } from "../repositories/UserDao";
import { body, validationResult } from 'express-validator';
import {checkIfEmailExists, registerUserValidationRules } from '../helpers/validatorHelper'
import { calculateAge } from "../utils/utils";
import { TokenGenerator } from "../services/tocken";
import {User} from "../models/user/User";
import { EmailVerification } from '../models/email/EmailDao';
import { EncryptPassword } from "../utils/encryptPassword";
import { tockenVerification } from "../middlewares/UserVerification";

//Create Router Object
const routerUser = Router();
//Create new UserDao Object
const dao = new UserDao();
const TokenService = new TokenGenerator()



interface userResponse {
  users: any[];
  totalPages: number;
  actualPage: number;
}
/*
* For list all users
* Return json list of Users
*
*/
routerUser.post('/listPaginates', async function(req, res) {
  console.log("Me estan llamando")
  const {numberPage} = req.body
   try {
        const users = await dao.listPaginates(numberPage) as userResponse; // Get array of users
        console.log(users)
        let response = {
            status:"success",
            message:"User List",
            users:users.users,
            totalPages:users.totalPages,
            actualPage:users.actualPage
        }
        res.status(200).json(response);
    } catch (error) {
        let response = {
            status:"error",
            message:"Error listing the users",
            error:error
        }
        res.status(500).json(response);
    }
 
  });
/*
*Get Users filtered
*Return json Users or Error
*
*/
  routerUser.post("/filterUser",async function(req,resp) {
    const filters = req.body
    const user  =await  dao.filterUser(filters)
    resp.json({user:user})
  })
/*
*Get user filter by Id
*Return json User or Error
*/
routerUser.post("/findById", async function(req, resp) {
  try {
      //Get the id from client
      const idUser = req.body.id;
      console.log(idUser)
      // Check if the param is was passed
      if (!idUser) {
          return resp.status(400).json({status:"error", message: "User param is not send for the client" });
      }
      // Get the user filter by id
      const user = await dao.findUserById(idUser);
      console.log(user)
      // Check if user is found
      if (!user) {
          return resp.status(404).json({status:"error", error: "User Don´t found" });
      }
      //Return the response json with user
      resp.status(200).json(user);
  } catch (error) {
      console.error("Error finding User, error");
           //Create a new formFataObject
      resp.status(500).json({ error: "Error inside server" });
  }
});
/*
* Create a new user and save in the database
* return json respond or error
*/
routerUser.post("/crear",tockenVerification,checkIfEmailExists, async function(req: any, res: any) {
  try {
    // Validate the data from client
    const errors = validationResult(req);
    //Check errors in data entry
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Extrae los datos del cuerpo de la solicitud
    const { name, surname,secondSurname, age,email, phone, img ,password} = req.body;

    let ageUser: number = calculateAge(age);
    console.log(ageUser)
    const user = new User(name,surname,secondSurname,ageUser,email,phone,img,password);
    console.log("Usuario" ,user)
    // Encrypt the password of the user
    if(password){
      user.password = await EncryptPassword.encrypt(password);
    }
    user.img = "Esto es la imagen"
    //Create the user
    await dao.create(user)
    //send email for verify the user
    EmailVerification.sendEmailVerification(user)
    return res.json({
      status:"success",
      message:"User created"
    })
  } catch (error:any) {
    console.log(error.message)
    let response = {
        status:"error",
        message:error.message
    }
    console.log(response)
    return res.json(response) 
   }
})

const tocken = new TokenGenerator();
routerUser.post("/login", async function(req: any, resp: any) {
  //Set the body of the request
  let password = req.body.password
  let email = req.body.email.toLowerCase();
  //Check if user already exists and if the password is correct
   let responsePasswords = await dao.login(email, password);
   resp.status(200).json(responsePasswords);
}
);

routerUser.post("/loginTocken",tocken.checkToken, async function(req: any, resp: any) {
  //Set the body of the request
   resp.json({
    "message":"pass"
   })
})

routerUser.post("/register",registerUserValidationRules(),checkIfEmailExists, async function(req: any, resp: any) {

  try {
    const errors = validationResult(req);
    //Check errors in data entry
    if (!errors.isEmpty()) {
      return resp.status(400).json({ errors: errors.array() });
    }
    // Extrae los datos del cuerpo de la solicitud
    const { name, surname, age, email, phone, img ,password} = req.body;
    // Calcula la edad del usuario
    const userData = {
      name:name,
      surname:surname,
      age:age,
      email:email,
      phone:phone,
      img:img,
    }

    let response = {
      status:"success",
      message:"Data of user",
      user:userData
    }
    return response;
     
  } catch (error) {
    let response = {
      status:"error",
      message:"Error creating the user",
      error:error
    }
    return response;
  }

})

/*
* Send Email to the User for verify the user 
*
* */
routerUser.post('/send-email',async (req:any, res:any) => {
  //Obtein the email from the client
  const {email} = req.body;
  
    try {
      const payload = {
        IdUser:50,
      }
       // Create a new Token
       const token = new TokenGenerator().setToken(payload);
       // -- Options for Mail --//
       const subject = "Email Verification";
       const text = "Pincha sobre el enlace para verificar el correo";
       //Send email with token in
       const html = `<a href="http://localhost:8000/user/verification?token=${token}" > Email Verificación</a>`;
       // Send the options of the email
       const options = EmailVerification.setOption(email,subject,text,html)
       //Create daoUser instance
       const daoUser = new UserDao();
       //const setTokenStatus = await  daoUser.SetTokenVerification (email,token);
      // Send email to user
        EmailVerification.sendEmail(options)
        // Send the response to client
        res.status(200).json({
         status: "success",
         message: "Email sent successfully"
        })
       
     } catch (error:any) {
       res.status(500).json({
         status: "error",
         message: error.message
       })
     }
  });


/**
 * Verify the user 
 * @ Get the token in the url query
 */
routerUser.get("/verification",async (req:any,res:any) => {
  //Get the token
  const token = req.query.token;
  console.log(token)
  //check the token
  if(token){
    const tokenService = new TokenGenerator()
    const checkToken = await tokenService.checkTokenVerification(token)
    console.log(checkToken)
    //Check if CheckToken is True
    if(checkToken){
      //Change the user as verified
      // Get the data of the token
      res.redirect('http://localhost:3000/');
    }
  }
})


routerUser.post("/update",async(req:any, res:any) => {
    console.log("Entro en el update")
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Get the id
      const {id,dataObject} = req.body;
      // Find the training by id
      const userObject = await dao.findById(id);
      if(userObject){
          const user = await dao.update(id,dataObject)
          if(user){
              return res.json({
                  status:"success",
                  message:"Training updated successfully",
              })
          }else{
              return res.json({
                  status:"error",
                  message:"Training not found"
              })
          }
      }
  } catch (error:any) {
      let response = {
          status:"error",
          message:"Error updating the training",
          error:error
      }
      res.status(500).json(response);
  }
});

/**
 * Delete the training
 * @param idUser
 * @return json response
 */
routerUser.post("/delete",async(req:any, res:any) => {
 
  try {
      const {id} = req.body;
      console.log(id)
      if (id) {
          const userDeleted = await dao.delete(id)
          console.log(userDeleted)
          if (!userDeleted) {
              return res.status(400).json(
                  {status:"error", message: "User not found" });
          }
          let response = {
              status:"success",
              message:"user deleted successfully",
              training:userDeleted
          }
          res.status(200).json(response);
      }
  } catch (error) {
      let response = {
          status:"error",
          message:"Error deleting the user",
          error:error
      }
      res.status(500).json(response);
      
  }

})






export{routerUser}
