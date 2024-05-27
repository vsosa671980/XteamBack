import { Router } from "express";

import { Payment } from "../models/payments/payment";
import { PaymentsDao } from "../repositories/paymentsDao";

export const routerPayment = Router();



routerPayment.post("/create",async (req, res) => {
    const {idUser,type,subscriptionId,amount} = req.body;
    try {
        const payment = new Payment(type,amount,subscriptionId,idUser)
        const dao = new PaymentsDao()
        dao.create(payment);
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



routerPayment.post("/listPaymentUser",async (req, res) => {

    const {idUser} = req.body

    try {
     
        const dao = new PaymentsDao()
        const payments = await dao.showPaymentsUser(idUser)
        console.log(payments)
        return res.json({
            status:"success",
            message:"Payment list",
            userPayments:payments
        })
    } catch (error:any) {
        let response = {
            status:"Error",
            message:error.message
        }
        return res.json(response)
    }
})
