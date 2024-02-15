import { getCurrentUser } from '@/actions/getCurrentUser'
import Container from '@/app/components/Container'
import NullData from '@/app/components/NullData'
import React from 'react'
import getOrders from '@/actions/getOrders'
import ManageClientOrders from './ManageClientOrders'

const ManageOrders = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.role != 'ADMIN') {
    return <NullData title='Acceso denegado' />
  }

  const orders = await getOrders()

  if (orders) {
    return (
      <div className='pt-8'>
        <Container>
          <ManageClientOrders orders={orders} />
        </Container>
      </div>
    )
  } else {
    return <NullData title='No se encontraron ordenes' />
  }
}

export default ManageOrders
