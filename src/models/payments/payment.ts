

export class Payment {

    type:string;
    date:Date;
    amount:number;
    subscriptionId:number;
    idUser:number;
    

    constructor(type:string,amount:number,subscriptionId:number,idUser:number){
        this.date = new Date();
        this.type = type;
        this.amount = amount;
        this.subscriptionId = subscriptionId;
        this.idUser = idUser;
    }
}