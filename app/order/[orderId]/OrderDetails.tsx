'use client'
import Heading from '@/app/components/Heading'
import Status from '@/app/components/Status'
import formatPrice from '@/utils/formatPrice'
import { Order } from '@prisma/client'
import moment from 'moment'
import React, { useState } from 'react'
import { MdAccessTimeFilled, MdDeliveryDining, MdDone } from 'react-icons/md'
import translateToSpanish from '@/utils/translateToSpanish'
import OrderItem from './OrderItem'

interface OrderDetailsProps {
  order: Order
}
const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  let dateInSpanish = ''
  return (
    <div className='max-w-[1150px] m-auto flex flex-col gap-2'>
      <div className='mt-8'>
        <Heading title='Detalle de orden' />
      </div>
      <div>ID de orden: {order?.id}</div>
      <div>
        Suma total:{' '}
        <span className='font-bold'>{formatPrice(order.amount)}</span>
      </div>
      <div className='flex gap-2 items-center'>
        <div>Pago:</div>
        <div>
          {order.status === 'pending' ? (
            <Status
              text='Pendiente'
              icon={MdAccessTimeFilled}
              bg='bg-slate-200'
              color='text-slate-700'
            />
          ) : order.status === 'complete' ? (
            <Status
              text='Realizado'
              icon={MdDone}
              bg='bg-green-200'
              color='text-green-700'
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className='flex gap-2 items-center'>
        <div>Envío:</div>
        <div>
          {order.deliveryStatus === 'pending' ? (
            <Status
              text='Pendiente'
              icon={MdAccessTimeFilled}
              bg='bg-slate-200'
              color='text-slate-700'
            />
          ) : order.deliveryStatus === 'delivered' ? (
            <Status
              text='Entregado'
              icon={MdDone}
              bg='bg-green-200'
              color='text-green-700'
            />
          ) : order.deliveryStatus === 'dispatched' ? (
            <Status
              text='Despachado'
              icon={MdDeliveryDining}
              bg='bg-purple-200'
              color='text-purple-700'
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>
        Fecha:{' '}
        {
          (dateInSpanish = translateToSpanish(
            moment(order.createDate).fromNow()
          ))
        }
      </div>
      <div>
        <h2 className='font-semibold mt-4 mb-2'>Productos</h2>
        <div className='grid grid-cols-5 text-xs gap-4 pb-2 items-center'>
          <div className='col-span-2 justify-self-start'>Producto</div>
          <div className='col-span-1 justify-self-center'>Precio</div>
          <div className='col-span-1 justify-self-center'>Cantidad</div>
          <div className='col-span-1 justify-self-end'>Total</div>
        </div>
        {order.products.map(item => {
          return <OrderItem key={item.id} item={item} />
        })}
      </div>
    </div>
  )
}

export default OrderDetails
