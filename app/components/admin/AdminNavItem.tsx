import { Icon } from '@mui/material'
import React from 'react'
import { IconType } from 'react-icons'
interface AdminNavItemProps {
  selected?: boolean
  icon: IconType
  label: string
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({
  selected,
  icon: Icon,
  label
}) => {
  return (
    <div
      className={`flex items-center justify-center border-b-2 text-center gap-1 p-2
  transition cursor-pointer hover:text-slate-800 ${
    selected
      ? 'border-b-slate-800 text-slate-800'
      : 'border-transparent text-slate-500'
  }`}
    >
      <Icon size={20} />
      <div className='font-medium text-sm text-center break-normal'>
        {label}
      </div>
    </div>
  )
}

export default AdminNavItem
