
import { Repository } from "../../database/queriesModels";



export class PaymentsDao extends Repository{

   tableName:string = "payments"
   constructor(){
       super();
       
   }

}

