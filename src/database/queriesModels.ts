import { query } from "express";
import { connectionDB } from "./connection";
export class Repository{


    tableName: string = "Repository";
    protected  conn:any = ""
    constructor() { 
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

    async create (data:object) {
        //const data = this;
        console.log("Objeto",data)
        try {
        
            const className = this.tableName;
            const keys = Object.keys(data);
            const values = Object.values(data);
            let query = `INSERT INTO ${className} (`;
            keys.forEach((key, index) => {
                query += `${key}`;
                if (index < keys.length - 1) {
                    query += ", ";
                }
            });
            query += ") VALUES (";
    
                values.forEach((value, index) => {
                    query += `?`;
                    if (index < keys.length - 1) {
                        query += ", ";
                    }
                });
    
                query += ")";
            const conn =await  connectionDB.connect();
            if(conn){
                console.log(query)
                console.log(values)
                await conn.query(query,values);
                return true;
            }
        } catch (error:any) {
            console.log("error",error.message)
            console.log("Error creating user in QueriModels")
            throw new Error(error.message)
        }
       
    }
    async findById(id:number){
        try {
            const className = this.tableName
            let query = `SELECT * FROM ${className} WHERE id =?`;
            const conn =await  connectionDB.connect();
            if(conn){
               const [subscription]:any =  await conn.query(query,[id]);
               if(subscription === 0){
                   return false;
               }
               return subscription[0]|| undefined;
            }
        } catch (error:any) {
            throw new Error( error.message)
        }
    }

    async delete(id: number) {
        try {
            const query = `DELETE FROM users WHERE id = ?`;   
            const conn = await connectionDB.connect();
            if(!conn){
                await connectionDB.connect()
            }
            
            if (conn) {
                await conn.query(query, [id]);
                await conn.end(); // Ejecutar la consulta de eliminación directamente
                return true; // Indicar que la eliminación fue exitosa
            } else {
                return false; // Indicar que no se pudo conectar a la base de datos
            }
        } catch (error:any) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    async update(id:number,dataObject:object){
        console.log(id)
       
        try{

            const conn =await  connectionDB.connect();
            const data = dataObject;
            const className = this.tableName;
            const keys = Object.keys(data);
            const values = Object.values(data);
            let query = `UPDATE ${className} SET `;
            keys.forEach((key, index) => {
            query += `${key} = ?`;
            if (index < keys.length - 1) {
                query += ", ";
            }
        });
           query += ` WHERE id = ?`;
         console.log("Valores",values)
        // Imprimir la consulta SQL generada
        console.log("Consulta SQL generada:", query);
            //const conn = connectionDB.connection();
            console.log(dataObject)
            //add the id to the values to make the query
            values.push(id);
            if(this.conn){
               await this.conn.query(query,values);
               return true;
            }

        }catch(error:any){
            console.log(query);
            throw new Error(error.message)
        }
        
    }



}

