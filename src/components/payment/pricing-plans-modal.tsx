'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Check, X, Loader2, Sparkles, Zap, Crown } from 'lucide-react'

interface PricingPlansModalProps {
  isOpen: boolean
  onClose: () => void
  onSubscribe?: (plan: 'FREE' | 'BASIC' | 'PREMIUM') => void
}

const plans = [
  {
    id: 'FREE' as const,
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    icon: Sparkles,
    features: [
      'Up to 5 resource listings',
      'Basic search and filter',
      'Email support',
      'Access to free resources',
      'Standard listing duration (30 days)',
    ],
    limitations: [
      'Limited to 1 active booking',
      'No featured listings',
      'Basic analytics only',
    ],
    popular: false,
  },
  {
    id: 'BASIC' as const,
    name: 'Basic',
    price: 99,
    period: 'month',
    description: 'For growing businesses',
    icon: Zap,
    features: [
      'Up to 20 resource listings',
      'Advanced search and filters',
      'Priority email support',
      'Access to all resources',
      'Extended listing duration (90 days)',
      'Up to 5 active bookings',
      'Featured listings (1 per month)',
      'Basic analytics dashboard',
      'Resource promotion tools',
    ],
    limitations: [
      'Limited custom branding',
      'Standard reporting',
    ],
    popular: true,
  },
  {
    id: 'PREMIUM' as const,
    name: 'Premium',
    price: 299,
    period: 'month',
    description: 'For professional businesses',
    icon: Crown,
    features: [
      'Unlimited resource listings',
      'Advanced search and filters',
      '24/7 priority support',
      'Access to all resources',
      'Permanent listings',
      'Unlimited active bookings',
      'Featured listings (unlimited)',
      'Advanced analytics dashboard',
      'Full resource promotion tools',
      'Custom branding options',
      'Detailed reporting & insights',
      'API access',
      'White-label options',
      'Dedicated account manager',
    ],
    limitations: [],
    popular: false,
  },
]

export function PricingPlansModal({ isOpen, onClose, onSubscribe }: PricingPlansModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'FREE' | 'BASIC' | 'PREMIUM' | null>(null)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (plan: 'FREE' | 'BASIC' | 'PREMIUM') => {
    setSelectedPlan(plan)
    setIsSubscribing(true)

    try {
      // Check if user is logged in
      const token = localStorage.getItem('token')
      if (!token && plan !== 'FREE') {
        toast({
          title: 'Login required',
          description: 'Please sign in before selecting a paid plan.',
          variant: 'destructive'
        })
        setIsSubscribing(false)
        return
      }

      if (plan === 'FREE') {
        // Free plan doesn't require payment
        if (onSubscribe) {
          onSubscribe(plan)
        }
        toast({
          title: 'Free plan activated',
          description: 'You now have access to the SourceKom free tier.'
        })
        setIsSubscribing(false)
        onClose()
        return
      }

      // For paid plans, initiate payment
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
          amount: plans.find(p => p.id === plan)?.price || 0,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = data.paymentUrl
        } else {
          // Payment completed
          if (onSubscribe) {
            onSubscribe(plan)
          }
          toast({
            title: 'Subscription confirmed',
            description: `Your ${plan.toLowerCase()} plan is now active.`
          })
          onClose()
        }
      } else {
        toast({
          title: 'Subscription failed',
          description: data.error || 'Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error: any) {
      toast({
        title: 'Unexpected error',
        description: error?.message || 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the perfect plan for your business needs. All plans include our core resource sharing features.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {plan.price === 0 ? 'Free' : `SAR ${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/{plan.period}</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  <Separator />

                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isSubscribing && selectedPlan === plan.id}
                  >
                    {isSubscribing && selectedPlan === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : plan.price === 0 ? (
                      'Get Started Free'
                    ) : (
                      `Subscribe to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>All plans include:</strong> Secure payment processing, resource sharing platform access, 
            customer support, and regular platform updates. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
