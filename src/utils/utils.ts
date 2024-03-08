


/**
 * Calculate the age of users
 * 
 */

function calculateAge(date:string):number{

    try {
    //Get the actual age
    const actualAge = new Date().getFullYear();
    //Get the date of user
    const birthDateUser = new Date(date).getFullYear();
    //Calculate the age of user
    const ageUser = actualAge - birthDateUser;
    return ageUser;
        
    } catch (error) {
        console.log(error)
        return -1;
        
    }
   
};

export {calculateAge}