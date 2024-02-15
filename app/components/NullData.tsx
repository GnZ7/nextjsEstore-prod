import React from 'react'

interface NullDataProps {
  title: string
  subtitle?: string
}

const NullData: React.FC<NullDataProps> = ({ title, subtitle }) => {
  return (
    <div className='w-full h-[50vh] flex flex-col items-center justify-center text-xl md:text-2xl'>
      <p className='font-medium'>{title}</p>
      {subtitle && (<p className='text-sm text-slate-500'>{subtitle}</p>)}
    </div>
  )
}

export default NullData
