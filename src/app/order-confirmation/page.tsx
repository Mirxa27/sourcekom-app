'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Thank you for your order!</p>
            <p>Your order ID is: {orderId}</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
