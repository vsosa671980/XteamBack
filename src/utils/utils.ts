

type Week = {
    [key: string]: string;
  };
/**
 * Calculate the week depending of the day passed
 * @param today : Date
 * @returns : array 
 */
function calculateWeek(today:Date) {

    let dayOfweek = today.getDay();
    let firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOfweek + 1);
    let lastDayOfWeek = new Date()
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    let totalDays = 7;
    var week:Week= {};
    var dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

    for (let i = 0; i < totalDays; i++) {
        let day = new Date(firstDayOfWeek);
        day.setDate(firstDayOfWeek.getDate() + i);
        let NameOfDay = dayNames[day.getDay()];
        let dayOfWeek = day.toISOString().split("T")[0];
        week[NameOfDay.toString()] = dayOfWeek;
    }
   // Return the week 
    return {week, firstDayOfWeek,lastDayOfWeek}
}

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

export {calculateAge,calculateWeek}