import { Router, } from "express";
import { UserDao } from "../repositories/UserDao";
import { body, validationResult } from 'express-validator';
import {checkIfEmailExists, registerUserValidationRules } from '../helpers/validatorHelper'
import { calculateAge } from "../utils/utils";
import { TokenGenerator } from "../services/tocken";
import {User} from "../models/user/User";
import { EmailVerification } from '../models/email/EmailDao';

//Create Router Object
const routerUser = Router();
//Create new UserDao Object
const dao = new UserDao();
const TokenService = new TokenGenerator()
/*
* For list all users
* Return json list of Users
*
*/
routerUser.get('/listAllusers', async function(req, res) {
  const listOfUsers = await dao.listAllUsers();
  res.status(200).json(listOfUsers)
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
      const idUser = req.body.UserId;
      // Check if the param is was passed
      if (!idUser) {
          return resp.status(400).json({status:"error", message: "User param is not send for the client" });
      }
      // Get the user filter by id
      const user = await dao.findUserById(idUser);

      // Check if user is found
      if (!user) {
          return resp.status(404).json({status:"error", error: "User Don´t found" });
      }
      //Return the response json with user
      resp.status(200).json(user);
  } catch (error) {
      console.error("Error finding User, error");
      resp.status(500).json({ error: "Error inside server" });
  }
});
/*
* Create a new user and save in the database
* return json respond or error
*/
routerUser.post("/createUser", registerUserValidationRules(),checkIfEmailExists, async function(req: any, resp: any) {
  try {
  
    // Validate the data from client
    const errors = validationResult(req);
    //Check errors in data entry
    if (!errors.isEmpty()) {
      return resp.status(400).json({ errors: errors.array() });
    }
    // Extrae los datos del cuerpo de la solicitud
    const { name, surname, age, email, phone, img ,password} = req.body;
    // Calcula la edad del usuario
    let ageUser: number = calculateAge(age);
    let rol = "user";
    let status = "withoutSubscription";
    // Crea el usuario en la base de datos
    const user = await dao.createUser(name, surname, age, email, phone, img ,rol,status,password);
    // Devuelve una respuesta exitosa
    return resp.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        name,
        surname,
        age: ageUser,
        email,
        phone,
        img,
        rol,
        status,
        password
        // Agrega cualquier otra información relevante aquí, como el ID del usuario
      }
    });
  } catch(error) {
    // Maneja cualquier error que pueda ocurrir durante la creación del usuario
    console.error("Error creating user:", error);
    return resp.status(500).json({ error: "Internal server error" });
  }
});



const tocken = new TokenGenerator();
routerUser.post("/loginUser", async function(req: any, resp: any) {
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

// Ruta para enviar correo electrónico
routerUser.post('/send-email',async (req:any, res:any) => {
  //Obtein the email from the client
  const {email} = req.body;
  
    try {
      const payload = {
        IdUser:50,
      }
      //Create the token
      //Set the time of expiration
       
       // Create a new Token
       const token = new TokenGenerator().setToken(payload);
       // -- Options for Mail --//
       const subject = "Email Verification";
       const text = "Pincha sobre el enlace para verificar el correo";
       const html = `<a href="http://localhost:8000/user/verification?token=${token}" > Email Verificación</a>`;
       const options = EmailVerification.setOption(email,subject,text,html)
       //Save the token for verify the user for register
       const daoUser = new UserDao();
       //const setTokenStatus = await  daoUser.SetTokenVerification (email,token);

      
        EmailVerification.sendEmail(options)
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

routerUser.get("/verification",async (req:any,res:any) => {
  const token = req.query.token;

  //check the token
  const tokenService = new TokenGenerator()
  const checkToken = await tokenService.checkTokenVerification(token)

  if(checkToken){
    res.redirect('https://www.google.com');
  }else{
    res.json({
      status:"error",
      message:"User not registered"
    })
  }
})


export{routerUser}
