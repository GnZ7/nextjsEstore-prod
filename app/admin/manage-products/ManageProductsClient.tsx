'use client'
import { Product } from '@prisma/client'
import React, { useCallback, useState } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import formatPrice from '@/utils/formatPrice'
import Heading from '@/app/components/Heading'
import Status from '@/app/components/Status'
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRememberMe,
  MdRemove,
  MdRemoveRedEye
} from 'react-icons/md'
import ActionBtn from '@/app/components/ActionBtn'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { deleteObject, getStorage, ref } from 'firebase/storage'
import firebaseApp from '@/libs/firebase'

interface ManageProductsClientProps {
  products: Product[]
}
const ManageProductsClient: React.FC<ManageProductsClientProps> = ({ products }) => {
  const router = useRouter()
  const storage = getStorage(firebaseApp)

  let rows: any = []
  if (products) {
    rows = products.map(product => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images
      }
    })
  }
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'name', headerName: 'Nombre', width: 220 },
    {
      field: 'price',
      headerName: 'Precio (USD)',
      width: 100,
      renderCell: params => {
        return (
          <div className='font-bold text-slate-800'>{params.row.price}</div>
        )
      }
    },
    { field: 'category', headerName: 'Categoría', width: 100 },
    { field: 'brand', headerName: 'Marca', width: 100 },
    {
      field: 'inStock',
      headerName: 'En Stock',
      width: 120,
      renderCell: params => {
        return (
          <div className='font-bold'>
            {params.row.inStock === true ? (
              <Status
                text='Sí'
                icon={MdDone}
                bg='bg-teal-200'
                color='text-teal-700'
              />
            ) : (
              <Status
                text='No'
                icon={MdClose}
                bg='bg-red-200'
                color='text-red-700'
              />
            )}
          </div>
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 200,
      renderCell: params => {
        return (
          <div className='flex justify-between items-center gap-4 w-full'>
            <ActionBtn
              icon={MdCached}
              onClick={() => {
                handleToggleStock(
                  params.row.id,
                  params.row.name,
                  params.row.inStock
                )
              }}
            />
            <ActionBtn
              icon={MdDelete}
              onClick={() => {
                handleDeleteProduct(params.row.id, params.row.images)
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                //TO DO: No funciona por ahora porque los id de la DB no coinciden con los de /utils/products.tsx
                router.push(`product/${params.row.id}`)
              }}
            />
          </div>
        )
      }
    }
  ]
  //Actualiza valor de "inStock en MongoDB dando feedback al usuario con toasts"
  const handleToggleStock = useCallback(
    (id: string, name: string, inStock: boolean) => {
      const loadingToast = toast.loading('Actualizado producto ' + name + '...')

      //PUT request a mongoDB
      axios
        .put('/api/product', {
          id,
          inStock: !inStock
        })
        .then(res => {
          router.refresh()
        })
        .catch(e => {
          console.log(e)
        })
        .finally(() => {
          toast.remove(loadingToast)
          //toast.success('Producto ' + name + ' actualizado')
        })
    },
    []
  )
  const handleDeleteProduct = useCallback(async (id: string, images: any) => {
    const deletingToast = toast('Eliminando producto...')

    const handleImageDelete = async () => {
      try {
        for (const item of images) {
          if (item.images) {
            //Borrar imagenes de Firebase
            const imageRef = ref(storage, item.image)
            await deleteObject(imageRef)
            console.log('Imagen borrada ', item.image)
          }
        }
      } catch (error) {
        return console.log('Error al borrar imagenes', error)
      }
    }
    await handleImageDelete()

    //Borrar producto de DB
    axios
      .delete(`/api/product/${id}`)
      .then(res => {
        toast.remove(deletingToast)
        toast.success('Producto eliminado')
        router.refresh()
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  return (
    <div className={`max-w-[1150px] m-auto text-xl`}>
      <div className='mb-4 tp-8'>
        <Heading title='Administrar productos'></Heading>
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

export default ManageProductsClient
