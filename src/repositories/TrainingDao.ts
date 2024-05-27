import { connectionDB } from "../database/connection";
import { calculateAge, calculateWeek } from "../utils/utils";

import { Repository } from "../database/queriesModels";
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
 * Find training by id
 * @param id training
 */
async findByid(id: string){
    try {
        const [training] = await this.conn.query(`SELECT * FROM Trainings WHERE idTraining = ?;`,[id])
        if (training.length === 0){
            return false
        }
        return training[0]
    } catch (error) {
        throw new Error(`Error finding training by id: ${error}`);
    }
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
            let week = weekData.week;
            let firstDay = weekData.firstDayOfWeek;
            let dateEnd = weekData.lastDayOfWeek;
            console.log(firstDay)
            console.log(dateEnd)

            const [training] = await this.conn.query(`SELECT * FROM Trainings WHERE date >= ? AND date <= ?`,[firstDay,dateEnd]);
         
           // if (training.length  === 0){
             //   return false;
            //}
            // Change date to format date
            training.map((training: any) => {
                training.date = new Date(training.date).toISOString().split("T")[0];
                console.log(training.date)
               

            })
        
            return {
                training: training,
                week: week
            };
        } catch (error) {
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
async listUsersTraining(idTraining:string){
    try {
        const [users] = await this.conn.query(
            `SELECT u.*
            FROM trainings t
            JOIN trainingUser tu ON t.idTraining = tu.idTraining
            JOIN users u ON tu.idUser = u.idUser
            WHERE t.idTraining = ?;`,[idTraining]
    )} catch (error) {
        throw new Error(`Error listing all training: ${error}`);
        
    }

}

    async getConnection(){
        const connection = connectionDB.connect();
        return connection;
    }
}





export { TrainingDao };
