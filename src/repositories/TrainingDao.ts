import { connectionDB } from "../database/connection";
import { calculateAge, calculateWeek } from "../utils/utils";
import { Repository } from "../database/queriesModels";
import  {Training} from "../models/train/Training";
/*
* Clase Training Dao
*
*/
class TrainingDao extends Repository {
    
    conn:any
    tableName:string = "trainings"
    constructor(){
        super();
    }
 

 /**
  * Update the training
  * @param id:string
  * @param type:string:
  * @param date:string format 000-00-00
  * @param location :strin
  * @param img:stringg
  */
    async filterTrainings(filters:object) {
        let queryString = `SELECT * FROM Training WHERE `;
        const param:any[] = [];
        const entries = Object.entries(filters);
        
        entries.forEach((filter, index) => {
            const [key, value] = filter;
            queryString += `${key} = ? `;
            param.push(value)
            if (index < entries.length - 1) {
                queryString += 'AND ';
            } else {
                queryString += ';'; 
            }
        });

        try {
            const [training] = await this.conn.query(queryString, param);
            if (training.length  === 0){
                return false;
            }
            return training;
        } catch (error) {
            console.error("Error finding trainings:", error);
            return { error: "Error finding the training", message: error };
        }
    }

    /**
     * Find training between dates
     * @param date : string
     * @ return object with training and week object
     */

    async getBydates(dateInit:string){

        try {
            //Create a new Date Object, current Date
            let today  = new Date();
            //Check i date is received in the parameter
            if (dateInit){
                today = new Date(dateInit);
            }
            //Get the week ,first day of the week and last day of the week
            const weekData = calculateWeek(today);
            console.log(today)
            let week = weekData.week;
            console.log("Semanaasdfasdfasfsdafsadfsdf",week)
            let firstDay = weekData.firstDayOfWeek;
            let dateEnd = weekData.lastDayOfWeek;
            const [training] = await this.conn.query(`SELECT * FROM Trainings WHERE date >= ? AND date <= ?`,[firstDay,dateEnd]);
      
            training.map( (training: any) => {
                training.date = new Date(training.date).toISOString().split("T")[0];              
            })

            const getTrainings = (async  () => {
                const trainingPromises = training.map(async (training: any) => {
                    const result = await this.listUsersTraining(training.id)
                    console.log("Resultado",result.length)
                    if(result.length !== 0 ){
                        training["status"] = "ordered"
                    }else{
                        training["status"] = "free"
                    }
                })
                await Promise.all(trainingPromises);
            })
            await getTrainings();
           
            return {
                training: training,
                week: week
            };
        } catch (error) {
            console.log(error)
            return { status: "error", message: "Error finding the training" };
        }
    }

 /**
* Crete realtion between training and users
* @param idTraining Training
* @param idUser User
*/
async createTrainingUser(idUser:string,idTraining:string){
    try {
        await this.conn.query(`
            INSERT INTO TrainingUser (idUser, idTraining)
            VALUES (?, ?);
        `, [idUser, idTraining]);
    } catch (error) {
        throw new Error("Error creating the training");
    }
}

/**
 * Insert user in training
 * @param idTraining :string
 * @param idUser :string
 * @returns : void or error
 */

async insertUserTraining(idUser:string,idTraining:string):Promise<void> {
    try {
        await this.conn.query(`
            INSERT INTO TrainingUser (idUser, idTraining)
            VALUES (?, ?);
        `, [idUser, idTraining]);
    } catch (error) {
        console.log(error)
        throw new Error("Error creating the training");
    }
}

/**
 * List all trainings of user
 * @param idUser :string
 * @returns : void or error
 */
async listTrainingUsers(idUser:string){
    try {
        const [training] = await this.conn.query(`SELECT t.*
        FROM users u
        JOIN trainingUser tu ON u.idUser = tu.idUser
        JOIN trainings t ON tu.idTraining = t.idTraining
        WHERE u.idUser = ?;`,[idUser]);
        if (training.length  === 0){
            return false;
        }
        return training;
    } catch (error) {
        throw new Error(`Error listing all training: ${error}`); 
    }
}

/**
 * List all users of training
 * @param idTraining :string
 * @returns : void or error
 */
async listUserTraining(idTraining:string){

    console.log(idTraining)

    try {
        const [users] = await this.conn.query(
            `SELECT u.*
            FROM users u
            JOIN trainingUser tu ON u.id = trainingUser.idUser
            JOIN users u ON tu.idUser = u.idUser
            WHERE t.id = ?;`,[idTraining])

            console.log(users)
    } catch (error) {
        console.log(error)
        throw new Error(`Error listing all training: ${error}`);
        
    }

}

async listUsersTraining(idTraining:string){

    console.log(idTraining)

    try {
        const [users] = await this.conn.query(
            `SELECT u.name,u.surname,u.age
            FROM users u
            JOIN trainingUser ON u.id = trainingUser.idUser
            JOIN trainings t ON t.id = trainingUser
            .idTraining
            WHERE t.id = ?;`,[idTraining])

            return users;

    } catch (error) {
        console.log(error)
        throw new Error(`Error listing all training: ${error}`);
        
    }

}

   // async getConnection(){
     //   const connection = connectionDB.connect();
       // return connection;
    //}
    

    async listPaginates(numberPage:number){
        // count the number of elements
       const totalResult = await this.conn.query(`SELECT count(*) AS total FROM ${this.tableName}`);
       const totalUsers = totalResult[0][0].total;
       const actualPage = numberPage;
       const limit = 5;
       const offest = (actualPage - 1 ) * limit;
       const totalPages = Math.ceil(totalUsers / limit);
       if(actualPage > totalPages) {
           return {status:"error","message":"No more Users to list in database"}
       }
   try {
       const [trainings] =await this.conn.query(`SELECT * FROM trainings  LIMIT ? OFFSET ?`,[limit,offest]);
       trainings.map((train:any)=> {
          train.date = train.date.toLocaleDateString();
       })
        let response =  {
            trainings:trainings,
            totalPages:totalPages,
            actualPage:actualPage
        }
        
        return response;
   } catch (error) {
       let response = {status:"error",msg:"error"}
 }
}

async deleteUserFromTraining(idTraining:string,idUser:string){

    try {
        const [users] = await this.conn.query(
            `DELETE FROM trainingUSer WHERE idUser = ? AND idTraining = ?`,[idUser,idTraining])
            if (users.affectedRows > 0) {
                return true
            } else {
                return false
            }
    } catch (error) {
        console.log(error)
        throw new Error(`Error listing all training: ${error}`);
        
    }

}


}





export { TrainingDao };
