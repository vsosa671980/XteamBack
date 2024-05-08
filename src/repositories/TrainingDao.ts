import { connectionDB } from "../database/connection";

/*
* Clase Training Dao
*
*/
class TrainingDao {
    
    conn:any

    constructor(){
       this.getConnection().then(connectionDB => {
           this.conn = connectionDB
        })
    }
    
    async createTraining(
        type: string,
        date: string,
        location: string,
        description: string,
        image: string
    ){
        try {
            await this.conn.query(`
                INSERT INTO Trainings (type, date, location, description, img)
                VALUES (?, ?, ?, ?, ?);
            `, [type, date, location, description, image]);
        } catch (error) {
            console.log(error);
            throw new Error("Error creating the training");
        }
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
  * @param location :string
  * @param img:string
  */
 async updateTraining(id: string, type: string, date: string, location: string, description: string, image: string){
    try {
        await this.conn.query(`
            UPDATE Trainings
            SET type =?, date =?, location =?, description =?, img =?
            WHERE idTraining =?;
        `, [type, date, location, description, image, id]);
    } catch (error) {
        throw new Error(`Error updating the training: ${error}`);
    }
}

/**
 * Returns list of trainings * 
 * @returns {Array} training or Error
 */
    async listAllTrainings() {      
        try {
            const [trainingList] = await this.conn.query( `SELECT * FROM Trainings`);
            return trainingList
        } catch (error) {
            throw new Error(`Error listing all training: ${error}`); 
        }
    }

    async listTrainingsPaginated(numberPage:number){
        const limit = 10;
        const offest = (numberPage - 1 ) * limit;

        try {
            const [rowTrainings] = await this.conn.query(
                `SELECT * FROM Training LIMIT ? OFFSET ?`,
                [limit, offest]
            );
            return { status: "ok", trainings: rowTrainings };
        } catch (error) {
            return { status: "error", message: "Error listing the trainings" };
        }
    }


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
     * Delete a trained
     * @param id Training
     */
    async deleTraining(id:string){
        try {
            await this.conn.query(`DELETE FROM Trainings WHERE idTraining = ?`,[id]);
        } catch (error) {
            throw new Error(`Error deleting the training: ${error}`);
        }

    }

    /**
     * Find training between dates
     * @param date Training date
     */

    async getBydates(dateInit:string,dateEnd:string){
        try {
            const [training] = await this.conn.query(`SELECT * FROM Trainings WHERE date BETWEEN ? AND ?`,[dateInit,dateEnd]);
            if (training.length  === 0){
                return false;
            }
            return training;
        } catch (error) {
            return { status: "error", message: "Error finding the training" };
        }
    }

    async getConnection(){
        const connection = connectionDB.connect();
        return connection;
    }
}

export { TrainingDao };
