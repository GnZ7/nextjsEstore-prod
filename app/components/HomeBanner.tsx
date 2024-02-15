import Image from 'next/image'
import React from 'react'

const HomeBanner = () => {
  return (
    <div className='relative bg-gradient-to-b from-sky-500 to-sky-700 mb-8'>
      <div className='mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly'>
        <div className='mb-0 md:mb-0 text-center'>
          <h1 className='text-4xl md:6xl text-white mb-4'>
            Ofertas de verano!
          </h1>
          <p className='text-lg md:text-xl text-white mb-7'>
            Disfruta descuentos en productos seleccionados
          </p>
          <p className='text-4xl md:text-6xl font-bold text-yellow-300'>
            50% OFF!
          </p>
        </div>
        <div className='w-1/3 relative aspect-video'>
          <Image
            src='/banner-image.png'
            alt='Banner Image'
            fill
            sizes='(max-width: 600px) 300px, 500px'
            priority
            className='object-contain'
          />
        </div>
      </div>
    </div>
  )
}

export default HomeBanner
