import { calculateAge } from "../../utils/utils";

class User{

    idUSer:number;
    name:string;
    surname:string;
    age:number;
    email:string;
    rol:string;
    phone:string;
    status:string;
    img:string;

    constructor(name:string,surname:string,age:number,email:string,rol:string,phone:string,status:string)
    {
       this.name = name;
       this.surname = surname;
       this.age = age;
       this.email = email;
       this.rol = rol;
       this.phone = phone;
       this.status = status;
    }
    /*
    * Set the date of user
    * param birthday
    *
    */
    public setAge(birthDate:string){
        this.age = calculateAge(birthDate);
    }

}

export {User}