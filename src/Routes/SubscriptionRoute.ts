import { Router } from "express";

import { Subscription } from "../models/subscription/Subscription";
import { SubscriptionDao } from "../repositories/SubscriptionDao";

export const subscriptionRouter = Router();

/*
* Create the subscriptions
* @return{json with status success, error and message}
*/ 
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

/*
* Delete the subscription
* @return{json with status success, error and message}
*/
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


/*
* Update the subscription
* @return{json with status success, 
* error and message,subscriptionUPdated Array}
*/
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

/*
* List the subscriptions
* @return{json with status success| error 
* and message,Array of subscriptions Object}
*/
subscriptionRouter.post("/listUserSubscription",async(req:any,res:any) => {
     const{idUser,status} = req.body
 
   try {
       const dao = new SubscriptionDao();
       const subscription = await dao.findUserSubscriptions(idUser,status)
       console.log(subscription)

       if(!subscription){
        return res.json(
            {status:"error",
            message:"Subscription not found"})
       }
     
       return res.json({
           status:"success",
           message:" subscription of user",
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

subscriptionRouter.post("/saveSubscriptionAndPayment",async(req:any,res:any) => {
    const{idUser,payment,idSubscription} = req.body
    console.log(idUser)
    console.log(payment)
    console.log(idSubscription)

  try {
      const dao = new SubscriptionDao();
      const subscription = await dao.saveSubscriptions(idUser,payment,idSubscription)
      console.log(subscription)
      if(!subscription){
       return res.json(
           {status:"error",
           message:"Can't save subscription"})
      }
    
      return res.json({
          status:"success",
          message:" subscription and payment saved successfully"
      })
  } catch (error:any){ 
    console.log(error)
      let response = {
       
          status:"Error",
          message:error.message
      }
      return res.json(response)
  }
})

