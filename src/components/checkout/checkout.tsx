'use client'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MyFatoorah } from '@/components/payment/myfatoorah'

export function Checkout() {
  const { items, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  })

  const totalPrice = items.reduce((total, item) => total + item.price, 0)

  const processCheckout = async (paymentId?: string) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer: formData,
          paymentId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Checkout successful',
        })
        clearCart()
        router.push(`/order-confirmation?orderId=${data.orderId}`)
      } else {
        toast({
          title: 'Checkout failed',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This will be handled by the MyFatoorah component
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">SAR {totalPrice.toFixed(2)}</p>
          </div>
          <MyFatoorah
            amount={totalPrice}
            onPaymentSuccess={(paymentId) => {
              processCheckout(paymentId)
            }}
          />
        </form>
      </CardContent>
    </Card>
  )
}
