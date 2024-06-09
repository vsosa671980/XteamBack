import { EncryptPassword } from "../../utils/encryptPassword";
import { calculateAge } from "../../utils/utils";

export class User{

    id?:number;
    name:string;
    surname:string;
    secondSurname:string;
    age:number;
    email:string;
    rol:string | null;
    phone:string;
    status:string | null;
    img:string | null;
    password:string = "";
    verificated:boolean = false;
   

    constructor(name:string,surname:string,secondSurname:string,age:number,email:string,phone:string,img:string,password:string)
    {
       this.name = name;
       this.surname = surname;
       this.secondSurname = secondSurname;
       this.age = age;
       this.email = email;
       this.rol = "user";
       this.phone = phone;
       this.status = "inactive"
       this.img = "Por defecto"
       this.password = password;
       this.age = age
    }


    /*
    * Set the date of user
    * param birthday
    *
    */
    public setAge(){
        const birthDate = String(this.age)
        this.age = calculateAge(birthDate);
    }

  
}
