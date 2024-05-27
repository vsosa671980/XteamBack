import { Router } from "express";

import { Subscription } from "../models/subscription/Subscription";
import { SubscriptionDao } from "../repositories/SubscriptionDao";

export const subscriptionRouter = Router();

subscriptionRouter.post("/create",async (req, res) => {
    const {description1,
         description2,
         description3,
         description4,
         description5,
         price,
         title} = req.body;
    try {
        const subscription = new Subscription(description1, description2, description3,
             description4, description5,price,title )
        const dao = new SubscriptionDao();
        await dao.create(subscription);
        return res.json({
            status:"success",
            message:"Subscription created successfully"
        })
    } catch (error:any) {
        let response = {
            status:"Error",
            message:error.message
        }
        return res.json(response)
    }
})


subscriptionRouter.post("/delete",async(req:any,res:any) => {
    const {idSubscription} = req.body;
   try {
      
       const dao = new SubscriptionDao();
       await dao.delete(idSubscription);
       return res.json({
           status:"success",
           message:"Deleted successfully"
       })
   } catch (error:any) {
       let response = {
           status:"Error",
           message:error.message
       }
       return res.json(response)
   }
})


subscriptionRouter.post("/update",async(req:any,res:any) => {
    const {idSubscription} = req.body;
    const {data} = req.body;
   try {
       const dao = new SubscriptionDao();
       const subscription = await dao.findById(idSubscription)

       if(!subscription){
        return res.json({status:"error",message:"Subscription not found"})
       }
       const subscriptionUPdated = await dao.update(idSubscription,data);
       return res.json({
           status:"success",
           message:" Updated successfully",
           subscription:subscriptionUPdated
       })
   } catch (error:any){ 
       let response = {
           status:"Error",
           message:error.message
       }
       return res.json(response)
   }
})


subscriptionRouter.post("/list",async(req:any,res:any) => {
     const{idUser,status} = req.body
 
   try {
       const dao = new SubscriptionDao();
       const subscription = await dao.findUserSubscriptions(idUser,status)
       console.log(subscription)

       if(!subscription){
        return res.json({status:"error",message:"Subscription not found"})
       }
     
       return res.json({
           status:"success",
           message:" list",
           subscription:subscription
       })
   } catch (error:any){ 
       let response = {
           status:"Error",
           message:error.message
       }
       return res.json(response)
   }
})