'use client'

import { useState } from 'react'
import Image from 'next/image'

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
  fallbackSrc?: string
}

export function SafeImage({
  src,
  alt,
  fill = false,
  sizes,
  className,
  priority = false,
  fallbackSrc = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  return (
    <Image
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => {
        if (!hasError) {
          setHasError(true)
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
