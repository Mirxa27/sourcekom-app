'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Checkout } from '@/components/checkout/checkout'

export default function CheckoutPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Checkout />
      </div>
    </AppLayout>
  )
}
