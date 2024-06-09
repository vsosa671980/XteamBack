
import { UserInterface } from "./userInterface";


export interface userResponseSerialized {
        id:number,
        name:string
        surname:string,
        secondSurname: string,
        email:string,
        phone:string,
        status:string,
        age:number,
        verificated:string,
        dateVerification:string,
        idSubcription: number | null,
    }

export const userSerializedResponse = (object:UserInterface) => {
    const UserSerialized:userResponseSerialized = {
        id:object.id,
        name:object.name,
        surname:object.surname,
        secondSurname: object.secondSurname,
        email:object.email,
        phone:object.phone,
        status:object.status,
        age:object.age,
        verificated:object.verificated,
        dateVerification:object.dateVerification,
        idSubcription: object.idSubcription,
    }

    return UserSerialized;

}

export const userSerializatedUpdateAdmin = ((object:any) => {
    const UserSerialized = {
        id:object.id,
        name:object.name,
        surname:object.surname,
        secondSurname: object.secondSurname,
        email:object.email,
        phone:object.phone,
        status:object.status,
        age:object.age,
    }

    return UserSerialized;

})