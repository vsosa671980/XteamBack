

export class Payment {

    type:string;
    date:Date;
    amount:number;
    subscriptionId:number | null;
    idUser:string;
    

    constructor(type:string,amount:number,idUser:string,date:Date){
      
        this.type = type;
        this.date = date
        this.amount = amount;
        this.idUser = idUser;
        this.subscriptionId = null;
    }
}