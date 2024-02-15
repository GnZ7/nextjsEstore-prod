import { getCurrentUser } from '@/actions/getCurrentUser'
import Container from '@/app/components/Container'
import NullData from '@/app/components/NullData'
import React from 'react'
import getOrders from '@/actions/getOrders'
import getOrdersByUserId from '@/actions/getOrdersByUserId'
import OrderClient from './OrderClient'

const Orders = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return (
      <NullData title='Debes ingresar con tu cuenta para ver tus órdenes' />
    )
  }

  const orders = await getOrdersByUserId(currentUser.id)

  if (orders) {
    return (
      <div className='pt-8'>
        <Container>
         <OrderClient orders={orders}/>
        </Container>
      </div>
    )
  } else {
    return <NullData title='No se encontraron ordenes' />
  }
}

export default Orders
