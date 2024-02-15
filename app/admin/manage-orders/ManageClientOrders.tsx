'use client'
import React, { useCallback } from 'react'
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
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { Order, User } from '@prisma/client'

interface ManageClientOrdersProps {
  orders: OrderExtended[]
}

type OrderExtended = Order & {
  user: User
}

const ManageClientOrders: React.FC<ManageClientOrdersProps> = ({ orders }) => {
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
      headerName: 'Acciones',
      width: 200,
      renderCell: params => {
        return (
          <div className='flex justify-between items-center gap-4 w-full'>
            <ActionBtn
              icon={MdDeliveryDining}
              onClick={() => {
                handleDispatch(params.row.id)
              }}
            />
            <ActionBtn
              icon={MdDone}
              onClick={() => {
                handleDelivered(params.row.id)
              }}
            />
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
  //Actualiza valor de "inStock en MongoDB dando feedback al usuario con toasts"
  const handleDispatch = useCallback((id: string) => {
    const loadingToast = toast.loading('Actualizado envío del producto')
    //PUT request a mongoDB
    axios
      .put('/api/order', {
        id,
        deliveryStatus: 'dispatched'
      })
      .then(res => {
        router.refresh()
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => {
        toast.remove(loadingToast)
        toast.success('Producto enviado')
      })
  }, [])

  const handleDelivered = useCallback((id: string) => {
    const loadingToast = toast.loading('Actualizado envío del producto')
    //PUT request a mongoDB
    axios
      .put('/api/order', {
        id,
        deliveryStatus: 'delivered'
      })
      .then(res => {
        router.refresh()
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => {
        toast.remove(loadingToast)
        toast.success('Producto entregado')
      })
  }, [])

  /*  const handleDeleteOrder = useCallback(async (id: string) => {
    toast('Eliminando producto...')

    //Borrar producto de DB
    axios
      .delete(`/api/product/${id}`)
      .then(res => {
        toast.success('Producto eliminado')
        router.refresh()
      })
      .catch(e => {
        console.log(e)
      })
  }, []) */

  return (
    <div className={`max-w-[1150px] m-auto text-xl`}>
      <div className='mb-4 tp-8'>
        <Heading title='Administrar ordenes'></Heading>
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

export default ManageClientOrders
