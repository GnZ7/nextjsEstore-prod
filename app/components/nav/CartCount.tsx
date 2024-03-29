import { useCart } from '@/app/hooks/useCart'
import { useRouter } from 'next/navigation'
import { CiShoppingCart } from 'react-icons/ci'
import React from 'react'
import { User } from '@prisma/client'
import { SafeUser } from '@/types'

interface CartCountProps {
  currentUser: SafeUser | null
}

const CartCount: React.FC<CartCountProps> = ({ currentUser }) => {
  const { cartTotalQty } = useCart()
  const router = useRouter()

  return (
    <div
      className='relative cursor-pointer'
      onClick={() => router.push('/cart')}
    >
      <div className='text-3xl p'>
        <CiShoppingCart />
      </div>
      {currentUser && cartTotalQty ? (
        <span
          className='
            absolute
            top-[-10px]
            right-[-10px]
            bg-red-600
            text-white
            h-6
            w-6
            rounded-3xl
            flex
            items-center
            justify-center
            text-xs'
        >
          {cartTotalQty}
        </span>
      ) : null}
    </div>
  )
}

export default CartCount
