'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useCart } from '../hooks/useCart'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import Button from '../components/Button'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
)

const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart()
  const [error, setError] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentSucess, setPaymentSuccess] = useState(false)

  const router = useRouter()

  useEffect(() => {
    //crear paymnetIntent al cargar la página
    if (cartProducts) {
      setIsLoading(true)
      setError(false)

      fetch('api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartProducts,
          payment_intent_id: paymentIntent
        })
      })
        .then(result => {
          setIsLoading(false)
          if (result.status === 401) {
            return router.push('/login')
          }
          return result.json()
        })
        .then(data => {
          console.log(data)
          setClientSecret(data.paymentIntent.client_secret)
          handleSetPaymentIntent(data.paymentIntent.id)
        })
        .catch(error => {
          setError(true)
          console.log('Error', error)
          toast.error('Algo salió mal')
        })
    }
  }, [paymentIntent, cartProducts])

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating'
    }
  }

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value)
  }, [])

  return (
    <div className='w-full'>
      {clientSecret && cartProducts && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={handleSetPaymentSuccess}
          />
        </Elements>
      )}
      {loading && (
        <div className='text-center'> Cargando métodos de pago... </div>
      )}
      {error && (
        <div className='text-center text-red-600'> Algo salió mal... </div>
      )}
      {paymentSucess && (
        <div className='flex items-center flex-col gap-4'>
          <div className='text-green-600 text-center'>
            Pago exitoso. Que lo disfrutes!
          </div>
          <div className='max-w-[220px] w-full'>
            <Button
              label='Ver Ordenes'
              onClick={() => {
                router.push('/orders')
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutClient
