'use client'
import React from 'react'
import { useCart } from '../hooks/useCart'
import Link from 'next/link'
import { MdArrowBack } from 'react-icons/md'
import Heading from '../components/Heading'
import Button from '../components/Button'
import ItemContent from './ItemContent'
import formatPrice from '@/utils/formatPrice'
import { useRouter } from 'next/navigation'
import { SafeUser } from '@/types'
import NullData from '../components/NullData'

interface CartClientProps {
  currentUser: SafeUser | null
}
const CartClient: React.FC<CartClientProps> = ({ currentUser }) => {
  const router = useRouter()
  const { cartProducts, handleDropCart, cartTotalPrice, cartTotalQty } =
    useCart()

  if (currentUser && cartProducts) {
    return (
      <div>

        <div className='grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8'>
          <div className='col-span-2 justify-self-start'>Producto</div>
          <div className='justify-self-center'>Precio</div>
          <div className='justify-self-center'>Cantidad</div>
          <div className='justify-self-end'>total</div>
        </div>
        <div>
          {cartProducts?.map(item => {
            return <ItemContent key={item.id} item={item} />
          })}
        </div>
        <div className='border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4'>
          <div className='w-[120px]'>
            <Button
              label='Vaciar carrito'
              small
              outline
              onClick={() => {
                handleDropCart()
              }}
            />
          </div>
          <div className='text-sm flex flex-col gap-2 items-start w-1/3'>
            <div className='flex justify-between w-full text-base font-semibold gap-3'>
              <span>Subtotal</span>
              <span>{formatPrice(cartTotalPrice)}</span>
            </div>
            <Button
              label='Pagar'
              onClick={() => {
                currentUser ? router.push('/checkout') : router.push('/login')
              }}
            />
            <Link href={'/'} className='flex gap-2 items-center mt-3'>
              <MdArrowBack />
              <span>Continuá comprando</span>
            </Link>
          </div>
        </div>
      </div>
    )
  } else if (!currentUser) {
    return (
      <div className='flex flex-col w-1/3 m-auto'>
        <NullData title='Ingresa a tu cuenta para ver tu carrito.' />
        <Button
          label='Ingresar'
          onClick={() => {
            router.push('/login')
          }}
        />
      </div>
    )
  }
  else {
    return (
      <div className='flex flex-col items-center'>
        <div className='text-2xl'>Tu carrito está vacío</div>
        <Link href={'/'} className='flex gap-2 items-center mt-3'>
          <MdArrowBack />
          <span>Mirá nuestro catálogo</span>
        </Link>
      </div>
    )
  }
}

export default CartClient
