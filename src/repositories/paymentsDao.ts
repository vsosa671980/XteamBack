
import { Repository } from "../database/queriesModels";

interface Payment {
    date: Date | string
    type: string;
    subscriptionId: number;
    amount: number;
    idUser: number;
  
}

export class PaymentsDao extends Repository{

  

   tableName:string = "payments"
   constructor(){
       super();
   }

   async showPaymentsUser(idUser:string){

    try{

        const query = `Select users.name,payments.type,payments.date,subscription.title from users
JOIN payments ON users.id = payments.idUser
JOIN subscription ON subscriptionId = payments.subscriptionId
Where users.id=? order By payments.date DESC;`

         const [userPayments]:[Payment[]] = await this.conn.query(query,idUser)
         if (userPayments.length === 0){
            return false
         }
         userPayments.map(payment => {
            console.log(payment.date)
            if(payment.date instanceof Date){
                const dateNew =payment.date.toISOString().split("T")[0]
                payment.date = dateNew
            }
         })
         console.log("pagos",userPayments)
         return userPayments;

    }catch(error:any){
        console.log("error")
        throw new Error(error)

    }
   }

}

