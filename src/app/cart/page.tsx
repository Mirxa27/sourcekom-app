'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Cart } from '@/components/cart/cart'

export default function CartPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Cart />
      </div>
    </AppLayout>
  )
}
