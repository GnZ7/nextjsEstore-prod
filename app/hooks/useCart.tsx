import React, { useCallback, useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { CartProductType } from '../components/products/ProductDetail'
import toast from 'react-hot-toast'

//variables que van a ser pasadas a traves de "value"
type CartContextType = {
  cartTotalQty: number
  cartTotalPrice: number
  cartProducts: CartProductType[] | null
  handleAddToCart: (product: CartProductType) => void
  handleRemoveFromCart: (product: CartProductType) => void
  handleCartQantityIncrease: (product: CartProductType) => void
  handleCartQantityDecrease: (product: CartProductType) => void
  handleDropCart: () => void
  paymentIntent: string | null | undefined
  handleSetPaymentIntent: (val: string | null | undefined) => void
}
export const CartContext = createContext<CartContextType | null>(null)

interface Props {
  [propName: string]: any
}
export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0)
  const [cartTotalPrice, setCartTotalPrice] = useState(0)
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  )
  const [paymentIntent, setPaymentIntent] = useState<string | null>()
  const [userId, setUserId] = useState(props.userId) //Recupera el userId pasado desde el layout para diferenciar el carrito de cada usuario en el localstorage

  useEffect(() => {
    //console.log('USER ID DESDE USECART > USEFFECT: ', userId)
    const storedCartItems: any = localStorage.getItem(`CartItems_${userId}`)
    const retrievedCartItems: CartProductType[] | null =
      JSON.parse(storedCartItems)
    setCartProducts(retrievedCartItems)

    const storedPaymentIntent: any = localStorage.getItem('paymentIntent')
    const paymentIntent: string | null = JSON.parse(storedPaymentIntent)
    setPaymentIntent(paymentIntent)
  }, [])

  useEffect(() => {
    //Calcular precio total y cantidad de items en el carrito
    const getTotals = () => {
      if (cartProducts) {
        const { totalPrice, qty } = cartProducts?.reduce(
          (accumulator, cartItem) => {
            const itemTotalPrice = cartItem.price * cartItem.quantity
            accumulator.totalPrice += itemTotalPrice
            accumulator.qty += cartItem.quantity
            return accumulator
          },
          /* defaults del accumulator: */
          {
            totalPrice: 0,
            qty: 0
          }
        )
        setCartTotalQty(qty)
        setCartTotalPrice(totalPrice)
      }
    }

    getTotals()
  }, [cartProducts])

  const handleAddToCart = useCallback((product: CartProductType) => {
    setCartProducts(prev => {
      let updatedCart

      if (prev) {
        updatedCart = [...prev, product]
      } else {
        updatedCart = [product]
      }

      localStorage.setItem(`CartItems_${userId}`, JSON.stringify(updatedCart))

      return updatedCart
    })
    toast.success('producto agregado al carrito!')
  }, [])

  const handleRemoveFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter(item => {
          return item.id != product.id
        })
        setCartProducts(filteredProducts)
        toast.success('producto eliminado')
        localStorage.setItem(
          `CartItems_${userId}`,
          JSON.stringify(filteredProducts)
        )
      }
    },
    [cartProducts]
  )

  const handleCartQantityIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart
      if (cartProducts) {
        updatedCart = [...cartProducts]

        const productIndex = cartProducts.findIndex(
          item => item.id === product.id
        )

        if (productIndex > -1) {
          ++updatedCart[productIndex].quantity
        }

        setCartProducts(updatedCart)
        localStorage.setItem(`CartItems_${userId}`, JSON.stringify(updatedCart))
      }
    },
    [cartProducts]
  )

  const handleCartQantityDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart
      if (cartProducts) {
        updatedCart = [...cartProducts]

        const productIndex = cartProducts.findIndex(
          item => item.id === product.id
        )

        if (productIndex > -1) {
          --updatedCart[productIndex].quantity
        }

        setCartProducts(updatedCart)
        localStorage.setItem(`CartItems_${userId}`, JSON.stringify(updatedCart))
      }
    },
    [cartProducts]
  )

  const handleDropCart = useCallback(() => {
    setCartProducts(null)
    setCartTotalQty(0)
    localStorage.removeItem(`CartItems_${userId}`)
    localStorage.removeItem('paymentIntent')
  }, [])

  const handleSetPaymentIntent = useCallback(
    (val: string | null | undefined) => {
      setPaymentIntent(val)
      localStorage.setItem('paymentIntent', JSON.stringify(val))
    },
    []
  )
  const value = {
    cartTotalQty,
    cartProducts,
    handleAddToCart,
    handleRemoveFromCart,
    handleCartQantityIncrease,
    handleCartQantityDecrease,
    handleDropCart,
    cartTotalPrice,
    paymentIntent,
    handleSetPaymentIntent
  }
  return <CartContext.Provider value={value} {...props} />
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === null) {
    throw new Error('useCart debe ser usado dentro del CartContextProvider')
  }

  return context
}
