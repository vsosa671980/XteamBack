import { query } from "express";
import { connectionDB } from "./connection";
export class Repository{


    tableName: string = "Repository";
    protected conn:any = connectionDB.connection();

    constructor() { 
       
    }

    getConnection (){
        const connection = connectionDB.connect();
        return connection;
    }

    async create (data:object) {
        //const data = this;
        console.log(data)
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
            
            const conn  = connectionDB.connection();
            if(conn){
                console.log(query)
                console.log(values)
                await conn.query(query,values);
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
            const conn = connectionDB.connection();
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

    async delete(id:number){

        try {
            const className = this.tableName;
            let query = `DELETE FROM users WHERE id =?`;   
            const conn = connectionDB.connection();
            if(conn){
                const object = await this.findById(id)
                console.log("Objeto ",object);
                if(object){
                    await conn.query(query,id);
                    return object;
                }else{
                    return false;
                }
            }
        } catch (error:any) {
            console.log(error);
            throw new Error(error.message)
        }
       
        
        }

    async update(id:number,dataObject:object){
        console.log(id)
       
        try{

            const conn = connectionDB.connection();
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
        console.log(values)
        console.log(id)
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

