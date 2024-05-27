


export class Training {

   
    type: string;
    date: string
    location: string;
    description:string
    img:string 
    
    constructor(type:string,date:string,
        location:string,description:string,img:string = ""
    ){
       
        this.type=type
        this.date=date
        this.location=location
        this.description =description
        this.img = img

    }

}

export default {Training}