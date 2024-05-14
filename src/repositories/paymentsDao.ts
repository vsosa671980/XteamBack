import {connectionDB} from "../database/connection"

 export class PaymentsDao{

    conn:any
    constructor(){
       this.getConnection().then(connectionDB => {
           this.conn = connectionDB
        })
    }


    /*
    * Create a new Payment
    * @param{idUser}:string
    * @param{type}:string
    *
    */
    async createPayment(IdUser:string,type:string){
        try {
            const query = `INSERT INTO payments (date,IdUser,type) VALUES (?,?,?)`
            const date = new Date()
            await this.conn.query(query,[date,IdUser,type])
        } catch (error:any) {
            throw new Error(error.message)
        }
    }



    getConnection(){
        const connection = connectionDB.connect();
        return connection;
    }
}