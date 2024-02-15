'use client'
import Button from '@/app/components/Button'
import Container from '@/app/components/Container'
import FormWrap from '@/app/components/FormWrap'
import Heading from '@/app/components/Heading'
import CategoryInput from '@/app/components/inputs/CategoryInput'
import ColorSelect from '@/app/components/inputs/ColorSelect'
import CustomCheckbox from '@/app/components/inputs/CustomCheckbox'
import Input from '@/app/components/inputs/Input'
import TextArea from '@/app/components/inputs/TextArea'
import { categories } from '@/utils/Categories'
import { colors } from '@/utils/Colors'
import formatPrice from '@/utils/formatPrice'
import { Image } from '@prisma/client'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable
} from 'firebase/storage'
import firebaseApp from '@/libs/firebase'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export type ImageType = {
  color: string
  colorCode: string
  image: File | null
}

export type UploadedImageType = {
  color: string
  colorCode: string
  image: string
}
const AddProductForm = () => {
  const router = useRouter()
  const [images, setImages] = useState<ImageType[] | null>()
  const [isProductCreated, setIsProductCreated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      description: '',
      brand: '',
      category: '',
      inStock: false,
      images: [],
      price: ''
    }
  })

  useEffect(() => {
    setCustomValue('images', images)
  }, [images])

  useEffect(() => {
    if (isProductCreated) {
      reset()
      setImages(null)
      setIsProductCreated(false)
    }
  }, [isProductCreated])

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    //subir imagenes a firebase
    let uploadedImages: UploadedImageType[] = []

    if (!data.category) {
      setIsLoading(false)
      return toast.error('Debes seleccionar una categoría')
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false)
      return toast.error('No se subieron imágenes')
    }

    const handleImageUploads = async () => {
      toast('Agregando producto... por favor espere')

      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + '-' + item.image.name
            const storage = getStorage(firebaseApp)
            const storageRef = ref(storage, `products/${fileName}`)
            const uploadTask = uploadBytesResumable(storageRef, item.image)

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                snapshot => {
                  
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  console.log('Upload is ' + progress + '% done')
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused')
                      break
                    case 'running':
                      console.log('Upload is running')
                      break
                  }
                },
                error => {
                  console.log('Error al subir imagen ', error)
                  reject(error)
                },
                () => {
                  // Handle upload correcto
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadURL => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL
                      })
                      console.log(
                        'uploadedImages actualizado: ',
                        uploadedImages
                      )
                      console.log('File available at', downloadURL)
                      resolve()
                    })
                    .catch(e => {
                      console.log(e)
                      reject(e)
                    })
                }
              )
            })
          }
        }
      } catch (error) {
        setIsLoading(false)
        console.log('handleImageUploads falló', error)
        return toast.error('handleImageUploads falló')
      }
    }

    await handleImageUploads()

    //Update MongoDB
    /*
    Creo un objeto con la información de data, pero reemplazando el precio de string a float (recibía error)
      y el array de images.
    */
    const productData = {
      ...data,
      price: parseFloat(data.price),
      images: uploadedImages
    }
    //console.log('PRODUCT DATA', productData)

    axios
      .post('/api/product', productData)
      .then(() => {
        toast.success('Producto creado exitosamente')
        setIsProductCreated(true)
        router.refresh()
      })
      .catch(e => {
        toast.error('Fallo al agregar el producto a la base de datos')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }
  const category = watch('category')
  const addImageToState = useCallback((value: ImageType) => {
    setImages(prev => {
      if (!prev) {
        return [value]
      }

      return [...prev, value]
    })
  }, [])
  const removeImageFromState = useCallback((value: ImageType) => {
    setImages(prev => {
      if (prev) {
        const filteredImages = prev.filter(item => item.color != value.color)
        return filteredImages
      }
      return prev
    })
  }, [])

  return (
    <>
      <Heading title='Añadir Producto' center />
      <Input
        id='name'
        label='Name'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id='price'
        label='Precio'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='number'
      />

      <Input
        id='brand'
        label='Marca'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id='description'
        label='Descripción'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckbox
        id='inStock'
        register={register}
        label='El producto está en stock'
      />
      <div className='w-full font-medium'>
        <div className='mb-2 font-semibold'>Categoría</div>
        <div className='grid grid-cols-2 md:grid-cols-3 max-h-[50vh] gap-2'>
          {categories.map(categ => {
            if (categ.label === 'Todo') {
              return null
            }

            return (
              <div key={categ.label} className='col-span'>
                <CategoryInput
                  onClick={category => setCustomValue('category', category)}
                  selected={category === categ.label}
                  label={categ.label}
                  icon={categ.icon}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className='w-full flex flex-col flex-wrap gap-4'>
        <div>
          <div className='font-bold'>
            Seleccioná los colores disponibles del producto y subí las imagenes.
          </div>
          <div className='text-sm'>
            Debés subir una imagen por cada color seleccionado, de lo contrario
            la selección del color será ignorada.
          </div>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          {colors.map((color, index) => {
            return (
              <ColorSelect
                key={index}
                item={color}
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProductCreated={false}
              />
            )
          })}
        </div>
      </div>
      <Button
        label={isLoading ? 'Cargando...' : 'Agregar'}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  )
}

export default AddProductForm
