'use client'
import React from 'react'
import { CartProductType } from './ProductDetail'

interface SetQuantityProps {
  cartCounter?: boolean
  cartProduct: CartProductType
  handleQuantityIncr: () => void
  handleQuantityDecr: () => void
}

const btnStyles = 'border-[1.2px] border-slate-300 px-2 rounded'

//const isBtnDisabled = cartProduct

const SetQuantity: React.FC<SetQuantityProps> = ({
  cartCounter,
  cartProduct,
  handleQuantityIncr,
  handleQuantityDecr
}) => {
  return (
    <div className='flex gap-8 items-center'>
      {cartCounter ? null : <div className='font-semibold'> Cantidad: </div>}
      <div className='flex gap-4 items-center text-base'>
        <button
          onClick={handleQuantityDecr}
          className={btnStyles}
          disabled={cartProduct.quantity === 1}
        >
          -
        </button>
        <div>{cartProduct.quantity}</div>

        {/*TODO: deshabilitar el boton si la cantidad alcanza al máximo stock*/}
        <button onClick={handleQuantityIncr} className={btnStyles}>
          +
        </button>
      </div>
    </div>
  )
}

export default SetQuantity
