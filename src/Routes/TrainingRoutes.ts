import { Router, response, } from "express";
import { TrainingDao } from "../repositories/TrainingDao";
import { registerTrainingValidationRules } from "../helpers/ValidatorTraining";
import { validationResult } from 'express-validator';
import {Training} from "../models/train/Training"

//Create the Router Object
const TrainingRouter = Router();
//Create the Dao Training Object
const dao = new TrainingDao();



/**
 * Create the training
 */
TrainingRouter.post("/listPaginates", async (req, res) => {

    const {numberPage} = req.body
    try {
        const training = await dao.listPaginates(numberPage);
        let response = {
            status:"success",
            message:"Training list",
            training:training
        }
        res.status(200).json(response);
    } catch (error) {
        let response = {
            status:"error",
            message:"Error listing the trainings",
            error:error
        }
        res.status(500).json(response);
    }

})

/**
 * Create the traiing and save in database
 *
 */
TrainingRouter.post("/create",registerTrainingValidationRules(), async (req:any, res:any) => {
    try {
        // valida el cuerpo de la solicitud
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
        const {type,date,location,
            description,
            img} = req.body;
        const training = new Training(type,date,location,description,img)
            await  dao.create(training)
            return res.json({
                status:"success",
                message:"Payment created successfully"
            })
    } catch (error:any) {
        let response = {
            status:"Error",
            message:error.message
        }
        return res.json(response) 
       }
    })

TrainingRouter.post("/update",async(req:any, res:any) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const {id} = req.body;
        const {data} = req.body;
        const subscription = dao.update(id,data)
        let response = {
            status:"success",
            message:"Training updated successfully",
         
        }
        res.status(200).json(response);
        
    } catch (error) {
        let response = {
            status:"error",
            message:"Error updating the training",
            error:error
        }
        res.status(500).json(response);
    }
});

/**
 * Delete the training
 * @param idTraining
 * @return json response
 */
TrainingRouter.post("/delete",registerTrainingValidationRules(),async(req:any, res:any) => {

    try {
        const {idTraining} = req.body;
       
        if (idTraining) {
            const training = await dao.findByid(idTraining)
            console.log(training)
            if (!training) {
                console.log("Entro en el if")
                return res.status(400).json({status:"error", message: "Training not found" });
            }
            const trainingDeleted =  await dao.delete(idTraining);
            let response = {
                status:"success",
                message:"Training deleted successfully",
                training:trainingDeleted
            }
            res.status(200).json(response);
            
        }
    } catch (error) {
        let response = {
            status:"error",
            message:"Error deleting the training",
            error:error
        }
        res.status(500).json(response);
        
    }

})

TrainingRouter.post("/filterBydate",async (req, res) => {
    const {date} = req.body;
    console.log(date)
    try {
        const trainings = await dao.getBydates(date);
        console.log(trainings)
        if (trainings) {
            let response = {
                status:"success",
                message:"Training list",
                trainings:trainings
            }
            
            res.status(200).json(response);
        }else{
            let response = {
                status:"error",
                message:"Can Find Training",
                trainings:[]
            }
            res.status(200).json(response);
        }

    } catch (error) {
        let response = {
            status:"error",
            message:"Error listing the trainings",
            error:error
        }
        res.status(500).json(response);
        
    }
})


/**
 * Insert user in Training
 * @param request body Json
 * @returns Json response
 */
TrainingRouter.post("/insertUserTraining",async (req, res) => {
    try {
         const {userId, trainingId} = req.body;
         await dao.insertUserTraining(userId, trainingId);
         let response = {
             status:"success",
             message:"Training created",
         }
         return res.status(200).json(response);
    } catch (error) {
        let response = {
            status:"error",
            message:"Error creating the training",
            error:error
        }
        return res.status(500).json(response);
    }
})

TrainingRouter.post("/userTraining",async (req, res) => {
    try {
        const {userId} = req.body;
        const trainings = await dao.listTrainingUsers(userId);
        let response = 
        {status:"success",
        message:"Training list",
        trainings:trainings}
        return res.status(200).json(response);
    } catch (error) {
        let response = {
            status:"error",
            message:"Error listing the trainings",
            error:error
        }
        return res.status(500).json(response);
        
    }
}
)

/*
* List the user in a training
* @param idTraining string
* @ Return json response
*/

TrainingRouter.post("/trainingUser",async (req, res) => {
    try {
        const {idTraining} = req.body;
        const users = await dao.listUsersTraining(idTraining);
        let response = {
            status:"success",
            message:"Training list",
            users:users
        }
        return res.status(200).json(response);
    } catch (error) {
        let response = {
            status:"error",
            message:"Error listing the trainings",
            error:error
        }
        return res.status(500).json(response);
    }

})



export{TrainingRouter }