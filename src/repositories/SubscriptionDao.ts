
import { Repository } from "../database/queriesModels";



export class SubscriptionDao extends Repository{

   tableName:string = "subscription"
   constructor(){
       super()
       
   }


   async findUserSubscriptions(idUser:number,status:string){
    try{
        const query = `
        SELECT subscription.title,subscription.price,UsersSubscriptions.dateFinish,payments.date,UsersSubscriptions.status
        FROM users 
        JOIN UsersSubscriptions ON users.idUser = UsersSubscriptions.idUser
        JOIN subscription ON UsersSubscriptions.idSubscription = subscription.id
        JOIN payments ON subscription.id = payments.idPay
         WHERE users.idUser = ? AND UsersSubscriptions.status = ?;`
       
        const [subs] = await this.conn.query(query,[idUser,status])
        return subs
    }catch(error:any){
        console.log(error)
        throw new Error(error.message)

    }
   }
}



