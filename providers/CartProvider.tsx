'use client'
import { CartContextProvider } from '@/app/hooks/useCart'
import { SafeUser } from '@/types'

interface CartProviderProps {
  children: React.ReactNode
  currentUser: SafeUser | null
}

const CartProvider: React.FC<CartProviderProps> = ({
  children,
  currentUser
}) => {
  const userId: string | undefined = currentUser?.id
  //Recibe el currentUser desde el parent y pasa el userId a los children
  return <CartContextProvider userId={userId}>{children}</CartContextProvider>
}

export default CartProvider
