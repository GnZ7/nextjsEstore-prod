import React, { useCallback, useEffect, useState } from 'react'
import Avatar from '../Avatar'
import { AiFillCaretDown } from 'react-icons/ai'
import Link from 'next/link'
import UserMenuItem from './UserMenuItem'
import { signOut } from 'next-auth/react'
import BackDrop from './BackDrop'
import { useRouter } from 'next/navigation'
import { SafeUser } from '@/types'

interface UserMenuProps {
  currentUser: SafeUser | null
}
const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setIsUserMenuOpen(prev => !prev)
  }, [])

  useEffect(() => {
    if (!currentUser) {
      router.push('/')
    }
  }, [currentUser])

  return (
    <>
      <div className='relative z-30'>
        <div
          onClick={toggleOpen}
          className='
          p-2
          border-[1px]
          border-slate-400
          flex
          flex-row
          items-center
          gap-1
          rounded-full
          cursor-pointer
          hover:shadow-md
          transition
          text-slate-700'
        >
          <Avatar src={currentUser?.image} />
          <AiFillCaretDown />
        </div>
        {isUserMenuOpen && (
          <div
            className='absolute
        rounded-md
        shadow-md
        w-[170px]
        bg-white
        overflow-hidden
        right-0
        top-12
        text-sm
        flex
        flex-col
        cursor-pointer'
          >
            {currentUser != null && currentUser.role === 'USER' ? (
              <div>
                <Link href={'/cart'}>
                  <UserMenuItem
                    onClick={() => {
                      toggleOpen()
                    }}
                  >
                    Mi Carrito
                  </UserMenuItem>
                </Link>
                <Link href={'/orders'}>
                  <UserMenuItem
                    onClick={() => {
                      toggleOpen()
                    }}
                  >
                    Mis Ordenes
                  </UserMenuItem>
                </Link>
                <UserMenuItem
                  onClick={() => {
                    toggleOpen()
                    signOut()

                    router.push('/')
                  }}
                >
                  Salir
                </UserMenuItem>
              </div>
            ) : currentUser != null && currentUser.role === 'ADMIN' ? (
              //OPCIONES ADMIN
              <div>
                <Link href={'/admin'}>
                  <UserMenuItem
                    onClick={() => {
                      toggleOpen()
                    }}
                  >
                    Admin Dashboard
                  </UserMenuItem>
                </Link>
                <Link href={'/cart'}>
                  <UserMenuItem
                    onClick={() => {
                      toggleOpen()
                    }}
                  >
                    Mi Carrito
                  </UserMenuItem>
                </Link>
                <Link href={'/orders'}>
                  <UserMenuItem
                    onClick={() => {
                      toggleOpen()
                    }}
                  >
                    Mis Compras
                  </UserMenuItem>
                </Link>
                <UserMenuItem
                  onClick={() => {
                    toggleOpen()
                    signOut()
                    router.push('/login')
                  }}
                >
                  Salir
                </UserMenuItem>
              </div>
            ) : (
              <div>
                <Link href={'/register'}>
                  <UserMenuItem>Registrarse</UserMenuItem>
                </Link>
                <Link href={'/login'}>
                  <UserMenuItem onClick={toggleOpen}>Ingresar</UserMenuItem>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {isUserMenuOpen && <BackDrop onClick={toggleOpen} />}
    </>
  )
}

export default UserMenu
