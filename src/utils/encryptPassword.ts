import bcrypt from 'bcryptjs';

class EncryptPassword {

    /*
    *Encrypt the password
    *
    */
    public static async encrypt(password:string){
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            console.log("Encrypted:", hash);
            return hash;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    
    /*
    *Check the password
    *
    */
    public static async checkPassword(userInputPassword: string, hashedPassword: string): Promise<boolean> {
        console.log(userInputPassword);
        console.log(hashedPassword);
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