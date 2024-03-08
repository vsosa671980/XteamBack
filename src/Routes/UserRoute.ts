import { Router, } from "express";
import { UserDao } from "../repositories/UserDao";
import { body, validationResult } from 'express-validator';
import {checkIfEmailExists, registerUserValidationRules } from '../helpers/validatorHelper'
import { calculateAge } from "../utils/utils";

//Create Router Object
const routerUser = Router();
//Create new UserDao Object
const dao = new UserDao();


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
routerUser.post("/createUser", registerUserValidationRules(), async function(req: any, resp: any) {
  try {
    // Verifica si el correo electrónico ya existe
   // const emailExist = await checkIfEmailExists(req, resp);
    //if (emailExist) {
     // return; // Return the response from Check
    //}
    
    // Valida el cuerpo de la solicitud
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({ errors: errors.array() });
    }

    // Extrae los datos del cuerpo de la solicitud
    const { name, surname, age, email, phone, img ,rol,status,password} = req.body;

    // Calcula la edad del usuario
    let ageUser: number = calculateAge(age);

    // Crea el usuario en la base de datos
    
    // Devuelve una respuesta exitosa
    return resp.status(201).json({
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



/*
* Update the user 
* return json respond or error
*/
routerUser.post("/updateUser", registerUserValidationRules(), async function(req: any, resp: any){

})




/*
* Change the status of the user
* return json respond or error
*/

routerUser.post("/changeStatus", async function(req: any, resp: any) {

}
)


/*
* Login of user
* return json respond or error
*/

routerUser.post("/loginUser", async function(req: any, resp: any) {
  req.body.password = req.body.password
  req.body.email = req.body.email.toLowerCase();
  // Pass the request to the repository
}
)




export{routerUser}
