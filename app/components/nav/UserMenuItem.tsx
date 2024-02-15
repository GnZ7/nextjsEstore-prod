import { MenuItemProps } from '@mui/material'
import React from 'react'
interface UserMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
}

const UserMenuItem: React.FC<UserMenuItemProps> = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='px-4 py-3 hover:bg-neutral-100 transition text-slate-700'
    >
      {children}
    </div>
  )
}

export default UserMenuItem
