import mysql from 'mysql2/promise';


/*
* Connection to database 
*
*/
class connectionDB{
    /*
    * Set the connection with the database
    * return: object connection
    */
    static conn:any;

    constructor(){}
    
    public static async connect(){
       try{
        const connection = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password:"123456",
            database: 'xteam',
       })
       console.log("connected with mysql")
       return connection;
    }catch(error){
        console.log(error);
    }
}

 public static connection(){
    try{
     const connection =  mysql.createPool({
         host: 'localhost',
         user: 'root',
         password:"123456",
         database: 'xteam',
    })
    console.log("connected with mysql")
    return connection;
 }catch(error){
     console.log(error);
   }
 }

 public static getConnection(){
    if(!!connectionDB.conn){
        connectionDB.conn = connectionDB.connection();
    }
    return connectionDB.conn;
 }

}

export {connectionDB}