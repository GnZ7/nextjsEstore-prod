import { getCurrentUser } from '@/actions/getCurrentUser'
import Container from '@/app/components/Container'
import NullData from '@/app/components/NullData'
import React from 'react'
import ManageProductsClient from './ManageProductsClient'
import getProducts from '@/actions/getProducts'

const ManageProducts = async () => {
  const products = await getProducts({ category: null })

  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.role != 'ADMIN') {
    return <NullData title='Acceso denegado' />
  }

  return (
    <div className='pt-8'>
      <Container>
        <ManageProductsClient products={products} />
      </Container>
    </div>
  )
}

export default ManageProducts
