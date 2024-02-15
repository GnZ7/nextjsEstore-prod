import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe"

export const config = {
    api: {
        bodyParser: false
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,
    {
        apiVersion: "2023-10-16"
    });

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    const buff = await buffer(req)
    const sig = req.headers['stripe-signature']

    if(!sig){
        return res.status(400).send('Falta el signature de Stripe')
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            buff, sig, process.env.STRIPE_WEBHOOK_SECRET!
        )
        
    } catch (error) {
        return res.status(400).send("Webhook error" + error)
        
    }
    const charge: any = event.data.object as Stripe.Charge
    switch(event.type){
        
        case 'charge.succeeded':          

            if(typeof charge.payment_intent === 'string'){
                await prisma?.order.update({
                    where:{paymentIntentId: charge.payment_intent},
                    data:{status: 'complete'}})
            }
            break
        case 'payment_intent.succeeded':
            if(typeof charge.payment_intent === 'string'){
                await prisma?.order.update({
                    where:{paymentIntentId: charge.payment_intent},
                    data:{status: 'complete'}})
            }
            
            break
            default:
            console.log('Evento sin handler: ' + event.type)
    }

    res.json({recieved: true})
}