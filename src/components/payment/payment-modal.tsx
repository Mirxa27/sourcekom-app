'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Loader2, 
  CreditCard, 
  Smartphone, 
  BanknoteIcon,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  Phone
} from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  resource: {
    id: string
    title: string
    description: string
    price: number
    category: string
  }
  user?: {
    id: string
    name: string
    email: string
    phone: string
  }
}

interface PaymentMethodsResponse {
  success: boolean
  paymentMethods: Array<{
    PaymentMethodId: string
    PaymentMethodCode: string
    PaymentMethodAr: string
    PaymentMethodEn: string
    IsDirectPayment: boolean
    ImageUrl: string
    ServiceCharge: number
    TotalAmount: number
    CurrencyIso: string
  }>
}

export function PaymentModal({ isOpen, onClose, resource, user }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    countryCode: '+966'
  })
  const [error, setError] = useState('')
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details')

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods()
      setStep('details')
      setError('')
    }
  }, [isOpen, resource])

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`/api/payments/initiate?amount=${resource.price}`)
      const data: PaymentMethodsResponse = await response.json()
      
      if (data.success) {
        setPaymentMethods(data.paymentMethods)
        // Select first available method by default
        if (data.paymentMethods.length > 0) {
          setSelectedMethod(data.paymentMethods[0].PaymentMethodId)
        }
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate customer information
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        setError('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      // Get auth token
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please login to continue')
        setIsLoading(false)
        return
      }

      // Initiate payment
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resourceId: resource.id,
          amount: resource.price,
          customerInfo,
          paymentMethodId: selectedMethod
        })
      })

      const data = await response.json()

      if (data.success) {
        setStep('processing')
        
        // Redirect to MyFatoorah payment page
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        } else {
          setError('Payment URL not received')
          setIsLoading(false)
        }
      } else {
        setError(data.error || 'Failed to initiate payment')
        setIsLoading(false)
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
      setIsLoading(false)
    }
  }

  const getPaymentMethodIcon = (code: string) => {
    switch (code.toLowerCase()) {
      case 'visa':
      case 'mastercard':
      case 'amex':
        return <CreditCard className="w-5 h-5" />
      case 'knet':
      case 'mada':
        return <BanknoteIcon className="w-5 h-5" />
      case 'applepay':
      case 'stcpay':
        return <Smartphone className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Purchase
          </DialogTitle>
          <DialogDescription>
            Secure payment powered by MyFatoorah
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resource Summary */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.category}</p>
              </div>
              <Badge variant="secondary">SAR {resource.price}</Badge>
            </div>
            <Separator />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-medium">Customer Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <select
                      value={customerInfo.countryCode}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, countryCode: e.target.value }))}
                      className="w-24 px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="+966">+966</option>
                      <option value="+965">+965</option>
                      <option value="+971">+971</option>
                      <option value="+973">+973</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="5xxxxxxxx"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              {paymentMethods.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Select Payment Method</h3>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.PaymentMethodId}
                        className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.PaymentMethodId}
                          checked={selectedMethod === method.PaymentMethodId}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="text-primary"
                        />
                        {method.ImageUrl && (
                          <img 
                            src={method.ImageUrl} 
                            alt={method.PaymentMethodEn}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        {getPaymentMethodIcon(method.PaymentMethodCode)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{method.PaymentMethodEn}</p>
                          {method.ServiceCharge > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Service charge: SAR {method.ServiceCharge}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !selectedMethod}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay SAR {resource.price}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="font-medium mb-2">Processing Payment</h3>
              <p className="text-sm text-muted-foreground">
                Redirecting you to secure payment page...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}