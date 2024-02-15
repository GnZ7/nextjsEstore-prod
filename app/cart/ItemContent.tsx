'use client'
import React from 'react'
import { CartProductType } from '../components/products/ProductDetail'
import formatPrice from '@/utils/formatPrice'
import Link from 'next/link'
import truncateText from '@/utils/truncateText'
import Image from 'next/image'
import SetQuantity from '../components/products/SetQuantity'
import { useCart } from '../hooks/useCart'

interface ItemContentProps {
  item: CartProductType
}
const ItemContent: React.FC<ItemContentProps> = ({ item }) => {
  const {
    handleRemoveFromCart,
    handleCartQantityIncrease,
    handleCartQantityDecrease
  } = useCart()
  return (
    <div
      className='grid grid-cols-5 text-xs md:text-sm
        border-t-[1.5px]
      border-slate-200
        py-4
        items-center'
    >
      <div
        className='
      col-span-2
      justify-self-start
      flex
      gap-2
      md:gap-4
      '
      >
        <Link href={`/product/${item.id}`}>
          <div className='relative w-[70px] h-[70px]'>
            <Image
              src={item.selectedImg.image}
              alt={item.name}
              fill
              sizes='70px'
              className='object-contain'
            />
          </div>
        </Link>
        <div className='flex flex-col justify-between'>
          <Link href={`/product/${item.id}`}>{truncateText(item.name)}</Link>
          <div>{item.selectedImg.color}</div>
          <div className='w-[70px]'>
            <button
              className='text-slate-500 underline mt-1'
              onClick={() => {
                handleRemoveFromCart(item)
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
      <div className='justify-self-center'>{formatPrice(item.price)}</div>
      <div className='justify-self-center'>
        <SetQuantity
          cartCounter={true}
          cartProduct={item}
          handleQuantityDecr={() => {
            handleCartQantityDecrease(item)
          }}
          handleQuantityIncr={() => {
            handleCartQantityIncrease(item)
          }}
        />
      </div>
      <div className='justify-self-end font-semibold'>
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  )
}

export default ItemContent
