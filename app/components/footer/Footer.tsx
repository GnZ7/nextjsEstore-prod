import React from 'react'
import Container from '../Container'
import FooterList from './FooterList'
import Link from 'next/link'
import { MdFacebook } from 'react-icons/md'
import {
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillYoutube
} from 'react-icons/ai'

const Footer = () => {
  return (
    <footer className='bg-slate-700 text-slate-200 text-sm mt-16'>
      <Container>
        <div className='flex flex-col md:flex-row justify-between pt-14 pb-8'>
          <FooterList>
            <h3 className='text-base font-bold mb-2'> Categorías </h3>
            <Link href='#'>Poductos X</Link>
            <Link href='#'>Poductos Y</Link>
            <Link href='#'>Poductos Z</Link>
          </FooterList>
          <FooterList>
            <h3 className='text-base font-bold mb-2'> Atención al Cliente </h3>
            <Link href='#'>Contactanos</Link>
            <Link href='#'>Devoluciones y Cambios</Link>
            <Link href='#'>Preguntas Frecuentes</Link>
          </FooterList>
          <div className='w-full md:w-1/3 mb-6 md:mb-0'>
            <h3 className='text-base font-bold mb-2'>Sobre Nosotros</h3>
            <p className='mb-2'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
              adipisci quisquam a possimus, officia unde eligendi harum,
              similique quis nostrum ab accusamus ea fuga odit natus eveniet
              recusandae maiores dolore?
            </p>
            <p>
              &copy; {new Date().getFullYear()} GNZ. Todos los derechos
              reservados
            </p>
          </div>
          <FooterList>
            <h3 className='text-base font-bold'>Seguinos</h3>
            <div className='flex gap-2'>
              <Link href='#'>
                <MdFacebook size={24}></MdFacebook>
              </Link>
              <Link href='#'>
                <AiFillTwitterCircle size={24}></AiFillTwitterCircle>
              </Link>
              <Link href='#'>
                <AiFillInstagram size={24}></AiFillInstagram>
              </Link>
              <Link href='#'>
                <AiFillYoutube size={24}></AiFillYoutube>
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
