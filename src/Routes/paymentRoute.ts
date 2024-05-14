import { Router } from "express";
import { PaymentsDao } from "../repositories/paymentsDao";

export const routerPayment = Router();

const dao = new PaymentsDao();

routerPayment.post("/create",async (req, res) => {
    const {idUser,type} = req.body;

    try {
        await dao.createPayment(idUser,type)
        let response = {
            status:"success",
            message:"Payment created successfully"
        }
        return res.json(response);
    } catch (error:any) {
        let response = {
            status:"Error",
            message:error.message
        }

        return res.json(response)
        
    }

})