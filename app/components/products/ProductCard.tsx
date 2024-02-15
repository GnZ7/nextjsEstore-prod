'use client'

import formatPrice from '@/utils/formatPrice'
import truncateText from '@/utils/truncateText'
import Image from 'next/image'
import React from 'react'
import { Rating } from '@mui/material'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  data: any
}
const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter()

  //Promedio de los rating de cada review del producto
  const productRating =
    data.reviews.reduce(
      (accumulator: number, item: any) => item.rating + accumulator,
      0
    ) / data.reviews.length

  //console.log(data.id)
  return (
    <div
      onClick={() => router.push(`/product/${data.id}`)}
      className='col-span-1
     cursor-pointer border-[1.2px]
     border-slate-200
     bg-slate-50
     rounded-sm p-2
     transition
     hover:scale-105
     text-center
     text-sm'
    >
      <div
        className='
      flex
      flex-col
      items-center
      w-full
      gap-1'
      >
        <div className='aspect-square overflow-hidden relative w-full'>
          <Image
            fill
            src={data.images[0].image}
            alt={truncateText(data.name)}
            className='object-contain'
            sizes='w-full h-full'
          />
        </div>
        <div className='mt-4'>{truncateText(data.name)}</div>
        <div className='font-semibold'>{formatPrice(data.price)}</div>
        <div className='mt-2 text-xs'>{data.reviews.length}{data.reviews.length === 1 ? ' opinión' : ' opiniones'}</div>
        <div>
          <Rating value={productRating} readOnly />
        </div>
      </div>
    </div>
  )
}

export default ProductCard
