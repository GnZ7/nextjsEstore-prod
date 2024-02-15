'use client'
import { Rating } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import SetColor from './SetColor'
import SetQuantity from './SetQuantity'
import Button from '../Button'
import ProductImages from './ProductImages'
import { useCart } from '@/app/hooks/useCart'
import { MdCheckCircle } from 'react-icons/md'
import { useRouter } from 'next/navigation'

interface ProductDetailProps {
  product: any
}

export type CartProductType = {
  id: string
  name: string
  description: string
  category: string
  brand: string
  selectedImg: selectedImgType
  quantity: number
  price: number
}

export type selectedImgType = {
  color: string
  colorCode: string
  image: string
}
const Hr = () => {
  return <hr className='w-[30%] my-2' />
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { handleAddToCart, cartProducts } = useCart()
  const [isProductInCart, setIsProductInCart] = useState(false)
  const router = useRouter()

  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    description: product.description,
    category: product.category,
    name: product.name,
    brand: product.brand,
    selectedImg: { ...product.images[0] },
    quantity: 1,
    price: product.price
  })

  //console.log(cartProducts)
  useEffect(() => {
    setIsProductInCart(false)
    if (cartProducts) {
      const productIndex = cartProducts.findIndex(
        item => item.id === product.id
      )
      if (productIndex > -1) {
        setIsProductInCart(true)
      }
    }
  }, [cartProducts])

  //Promedio de los rating de cada review del producto
  const productRating =
    product.reviews.reduce(
      (accumulator: number, item: any) => item.rating + accumulator,
      0
    ) / product.reviews.length

  const handleColorSelect = useCallback(
    (value: selectedImgType) => {
      setCartProduct(prev => {
        return { ...prev, selectedImg: value }
      })
    },
    [cartProduct.selectedImg]
  )
  const handleQuantityDecr = useCallback(() => {
    setCartProduct(prev => {
      return { ...prev, quantity: prev.quantity - 1 }
    })
  }, [cartProduct])
  const handleQuantityIncr = useCallback(() => {
    setCartProduct(prev => {
      return { ...prev, quantity: prev.quantity + 1 }
    })
  }, [cartProduct])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
      <div className='mt-3'>
        <ProductImages
          cartProduct={cartProduct}
          product={product}
          handleColorSelect={handleColorSelect}
        />
      </div>
      <div className='flex flex-col gap-2 mt-3'>
        <h2 className='text-3xl font-medium'>{product.name}</h2>
        <div className='flex items-center gap-1'>
          <div className='text-xs'>{isNaN(productRating) ? null : productRating}</div>
          <Rating value={productRating} readOnly />
          <div className='text-xs'>{`(${product.reviews.length})`}</div>
        </div>
        <Hr />
        <div className='text-justify'>{product.description}</div>
        <Hr />
        <div>
          <span className='font-semibold'> Categoría: </span>
          {product.category}
        </div>
        <div>
          <span className='font-semibold'>Marca: </span>
          {product.brand}
        </div>
        <span className={product.inStock ? 'text-teal-500' : 'text-red-500'}>
          {product.inStock ? 'Stock disponible' : 'Sin stock'}
        </span>
        <Hr />
        {isProductInCart ? (
          <>
            <p className='flex  items-center gap-2'>
              <MdCheckCircle className='text-green-500' size={20} />
              <span>Producto agregado al carrito!</span>
            </p>
            <div className='max-w-[300px]'>
              <Button
                label='Ver carrito'
                outline
                onClick={() => {
                  router.push('/cart')
                }}
              />
            </div>
          </>
        ) : (
          <>
            <SetColor
              cartProduct={cartProduct}
              images={product.images}
              handleColorSelect={handleColorSelect}
            />

            <Hr />
            <SetQuantity
              cartProduct={cartProduct}
              handleQuantityDecr={handleQuantityDecr}
              handleQuantityIncr={handleQuantityIncr}
            />
            <Hr />
            <div className='max-w-[300px]'>
              <Button
                label='Añadir al carrito'
                onClick={() => handleAddToCart(cartProduct)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
