'use client'
import React from 'react'
import Heading from '../components/Heading'
import moment from 'moment'
import { Rating } from '@mui/material'
import Avatar from '../components/Avatar'
import translateToSpanish from '@/utils/translateToSpanish'

interface ListRatingProps {
  product: any
}
const ListRating: React.FC<ListRatingProps> = ({ product }) => {
  return (
    <div>
      <Heading title='Reseñas del producto' />
      <div className='text-sm mt-2'>
        {product.reviews.length === 0 ? (
          <p> Aun no hay opiniones sobre este producto</p>
        ) : (
          product.reviews.map((review: any) => {
            return (
              <div key={review.id} className='max-w-[300px]'>
                <div className='flex gap-2 items-center'>
                  <Avatar src={review.user.image} />
                  <div className='justify-center'>
                    <div className='font-semiblod'>{review?.user.name}</div>
                    <div className='font-light text-xs text-slate-500'>
                      {translateToSpanish(moment(review.createdDate).fromNow())}
                    </div>
                  </div>
                </div>
                <div className='mt-2'>
                  <Rating value={review.rating} readOnly />
                  <div className='ml-2'>{review.comment}</div>
                  <hr className='mt-4 mb-4' />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ListRating
