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
            //const conn = connectionDB.connection();
            if(this.conn){
               await this.conn.query(query,[values,id]);
               const subscription = await this.findById(id);
               return subscription;
            }

        }catch(error:any){
            console.log(query);
            throw new Error(error.message)

        }
        
    }

    async listPaginates(numberPage:number){
         // count the number of elements
        const totalResult = await this.conn.query(`SELECT count(*) AS total FROM ${this.tableName}`);
        console.log(totalResult)
        const totalUsers = totalResult[0][0].total;
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

}

