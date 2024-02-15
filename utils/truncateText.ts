import React from 'react'

const truncateText = (str: string) => {
  if (str.length > 25) return str.substring(0, 25) + '...'
  else return str
}

export default truncateText
