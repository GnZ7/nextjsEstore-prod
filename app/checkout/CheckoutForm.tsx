'use client'
import React, { useEffect, useState } from 'react'
import { useCart } from '../hooks/useCart'
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import formatPrice from '@/utils/formatPrice'
import { Result } from 'postcss'
import toast from 'react-hot-toast'
import Heading from '../components/Heading'
import Button from '../components/Button'

interface CheckoutFormProps {
  clientSecret: string
  handleSetPaymentSuccess: (value: boolean) => void
}
const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handleSetPaymentSuccess
}) => {
  const { cartTotalPrice, handleDropCart, handleSetPaymentIntent } = useCart()
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const formatedPrice = formatPrice(cartTotalPrice)

  useEffect(() => {
    if (!stripe) {
      return
    }
    if (!clientSecret) {
      return
    }
    handleSetPaymentSuccess(false)
  }, [stripe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) {
      return
    }
    setIsLoading(true)

    stripe
      .confirmPayment({
        elements,
        redirect: 'if_required'
      })
      .then(result => {
        if (!result.error) {
          toast.success('Pago exitoso')

          handleDropCart()
          handleSetPaymentSuccess(true)
          handleSetPaymentIntent(null)
        }
        setIsLoading(false)
      })
  }
  return (
    <form onSubmit={handleSubmit} id='payment-form'>
      <div className='mb-6'>
        <Heading title='Ingresá tus datos' />
      </div>

      <AddressElement
        options={{
          mode: 'shipping',
          allowedCountries: ['US', 'AR']
        }}
      />
      <h2 className='font-semibold mt-4 mb-2'>Información de pago</h2>
      <PaymentElement id='payment-element' options={{ layout: 'tabs' }} />

      <div className='py-4 text-center text-4xl font-bold text-slate-700'>
        Total: {formatedPrice}
      </div>
      <Button
        label={isLoading ? 'Procesando' : 'Pagar'}
        disabled={isLoading || !stripe || !elements}
        onClick={() => {}}
      />
    </form>
  )
}

export default CheckoutForm
