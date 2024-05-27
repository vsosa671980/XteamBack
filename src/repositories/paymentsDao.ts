
import { Repository } from "../database/queriesModels";



export class PaymentsDao extends Repository{

   tableName:string = "payments"
   constructor(){
       super();
   }

   async showPaymentsUser(idUser:string){

    try{

        const query = `SELECT users.name,users.surname,payments.type,payments.date,subscription.title FROM users
        JOIN payments ON users.idUser = payments.idUser
        JOIN subscription ON  payments.idPay = subscription.id
         WHERE users.idUser = ?
         order By payments.date DESC;`

         const [userPayments] = await this.conn.query(query,idUser)
       
         return userPayments;

    }catch{

    }
   }

}

