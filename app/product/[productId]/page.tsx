import Container from '@/app/components/Container'
import ProductDetail from '@/app/components/products/ProductDetail'
import React from 'react'
import ListRating from '../ListRating'
import { products } from '@/utils/products'
import getProductById from '@/actions/getProductById'
import AddRating from '../AddRating'
import { getCurrentUserAndOrders } from '@/actions/getCurrentUser'


interface ProdParams {
  productId?: string
}

const Product = async ({ params }: { params: ProdParams }) => {
  //Buscar en el array de productos el que tenga el id igual al id pasado en los parametros de la página
  const product = await getProductById(params)
  const user = await getCurrentUserAndOrders()
  return (
    <div>
      <Container>
        <ProductDetail product={product} />
        <div className='flex flex-col mt-20 gap-4'>
          <AddRating product={product} user={user} />
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  )
}

export default Product
