
import { connectionDB } from "../database/connection";
import { EncryptPassword } from "../utils/encryptPassword";
import { json } from "sequelize";
import { calculateAge } from "../utils/utils";
import { TokenGenerator } from "../services/tocken";
import { User } from "../models/user/User";
import { Repository } from "../database/queriesModels";
import {userResponseSerialized, userSerializedResponse,userSerializatedUpdateAdmin  } from "../models/user/userSerialization"
import { UserInterface } from "../models/user/userInterface";
import mysql, { RowDataPacket } from 'mysql2';

/*
* Class of User Dao
*
*/
class UserDao extends Repository{

    async cleanupUsers() {
        try {
            const statusVerification = {
                verificated:0
            }
            const [users]:[User[]] = await this.filterUser(statusVerification)
            for (const user of users) {
                if (user && user.id !== undefined) {
                    await this.delete(user.id);
                }
            }
            
        } catch (error) {
            console.error('Error durante la limpieza de usuarios no registrados:', error);
             throw error;
        }

        
    }

    conn:any
    tableName:string = "users"
    constructor() { 
        super();
        this.getConnection();
        }
    
        async getConnection():Promise<any> {
            try {
                const connection = await connectionDB.connect();
                this.conn = connection
            } catch (error) {
                console.error("Error during database connection:", error);
                throw error;
            }
        }


    async SetTokenVerification (email:string,token:string){
        let user = await this.findUSerByEmail(email)
      
        if(user){
           
            let idUser = user.idUser
            let dateUpdated = new Date();
            const query = "UPDATE users SET updated = ?, tockenVerification = ? WHERE idUser = ?";
            await this.conn.query(
                query,[dateUpdated,token,idUser]
            )
            return true;
        }     
    }
     /*
     * List all the Users
     * Return json of users or error
     */
     async  listAllUsers() {      
 
        try {
            
            const [userList] = await this.conn.query( `Select * from Users`);
            let response ={users:userList,responseStatus:"Ok"}
            console.log(response)
            return response;
        } catch (error) {
            let response = {"error":error,"message":"Error listing the users"}
             return response;
        }
    }
    /*
    *List the users paginated
    *Return the list of uses paginated
    */
    async listPaginates(numberPage:number=1){
        
        
        const totalUsersResult = await this.conn.query(`SELECT count(*) AS total FROM Users`);
        console.log(totalUsersResult)
        const totalUsers = totalUsersResult[0][0].total;
        const actualPage = numberPage;
        const limit = 10;
        //Init of element
        const offset = (actualPage - 1 ) * limit;
        const totalPages = Math.ceil(totalUsers / limit);

        if(actualPage > totalPages) {
            return {status:"error","message":"No more Users to list in database"}
        }

    try {
        const [users] = await this.conn.query(`SELECT * FROM Users LIMIT ? OFFSET ?`, [limit, offset]);
        const usersSerializated: userResponseSerialized[] = [];
        users.forEach((user: UserInterface) => {
            const dateVerification= user.dateVerification?.toLocaleString().split(",")[0]
            user.dateVerification = dateVerification
            let UserSerialized:userResponseSerialized = userSerializedResponse(user);
            usersSerializated.push(UserSerialized);
            console.log(UserSerialized)
        });
        
         let response = {
            status:"success",
            users:usersSerializated,
            totalPages:totalPages,
            actualPage:actualPage
            };
         return response;
    } catch (error:any) {
        console.log(error)
        throw new Error
        let response = {status:"error",msg:"error"}

  }
}
 /*
 * Find user by id
 * param: id :number
 * Return json of user
 */
  async findUserById(id:number){
   
  
    try {
        await this.getConnection()
        const connection = await this.conn
        const [user]= await connection.query(`Select * FROM users Where id = ?`,[id])
        console.log("Usurior ACASDC",user)
        const userSerializated = userSerializatedUpdateAdmin(user[0]);
        console.log("Usuario Serializado",userSerializated)
        return userSerializated|| undefined;
    } catch (error) {
        console.log(error)
        console.log("ENTRO EN EEL ERROR")
        let response = {status:"error",message:"Error finding User"}
    }
  }


