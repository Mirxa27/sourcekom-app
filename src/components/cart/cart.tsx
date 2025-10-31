'use client'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

export function Cart() {
  const { items, removeFromCart, clearCart } = useCart()

  const totalPrice = items.reduce((total, item) => total + item.price, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    SAR {item.price.toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">SAR {totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={clearCart} className="mr-4">
                Clear Cart
              </Button>
              <Button>Checkout</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
