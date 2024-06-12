import { Router } from "express";

import { Payment } from "../models/payments/payment";
import { PaymentsDao } from "../repositories/paymentsDao";
import {UserDao} from "../repositories/UserDao";
import {SubscriptionDao} from "../repositories/SubscriptionDao";

export const routerPayment = Router();



routerPayment.post("/create",async (req, res) => {
    const {idUser,type,subscriptionId,amount} = req.body;
    //Necessary check if the subscription exists and the user exists
    try {
        const date = new Date()
        const payment = new Payment(type,amount,subscriptionId,date)
        const dao = new PaymentsDao()
        const daoUSer = new UserDao();
        const daoSubscription = new SubscriptionDao();
        // Find the user 
        const user = await daoUSer.findById(idUser);
        const subscription = await daoSubscription.findById(subscriptionId);
        // Check if the user exists
        if(!user){
            return res.json({
                status:"error",
                message:"User not found"
            })
        }
        // Check id subscription exists
        if(!subscription){
            return res.json(
                {status:"error",
                message:"Subscription not found"})
        }
        // Create the payment and save it in the database
        const resultQuery =await dao.create(payment);
        if (resultQuery) {
            return res.json({
                status:"success",
                message:"Payment created successfully"
            })
        }
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

        if(!payments){
            return res.json({
                status:"error",
                message:"User don´t have payments"
            })
        }
    
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
