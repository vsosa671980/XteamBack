import mysql from 'mysql2/promise';

export class connectionDB {
  
    static conn:any;

    constructor() {}

    public static async connect() {
        try {
                //connectionDB.conn = await mysql.createPool({
                const connection =  mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    password: '123456',
                    database: 'xteam',
                });
                console.log("Connected to MySQL");
                return connection;
            
          
        } catch (error) {
            console.error("Error connecting to MySQL:", error);
            throw error; // 
        }
    }

     public static getConnection(){
        if(!!connectionDB.conn){
            connectionDB.conn = connectionDB.connect();
       }
       return connectionDB.conn;
    }
}
