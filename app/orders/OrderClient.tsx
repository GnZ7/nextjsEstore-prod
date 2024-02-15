'use client'
import React from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import formatPrice from '@/utils/formatPrice'
import Heading from '@/app/components/Heading'
import Status from '@/app/components/Status'
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye
} from 'react-icons/md'
import ActionBtn from '@/app/components/ActionBtn'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { Order, User } from '@prisma/client'

interface OrderClientProps {
  orders: OrderExtended[]
}

type OrderExtended = Order & {
  user: User
}

const OrderClient: React.FC<OrderClientProps> = ({ orders }) => {
  const router = useRouter()

  let rows: any = []
  if (orders) {
    rows = orders.map(order => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount / 100),
        paymentStatus: order.status,
        deliveryStatus: order.deliveryStatus,
        date: moment(order.createDate).fromNow()
      }
    })
  }
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'customer', headerName: 'Cliente', width: 130 },
    {
      field: 'price',
      headerName: 'Suma (USD)',
      width: 100,
      renderCell: params => {
        return (
          <div className='font-bold text-slate-800'>{params.row.amount}</div>
        )
      }
    },
    {
      field: 'paymentStatus',
      headerName: 'Estado del pago',
      width: 130,
      renderCell: params => {
        return (
          <div className='font-bold text-slate-800'>
            {params.row.paymentStatus === 'pending' ? (
              <Status
                text='Pendiente'
                icon={MdAccessTimeFilled}
                bg='bg-slate-200'
                color='text-slate-700'
              />
            ) : params.row.paymentStatus === 'complete' ? (
              <Status
                text='Realizado'
                icon={MdDone}
                bg='bg-green-200'
                color='text-green-700'
              />
            ) : (
              <></>
            )}
          </div>
        )
      }
    },
    {
      field: 'deliveryStatus',
      headerName: 'Estado del envío',
      width: 130,
      renderCell: params => {
        return (
          <div className='font-bold text-slate-800'>
            {params.row.deliveryStatus === 'pending' ? (
              <Status
                text='Pendiente'
                icon={MdAccessTimeFilled}
                bg='bg-slate-200'
                color='text-slate-700'
              />
            ) : params.row.deliveryStatus === 'dispatched' ? (
              <Status
                text='Despachado'
                icon={MdDeliveryDining}
                bg='bg-purple-200'
                color='text-purple-700'
              />
            ) : params.row.deliveryStatus === 'delivered' ? (
              <Status
                text='Entregado'
                icon={MdDone}
                bg='bg-green-200'
                color='text-green-700'
              />
            ) : (
              <></>
            )}
          </div>
        )
      }
    },
    {
      field: 'date',
      headerName: 'Fecha',
      width: 130
    },
    {
      field: 'actions',
      headerName: 'Ver Detalle',
      width: 100,
      renderCell: params => {
        return (
          <div className='m-auto'>
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`/order/${params.row.id}`)
              }}
            />
          </div>
        )
      }
    }
  ]

  return (
    <div className={`max-w-[1100px] m-auto text-xl`}>
      <div className='mb-4 tp-8'>
        <Heading title='Mis órdenes'></Heading>
      </div>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          className={``}
        />
      </div>
    </div>
  )
}

export default OrderClient
