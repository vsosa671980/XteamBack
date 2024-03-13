import { UserInterface } from "../interfaces/UserInterface";
import { connectionDB } from "../database/connection";
import { EncryptPassword } from "../utils/encryptPassword";
import { json } from "sequelize";
import { calculateAge } from "../utils/utils";



/*
* Class of User Dao
*
*/
class UserDao implements UserInterface{

    conn:any
    constructor(){
       this.getConnection().then(connectionDB => {
           this.conn = connectionDB
        })
    }
    
    async createUser(
        name: string,
        surname: string,
        age: string,
        email: string,
        phone: string,
        img: string,
        rol:string,
        status:string,
        password:string){
          
            try {

                //Create object witch the email received
                let user = await this.findUSerByEmail(email)
            //Check if the user Exist
            //If exist update the user
                if(user){
                    let id = user.idUser
                    let dateUpdated = new Date();
                    await this.conn.query(`
                   UPDATE users 
                   SET 
                   name = ?,
                  surname = ?,
                  age = ?, 
                  email = ?,
                  phone = ?,
                  img = ?,
                  updated = ?
                  WHERE 
                  idUser = ?
              `, [name, surname, age, email, phone, img, dateUpdated, id]);
                    
                }else{
                    //Create a new user and save to the database
                    const created= new Date();
                    //Password
                    const passwordEncryptedUSer = await EncryptPassword.encrypt(password);
                    //Set Rol
                    //const passwordEncryptedUSer = password 
                    const edad = calculateAge(age);

                    if(rol == ""){
                        rol = "user"
                    }

                    status = "active";

                    await this.conn.query(
                        "INSERT INTO Users (name, surname, age, email, phone,status,rol,password,img,created) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?);",
                        [name, surname, edad, email, phone,status,rol,passwordEncryptedUSer,img,created]
                    );
                    
                }             
            } catch (error) {
                console.log(error)
                throw new Error("Error updating  or creating the user");
                
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
    async listUsersPaginates(numberPage:number){

        const totalUsersResult = await this.conn.query(`SELECT count(*) AS total FROM Users`);
        const totalUsers = totalUsersResult[0][0].total;
        const actualPage = numberPage;
        const limit = 10;
        const offest = (actualPage - 1 ) * limit;
        const totalPages = Math.ceil(totalUsers / limit);

        if(actualPage > totalPages) {
            return {status:"error","message":"No more Users to list in database"}
        }

    try {
        const [rowUsers] =await this.conn.query(`SELECT * FROM Users LIMIT ? OFFSET ?`,[limit,offest]);
         let response = {status:"ok",users:rowUsers,};
         return response;
    } catch (error) {
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
        const [user] = await this.conn.query(`Select * FROM users Where idUser = ?`,[id])
        let response = {user:user};
        return response;
    } catch (error) {
        let response = {status:"error",message:"Error finding User"}
    }
  }

  async findUSerByEmail(email:string){
    try {
        const [user] = await this.conn.query(`Select * FROM users Where email = ? `,[email])
        if (user.length !== 0) {
            return user[0]
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        
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
        const [user] = await this.conn.query(queryString, param);
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

    //Recive the email and password from the request
    const email = passedEmail;
    const password = passedPassword;
    //check if the user exist
    const user = await this.findUSerByEmail(email);
    console.log(user)
     //Check if the user exist
    if(user){
        
        const isPasswordCorrect = await EncryptPassword.checkPassword(password, user.password);
        //Check if the password is correct
        if(isPasswordCorrect){
            let response = {status:"ok",user:user}
            return response;
        }else{
            let response = {status:"error",message:"Password incorrect"}
            return response;
        }
    }else{
        return false;
    }
  
 }
    /*
    * Get connection element of database
    * Return connection : Promise
    */
    getConnection(){
        const connection = connectionDB.connect();
        return connection;
    }
    
}

export{UserDao}