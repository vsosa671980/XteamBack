
import { Repository } from "../../database/queriesModels";



export class SubscriptionDao extends Repository{

   tableName:string = "subscription"
   constructor(){
       super();
       
   }
}

