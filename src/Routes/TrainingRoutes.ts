import { Router, response, } from "express";
import { TrainingDao } from "../repositories/TrainingDao";
import { registerTrainingValidationRules } from "../helpers/ValidatorTraining";
import { validationResult } from 'express-validator';
import {Training} from "../models/train/Training"
import { tockenVerification } from "../middlewares/UserVerification";

//Create the Router Object
const TrainingRouter = Router();
//Create the Dao Training Object
const dao = new TrainingDao();

interface TrainingResponse {
    trainings: any[];
    totalPages: number;
    actualPage: number;
}

/**
 * Create the training
 */
TrainingRouter.post("/listPaginates", async (req, res) => {
    //Get the actual page number 
    const {numberPage} = req.body
    try {
        const training = await dao.listPaginates(numberPage) as TrainingResponse;
        let response = {
            status:"success",
            message:"Training list",
            training:training.trainings,
            totalPages:training.totalPages,
            actualPage:training.actualPage
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
 * Create the training and save in database
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
                message:"Create correctly"
            })
    } catch (error:any) {
        let response = {
            status:"Error",
            message:error.message
        }
        return res.json(response) 
       }
    })

/*
* Update a training
*
*/
TrainingRouter.post("/update",async(req:any, res:any) => {
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        // Get the id
        const {id,dataObject} = req.body;
        // Find the training by id
        console.log("id",id)
        const trainingObject = await dao.findById(id);
        console.log(trainingObject)
        if(trainingObject){
            const training = await dao.update(id,dataObject)
           
            if(training){
                return res.json({
                    status:"success",
                    message:"Training updated successfully",
                })
            }else{
                return res.json({
                    status:"error",
                    message:"Training not found"
                })
            }
        }
    } catch (error:any) {
        console.log(error)
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
TrainingRouter.post("/delete",async(req:any, res:any) => {
 
    try {
        const {id} = req.body;
        console.log(id)
        if (id) {
            const trainingDeleted = await dao.delete(id)
            console.log(trainingDeleted)
            if (!trainingDeleted) {
                return res.status(400).json(
                    {status:"error", message: "Training not found" });
            }
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
    console.log("ME LLAMAN")
    console.log(date)
 
    try {
        const trainings = await dao.getBydates(date);
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
    console.log("me llaman")
    const {userId, trainingId} = req.body;
    console.log(userId)
    console.log(trainingId) 
    try {
         const {userId, trainingId} = req.body;
         await dao.insertUserTraining(userId, trainingId);
         let response = {
             status:"success",
             message:"Training created",
         }
         return res.status(200).json(response);
    } catch (error:any) {
        console.log(error)
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

TrainingRouter.post("/trainingUsers",async (req, res) => {

    console.log(req.body.id)
   
    try {
        const {id} = req.body;
        const users = await dao.listUsersTraining(id);
        let response = {
            status:"success",
            message:"Training list",
            users:users
        }
        return res.status(200).json(response);
    } catch (error:any) {
        let response = {
            status:"error",
            message:"Error listing the trainings",
            error:error
        }
        return res.status(500).json(response);
    }

})

TrainingRouter.post("/findById",async (req, res) => {
    try {
        const {id} = req.body
        const training = await dao.findById(id);
        if(training){
            let response = {
                status:"success",
                message:"Training found",
                training:training
            }
            return res.status(200).json(response);
        }else{
            let response = {
                status:"error",
                message:"Training not found",
            }
            res.status(400).json(response);
        }
      
       
    } catch (error) {
        let response = {
            status:"error",
            message:"Error listing the trainings",
            error:error
        }
        return res.status(500).json(response);
    }

})

TrainingRouter.post("/deleteUserFromTrain",async (req, res) => {
    console.log("User",req.body.userId)
    console.log("training",req.body.trainingId)
    try {
        const {userId,trainingId} = req.body
        const training = await dao.deleteUserFromTraining(trainingId,userId);
        if(training){
            let response = {
                status:"success",
                message:"Training Deleted",
            }
            return res.status(200).json(response);
        }else{
            let response = {
                status:"error",
                message:"Training not found",
            }
            res.status(400).json(response);
        }
      
       
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