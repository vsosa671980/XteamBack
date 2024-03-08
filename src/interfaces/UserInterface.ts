
interface UserInterface{

    createUser(name:string,surname:string,age:number,email:string,phone:string
        ,img:string,rol:string,status:string,password:string);
    listAllUsers();
}


export {UserInterface}