'use client'
import React, { useEffect, useState } from 'react'
import Heading from '../components/Heading'
import Input from '../components/inputs/Input'
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form'
import Button from '../components/Button'
import Link from 'next/link'
import { AiOutlineGoogle } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { SafeUser } from '@/types'

interface LoginFormProps {
  currentUser: SafeUser | null
}
const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const router = useRouter()
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
  const onSubmit: SubmitHandler<FieldValues> = data => {
    setIsLoading(true)
    signIn('credentials', {
      ...data,
      redirect: false
    }).then(callback => {
      if (callback?.ok) {
        router.push('/')
        toast.success('Ingresaste a tu cuenta')
      }
      if (callback?.error) {
        toast.error(callback.error)
        setIsLoading(false)
      }
    })
  }

  useEffect(() => {
    if (currentUser) {
      router.push('/cart')
      router.refresh()
    }
  }, [currentUser])

  if (currentUser) {
    return (
      <p className='text-center'>
        Ingresaste a tu cuenta. Redireccionando...
      </p>
    )
  }
  return (
    <>
      <Heading title='Ingresá con tu cuenta' />
      <Button
        outline
        label='Ingresar con Google'
        icon={AiOutlineGoogle}
        onClick={() => {
          signIn('google')
        }}
      />
      <hr className='bg-slate-300 w-full h-px' />
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
        <Link href={'/register'} className='underline'>
          {' '}
          No tengo una cuenta{' '}
        </Link>
      </p>
    </>
  )
}

export default LoginForm
