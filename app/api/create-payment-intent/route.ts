import Stripe from "stripe";
import prisma from '@/libs/prismadb'
import { NextResponse } from "next/server";
import { CartProductType } from "@/app/components/products/ProductDetail";
import { getCurrentUser } from "@/actions/getCurrentUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,
    {
        apiVersion: "2023-10-16"
    });

const calculateOrderAmount = (items: CartProductType[])=>{
    const totalPrice = items.reduce((acc, item)=>{
        const itemTotal = item.price * item.quantity

        return acc + itemTotal
    },0)

    return totalPrice
}

export async function POST(request: Request){
    const currentUser = await getCurrentUser()
    if(!currentUser){
        return NextResponse.error()
    }

    const body = await request.json()
    const {items, payment_intent_id} = body
    const total = Math.round(calculateOrderAmount(items) * 100)
    
    const orderData = {
        user: {connect: {id: currentUser.id}},
        amount: total,
        currency: 'usd',
        status: 'pending',
        deliveryStatus: 'pending',
        paymentIntentId: payment_intent_id,
        products: items
    } 

    if(payment_intent_id){
        //update order
        const currentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)
        
        if(currentIntent){
            const updated_intent = await stripe.paymentIntents.update(
                currentIntent.id,
                {amount:total}
            )
            const [existingOrder, update_order] = await Promise.all([
                prisma.order.findFirst({
                    where:{paymentIntentId:currentIntent.id},
                    
                }),
                prisma.order.update({
                    where: {paymentIntentId: currentIntent.id},
                    data: {
                        amount: total,
                        products: items
                    }
                })
            ])
    
            if(!existingOrder){
                return NextResponse.error()
            }
    
            return NextResponse.json({paymentIntent: updated_intent})
        }


    }else {        
        //create intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
            automatic_payment_methods:{enabled:true},
        })
        //create order
        orderData.paymentIntentId = paymentIntent.id

        await prisma.order.create({
            data: orderData,
        })

        return NextResponse.json({paymentIntent})
    }
    //Respuesta default
    return NextResponse.error()
}