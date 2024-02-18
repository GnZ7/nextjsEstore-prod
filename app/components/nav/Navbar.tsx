'use client'
import Link from 'next/link'
import Container from '../Container'
import CartCount from './CartCount'
import UserMenu from './UserMenu'
import { SafeUser } from '@/types'
import { Redressed } from 'next/font/google'
import Categories from './Categories'
import Searchbar from './Searchbar'
import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const redressed = Redressed({ subsets: ['latin'], weight: ['400'] })

interface NavbarProps {
  currentUser: SafeUser | null
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const router = useRouter()
  /*useEffect(() => {
    router.refresh()
  }, [currentUser])*/
  return (
    <div className='sticky top-0 w-full bg-slate-400 z-30 shadow-sm text-slate-50'>
      <div className='py-4'/* border-b-[1px]*/>
        <Container>
          <div className='flex items-center justify-between gap-3 md:gap-0'>
            <Link href='/' className={`${redressed.className} font-bold text-3xl`}>
              E-Store
            </Link>
            <div className='hidden md:block'>
              <Searchbar />
            </div>
            <div className='flex items-center gap-8 md:gap-12'>
              <div>
                <CartCount currentUser={currentUser} />
              </div>
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>
      <Suspense>
        <Categories />
      </Suspense>
    </div>
  )
}

export default Navbar
