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
    public static checkPassword(userInputPassword:string,hashedPassword:string){
        bcrypt.compare(userInputPassword, hashedPassword, function(err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result) {
                console.log('Contraseña correcta');
            } else {
                console.log('Contraseña incorrecta');
            }
        });

    }
}

export{EncryptPassword};