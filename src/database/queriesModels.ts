import { query } from "express";
import { connectionDB } from "./connection";
import { QueryResult } from "mysql2";
import { User } from "../models/user/User";
export class Repository{


    tableName: string = "Repository";

    constructor() {
        
    }


    getConnection (){
        const connection = connectionDB.connect();
        return connection;
    }
    async create (data:object) {
        //const data = this;
        console.log(data)
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
            await conn.query(query,values);
        }
    }
    async findById(id:number){
       
        try {
            const className = this.tableName
            let query = `SELECT * FROM ${className} WHERE id =?`;
            const conn = connectionDB.connection();
            if(conn){
               const [subscription]:any =  await conn.query(query,[id]);
               return subscription[0]|| undefined;
            }
        } catch (error:any) {
            console.log(error);
            throw new Error( error.message)
        }
    }

    async delete(id:number){
        const className = this.tableName;
        let query = `DELETE FROM ${className} WHERE id =?`;
        
        const conn = connectionDB.connection();
        if(conn){
            await conn.query(query,id);
        }
    }

    async update(id:number,dataObject:object){


        try{
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

        // Imprimir la consulta SQL generada
        console.log("Consulta SQL generada:", query);
            const conn = connectionDB.connection();
            if(conn){
               await conn.query(query,[values,id]);
               const subscription = await this.findById(id);
               return subscription;
            }

        }catch(error:any){
            console.log(query);
            throw new Error(error.message)

        }
        
    }
}

