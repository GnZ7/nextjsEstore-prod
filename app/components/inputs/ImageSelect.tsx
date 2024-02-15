'use client'
import { useDropzone } from 'react-dropzone'
import { ImageType } from '@/app/admin/add-products/AddProductForm'
import { dividerClasses } from '@mui/material'
import { useCallback } from 'react'

interface ImageSelectProps {
  item?: ImageType
  handleFileChange: (value: File) => void
}

const ImageSelect: React.FC<ImageSelectProps> = ({
  item,
  handleFileChange
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0])
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png'] }
  })

  return (
    <div
      {...getRootProps()}
      className='border-2 border-slate-400 p-2 border-dashed cursor-pointer text-sm font-normal
    text-slate-400 flex items-center justify-center'
    >
      <input {...getInputProps} />
      {isDragActive ? (
        <p> Arrastra y suelta la imagen aquí</p>
      ) : (
        <p> + {item?.color} Imagen</p>
      )}
    </div>
  )
}

export default ImageSelect
