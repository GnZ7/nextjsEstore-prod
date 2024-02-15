export const revalidate = 0
import Container from './components/Container'
import HomeBanner from './components/HomeBanner'
import ProductCard from './components/products/ProductCard'
import getProducts, { IProductParams } from '@/actions/getProducts'
import NullData from './components/NullData'
import shuffleArray from '@/utils/shuffleArray'

interface HomeProps {
  searchParams: IProductParams
}
export default async function Home ({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams)

  if (products.length === 0) {
    return (
      <>
        <NullData
          title='No se encontraron productos'
          subtitle='Prueba borrando los filtros'
        />
      </>
    )
  }

  const shuffledProducts = shuffleArray(products)

  return (
    <div className='p-8'>
      <Container>
        <div>
          <HomeBanner />
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
          {shuffledProducts.map((product: any) => {
            return <ProductCard key={product.id} data={product} />
          })}
        </div>
      </Container>
    </div>
  )
}
