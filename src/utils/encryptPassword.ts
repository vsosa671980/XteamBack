import bcrypt from 'bcryptjs';

class EncryptPassword {

    /*
    *Encrypt the password
    *
    */
    public static encrypt(password:string){
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,function(err,hash){
               if(err){
                console.log(err);
                return
               }
               console.log("Encrypted")
            })
        })
    }
    
    /*
    *Check the password
    *
    */
    public static async checkPassword(userInputPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            const result = await bcrypt.compare(userInputPassword, hashedPassword);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
export{EncryptPassword};