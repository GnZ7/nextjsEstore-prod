'use client'
import React from 'react'
import Container from '../Container'
import { categories } from '@/utils/Categories'
import Category from './Category'
import { usePathname, useSearchParams } from 'next/navigation'

const Categories = () => {
    const params = useSearchParams()
    const category = params?.get('category')
    const pathname = usePathname()
    const isMainPage = pathname === '/'

    if (!isMainPage) return null

    return (
        <div className='bg-white text-black'>
            <Container>
                <div className='pt-4 flex flex-row items-center justify-between overflow-x-auto'>
                    {categories.map((element) => (
                        <Category
                            key={element.label}
                            label={element.label}
                            icon={element.icon}
                            selected={category === element.label || (category === null && element.label === 'Todo')}
                        />
                    ))}
                </div>

            </Container>
        </div>
    )
}

export default Categories