'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

declare global {
  interface Window {
    myFatoorah: any
  }
}

export function MyFatoorah({ amount, onPaymentSuccess }: { amount: number; onPaymentSuccess: (paymentId: string) => void }) {
  const { toast } = useToast()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sa.myfatoorah.com/cardview/v2/session.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      })

      if (response.ok) {
        const data = await response.json()
        const { sessionId } = data

        window.myFatoorah.init({
          countryCode: 'SAU',
          sessionId: sessionId,
          cardViewId: 'myfatoorah-card-element',
          onCardBinChanges: (bin) => {
            console.log(bin)
          },
          style: {
            direction: 'ltr',
            cardHeight: 150,
            input: {
              color: 'black',
              fontSize: '14px',
              fontFamily: 'sans-serif',
              inputHeight: '32px',
              inputMargin: '0px',
              borderColor: 'c7c7c7',
              borderWidth: '1px',
              borderRadius: '8px',
              boxShadow: '',
              placeHolder: {
                holderName: 'Name on card',
                cardNumber: 'Long card number',
                expiryDate: 'MM/YY',
                securityCode: 'CVV',
              },
            },
            text: {
              saveCard: 'Save card for future use.',
              cardHolder: 'Card Holder',
              cardNumber: 'Card Number',
              expiryDate: 'Expiry Date',
              securityCode: 'Security Code',
            },
            error: {
              borderColor: 'red',
              borderRadius: '8px',
              boxShadow: '0px',
            },
          },
        })

        window.myFatoorah.submit()
          .then((response: any) => {
            const { cardBrand, paymentId } = response
            onPaymentSuccess(paymentId)
          })
          .catch((error: any) => {
            toast({
              title: 'Payment failed',
              description: error.message,
              variant: 'destructive',
            })
          })
      } else {
        toast({
          title: 'Failed to initiate payment',
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

  return (
    <div>
      <div id="myfatoorah-card-element"></div>
      <Button onClick={handlePayment} className="w-full mt-4">
        Pay with MyFatoorah
      </Button>
    </div>
  )
}
