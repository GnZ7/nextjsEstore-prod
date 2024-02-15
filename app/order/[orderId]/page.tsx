import Container from '@/app/components/Container'

import React from 'react'

import { products } from '@/utils/products'
import OrderDetails from './OrderDetails'
import getOrderById from '@/actions/getOrderById'
import NullData from '@/app/components/NullData'

interface OrderParams {
  orderId?: string
}

const Order = async ({ params }: { params: OrderParams }) => {
  const order = await getOrderById(params)
  if (order != null) {
    return (
      <div>
        <Container>
          <OrderDetails order={order} />
        </Container>
      </div>
    )
  } else {
    return <NullData title='No se encontró la orden' />
  }
}

export default Order
