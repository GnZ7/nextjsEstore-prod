import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Navbar from './components/nav/Navbar'
import Footer from './components/footer/Footer'
import CartProvider from '@/providers/CartProvider'
import { Toaster } from 'react-hot-toast'
import { getCurrentUser } from '@/actions/getCurrentUser'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'Online Store',
  description: 'Ecommerce app'
}

export default async function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  return (
    <html lang='en'>
      <body className={`${poppins.className} text-slate-700`}>
        <Toaster
          toastOptions={{
            style: {
              background: 'rgb(21 65 85)',
              color: '#fff'
            }
          }}
        />
        {/* Paso currentUser como prop a CartProvider para que pueda ser accedido
        y pasado hacia abajo al CartContextProvider en useCart */}
        <CartProvider currentUser={currentUser}>
          <div className='flex flex-col min-h-screen'>
            <Navbar currentUser={currentUser} />
            <main className='flex-grow'>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