  async findUSerByEmail(email:string){
    try {
        await this.getConnection()
        const connection = await this.conn
        console.log("SOU LA CONE",connection)
        const [user] =await connection.query(`Select * FROM users Where email = ? `,[email])
        console.log("usuario",user[0])
        if (user[0].length !== 0) {
            return user[0]
        }else{
            return false
        }
    } catch (error:any) {
        
        console.log(error)
        throw new Error(error)
    }
  }
/*
* List the user filtered by various
* param: filters : object
* Return json users found compose by array of object users
*/
 async  filterUser(filters:object)
 
 {
   
    let queryString = `SELECT * FROM Users WHERE `;
    //Create array for storage filters param
    const param:any[] = [];
    //Create array witch the objects of entries
    const entries = Object.entries(filters);
    //Create the query with the params getting
    entries.forEach((filter, index) => {
        const [key, value] = filter;
        queryString += `${key} = ? `;
        param.push(value)
        if (index < entries.length - 1) {
            queryString += 'AND ';
        } else {
            // If the is the last element en Object
            queryString += ';'; 
        }
    });
    // Get the users includes with the filters 
    try {
        await this.getConnection()
        const connection = await this.conn
        const user = await connection.query(queryString, param);
        console.log("Usuario")
        if (user.length  === 0){
            console.log("False")
            return false;
        }
        return user;
    } catch (error:unknown) {
        console.error("érror finding users:", error);
        const fault = {error:"Error finding the user",message:error}
        return fault // O devuelve un objeto con el mensaje de error
    }
 }
 async login (passedEmail:string, passedPassword:string){
    //Get the email and password from the request
    const email = passedEmail;
    const password = passedPassword;
    //check if the user exist
    const user = await this.findUSerByEmail(email);
    console.log(user.verificated)
    if(user.verificated === "false"){
        let response = {
            status:"errorVerification",
            message:"User not verificated"
        }
        return response;
    }
     //Check if the user exist
    if(user){
        //Check the password
        const isPasswordCorrect = await EncryptPassword.checkPassword(password, user.password);
        //Check if the password is correct
        if(isPasswordCorrect){
            // --Tocken --//
            // Data for payload
            const payload = {
                "id": user.id,
                "name":user.name,
                "rol":user.rol,
                "verificated": user.verificated,
                "status":user.status
            }
            //Create a tockenService class
            const tockenService = new  TokenGenerator();
            // Create a Token
            const tocken = tockenService.setToken(payload);
            let response = {
                status:"success",
                token : tocken}
            //Return response
            return response;
        }else{
            let response = {status:"error",message:"Password incorrect"}
            return response;
        }
    }else{
        let response = {
            status:"error",
            message:"User don´t exist"
        }
        return response;
    }
 }
 async setVerificationUser(idUser:number){
    try {
       
        const dateUpdate = new Date()
        const verification = true;
        const query = "UPDATE users SET verificated = ?,dateVerification = ? WHERE id = ?";
        await this.conn.query(query,[verification,dateUpdate,idUser])
    } catch (error:any) {
        throw new Error(error.message)
    }
}

/*
* Get the user with its payment
* @param{idUser} string
* Return Array of Object or Trow error
*/
async getPaymentsUSer(idUser:string){
    try{
        
        // Query
        const query ="SELECT * FROM users join payments on users.idUser = payments.idUser WHERE users.idUser = ? "
        //Do the query
        const [user] = await this.conn.query(query,[idUser])
        // return the user in Array-Object
        return user;
    }catch(error:any){
        console.log(error)
        throw new Error("error")
    }
}

    /*
    * Get connection element of database
    * Return connection : Promise
    */
    //getConnection(){
      //  const connection = connectionDB.connect();
        //return connection;
    //}

 
  
    
}

export{UserDao}

