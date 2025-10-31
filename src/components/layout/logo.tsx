'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  height?: number
  width?: number
  showText?: boolean
  href?: string
}

export function Logo({
  className,
  height = 40,
  width,
  showText = false,
  href = '/'
}: LogoProps) {
  const logoWidth = width || height * 2.5
  
  const logoElement = (
    <div className={cn('flex items-center space-x-2', className)}>
      <Image
        src="/logo.png"
        alt="SourceKom"
        height={height}
        width={logoWidth}
        className="h-auto w-auto transition-transform hover:scale-105"
        priority
      />
      {showText && (
        <span className="font-bold text-lg">SourceKom</span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoElement}
      </Link>
    )
  }

  return logoElement
}
