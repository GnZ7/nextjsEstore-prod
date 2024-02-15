'use client'
import { Order, Product, User } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import Heading from '../components/Heading'
import formatPrice from '@/utils/formatPrice'
import formatNumber from '@/utils/formatNumber'

interface SummaryProps {
    orders: Order[]
    products: Product[]
    users: User[] | undefined
}

type SummaryDataType = {
    [key: string]: {
        label: string
        digit: number
    }
}

const Summary: React.FC<SummaryProps> = ({ orders, products, users }) => {
    const [summaryData, setSummaryData] = useState<SummaryDataType>({
        sales: {
            label: 'Ventas',
            digit: 0
        },
        orders: {
            label: 'Ordenes',
            digit: 0
        },
        products: {
            label: 'Productos',
            digit: 0
        },
        paidOrders: {
            label: 'Ordenes pagas',
            digit: 0
        },
        users: {
            label: 'Usuarios',
            digit: 0
        },
        unpaidOrders: {
            label: 'Ordenes impagas',
            digit: 0
        },

    })

    useEffect(() => {
        setSummaryData((prev) => {
            let tempData = { ...prev }

            const totalSales = orders.reduce((acc, item) => {
                if (item.status === 'complete') {
                    return acc + item.amount
                } else return acc
            }, 0)

            const paidOrders = orders.filter(order => {
                return order.status === 'complete'
            })

            const unpaidOrders = orders.filter(order => {
                return order.status === 'pending'
            })

            //Filtrar undefined (si no, no lo peudo asignar a tempData.users.digit)
            let filteredUsers: (User[] | undefined) = []
            if (users !== undefined) {
                filteredUsers = users.filter((user) => user !== undefined);
            }

            tempData.sales.digit = totalSales
            tempData.orders.digit = orders.length
            tempData.paidOrders.digit = paidOrders.length
            tempData.unpaidOrders.digit = unpaidOrders.length
            tempData.products.digit = products.length
            tempData.users.digit = filteredUsers.length

            return tempData
        })



    }, [orders, products, users])

    const summaryKeys = Object.keys(summaryData)
    return (
        <div className='max-w-[1150px] m-auto'>
            <div className='mb-4 mt-8'>
                <Heading title='Estadísticas' center />
            </div>
            <div className='grid grid-cols-2 gap-3 max-h-50vh overflow-y-auto'>
                {
                    summaryKeys && summaryKeys.map((key) => {
                        return <div key={key} className='rounded-xl border-2 p-4 flex flex-col
                        items-center gap-2 transition'>
                            <div className='text-xl md:text-4xl font-bold'>
                                {
                                    summaryData[key].label === 'Ventas' ? <>{formatPrice(summaryData[key].digit)}</>
                                        : <>{formatNumber(summaryData[key].digit)}</>
                                }
                            </div>
                            <div>{summaryData[key].label}</div>

                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Summary