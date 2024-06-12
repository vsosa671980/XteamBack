import { connectionDB } from "../database/connection";
import { Repository } from "../database/queriesModels";
import { Payment } from "../models/payments/payment";
import { PaymentsDao } from "./paymentsDao";

export class SubscriptionDao extends Repository {
    tableName: string = "subscription";

    constructor() {
        super();
        
    }

    /*
     * Find the subscriptions of specific User
     * @param {idUser:number,status:string}
     * return {}
     */
    async findUserSubscriptions(idUser: number, status: string) {
        try {
            const query = `
                SELECT subscription.title, UsersSubscriptions.status, UsersSubscriptions.dateFinish, payments.amount, payments.date 
                FROM subscription 
                JOIN UsersSubscriptions ON subscription.id = UsersSubscriptions.idSubscription
                JOIN payments ON payments.subscriptionId = subscription.id
                WHERE UsersSubscriptions.status = ? AND UsersSubscriptions.idUser = ?;`;
            
            const [subs] = await this.conn.query(query, [status, idUser]);
            console.log(subs);
            
            if (subs.length !== 0) {
                const response = {
                    status: "success",
                    message: "List of Subscriptions",
                    subscriptions: subs
                };
                return response;
            } else {
                const response = {
                    status: "error",
                    message: "Subscriptions not found",
                    subscriptions: subs
                };
                return response;
            }
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    async saveSubscriptions(idUser: string, payment: Payment, idSubscription: number) {
          
        try {
            const conn =await  connectionDB.getConnection()
            await conn.beginTransaction();
            console.log("conexionsdfgdsfgdsfgdsfg",this.conn)
            // Check if the subscription exists
            const subscription = await this.findById(idSubscription);
            
            if (subscription && Object.keys(subscription).length !== 0) {
                idSubscription = subscription.id;
                // Create the payment object
                const { type } = payment;
                const amount = subscription.price;
                const date = new Date();
                const paymentCreated = new Payment(type, amount, idUser, date);
                const paymentDao = new PaymentsDao();
                const resultQueryPayment = await paymentDao.create(paymentCreated);
               
                if (resultQueryPayment) {
                    const datePaySubscription = new Date();
                    const dateFinish = new Date(datePaySubscription);
                    dateFinish.setDate(dateFinish.getDate() + 365); 
                    
                    const status = "active"; 
                    
                    // Get the last payment
                    const queryGetLastPayment = "SELECT * FROM payments ORDER BY id DESC LIMIT 1";
                    const [lastPayment] = await this.conn.query(queryGetLastPayment);
                    
    
                    if (lastPayment && lastPayment.length > 0) {
                        const idLastPayment = lastPayment[0].id;
                        console.log("soy la subscripcion",idLastPayment)
    
                        const query = `
                            INSERT INTO UsersSubscriptions (idUser, idSubscription, status, dateFinish) 
                            VALUES (?, ?, ?, ?);`
                        await this.conn.query(query, [idUser, idSubscription, status, dateFinish]);
                       
                        const queryGetLastSubscription = "SELECT * FROM subscription ORDER BY id DESC LIMIT 1";
                        const [lastSubscription] = await this.conn.query(queryGetLastSubscription);
    
                        if (lastSubscription && lastSubscription.length > 0) {
                            const subscriptionId = lastSubscription[0].id;
                        
                           const queryUpdate = `UPDATE payments SET subscriptionId = ? WHERE id = ?`;
                           console.log(subscriptionId,idLastPayment)
                           const finalResult =  await this.conn.query(queryUpdate, [subscriptionId, idLastPayment]);
                           console.log(finalResult)
                           await this.conn.commit();
                            return true;
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error(error); // Corrected error handling
            throw error; // Rethrow the error to be handled by the caller
        }
    }
}

