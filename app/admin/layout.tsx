import React from 'react'
import AdminNav from '../components/admin/AdminNav'
export const metadata = {
  title: 'E-Store Admin',
  description: 'Administrador de sitio'
}
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  )
}

export default AdminLayout
