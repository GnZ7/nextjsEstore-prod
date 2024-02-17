'use client'
import React, { useEffect, useState } from 'react'
import Heading from '../components/Heading'
import Input from '../components/inputs/Input'
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form'
import Button from '../components/Button'
import Link from 'next/link'
import { AiOutlineGoogle } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { SafeUser } from '@/types'

interface RegisterFormProps {
  currentUser: SafeUser | null
}
const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false)
  /* Destructuring de variables del hook que trae react-hook-forms */
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const router = useRouter()

  const onSubmit: SubmitHandler<FieldValues> = data => {
    setIsLoading(true)

    axios
      .post('/api/register', data)
      .then(() => {
        toast.success('Cuenta creada')
        signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        }).then(callback => {
          if (callback?.ok) {
            router.push('/cart')
            router.refresh()
            toast.success('Logeado')
          }
          if (callback?.error) {
            toast.error(callback.error)
          }
        })
      })
      .catch(e => {
        toast.error(e.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (currentUser) {
      router.push('/cart')
      router.refresh()
    }
  }, [])

  if (currentUser) {
    return (
      <p className='text-center'>
        Ya ingresaste a tu cuenta. Redireccionando...
      </p>
    )
  }

  return (
    <>
      <Heading title='Registrate' />
      <Button
        outline
        label='Continuar con Google'
        icon={AiOutlineGoogle}
        onClick={() => {
          signIn('google')
        }}
      />
      <hr className='bg-slate-300 w-full h-px' />
      <Input
        id='name'
        label='Nombre'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id='email'
        label='Email'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id='password'
        label='Contraseña'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='password'
      />
      <Button
        label={isLoading ? 'Cargando...' : 'Enviar'}
        onClick={handleSubmit(onSubmit)}
      />
      <p>
        <Link href={'/login'} className='underline'>
          {' '}
          Ya tenengo una cuenta{' '}
        </Link>
      </p>
    </>
  )
}

export default RegisterForm
