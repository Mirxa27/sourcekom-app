'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Search,
  Network,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Target,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Building,
  FileText,
  Shield,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'

export default function ApproachPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null)

  const steps = [
    {
      id: 'analyze',
      number: '1',
      title: 'Analyze',
      icon: Search,
      description: 'We begin by thoroughly analyzing your resource needs and legal requirements to identify optimization opportunities.',
      examples: [
        'Comprehensive resource audit and assessment',
        'Legal compliance review and gap analysis',
        'Market opportunity identification',
        'Performance metrics evaluation',
        'Cost structure analysis',
        'Risk assessment and mitigation planning'
      ],
      color: 'blue'
    },
    {
      id: 'connect',
      number: '2',
      title: 'Connect',
      icon: Network,
      description: 'We connect you with the right resources or provide the necessary legal guidance to address your specific needs.',
      examples: [
        'Resource matching with compatible businesses',
        'Expert legal consultant assignment',
        'Network introductions and partnerships',
        'Access to specialized resources',
        'Technology platform integration',
        'Stakeholder engagement facilitation'
      ],
      color: 'purple'
    },
    {
      id: 'implement',
      number: '3',
      title: 'Implement',
      icon: CheckCircle,
      description: 'Our team works alongside yours to implement resource sharing solutions or legal strategies with minimal disruption.',
      examples: [
        'Resource sharing agreement execution',
        'Legal documentation and compliance setup',
        'Process implementation and training',
        'Technology deployment and configuration',
        'Change management support',
        'Milestone tracking and reporting'
      ],
      color: 'emerald'
    },
    {
      id: 'optimize',
      number: '4',
      title: 'Optimize',
      icon: TrendingUp,
      description: 'We continuously monitor and refine our solutions to ensure optimal performance and compliance.',
      examples: [
        'Performance monitoring and analytics',
        'Continuous improvement recommendations',
        'Cost optimization strategies',
        'Efficiency enhancement programs',
        'Compliance audits and updates',
        'Long-term partnership maintenance'
      ],
      color: 'orange'
    }
  ]

  const benefits = [
    {
      icon: Target,
      title: 'Reduce operational costs',
      description: 'Through resource optimization and strategic planning'
    },
    {
      icon: Shield,
      title: 'Ensure legal compliance',
      description: 'Minimize regulatory risks with expert guidance'
    },
    {
      icon: Building,
      title: 'Access specialized resources',
      description: 'Without long-term commitments'
    },
    {
      icon: Users,
      title: 'Expand your business network',
      description: 'Connect with quality partners and opportunities'
    }
  ]

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50/50 via-white to-yellow-50/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              Our Approach
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent">
              How We Deliver Excellence
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Our proven four-step methodology ensures successful outcomes for every engagement, 
              from initial analysis to continuous optimization and growth.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {steps.map((step) => {
              const IconComponent = step.icon
              const isExpanded = expandedStep === step.id
              
              return (
                <Collapsible
                  key={step.id}
                  open={isExpanded}
                  onOpenChange={(open) => setExpandedStep(open ? step.id : null)}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer">
                        <div className="flex items-start gap-6">
                          <div className={`w-16 h-16 bg-${step.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className={`w-8 h-8 text-${step.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <Badge className={`bg-${step.color}-100 text-${step.color}-700`}>
                                Step {step.number}
                              </Badge>
                              <CardTitle className="text-2xl">{step.title}</CardTitle>
                            </div>
                            <CardDescription className="text-base mt-2">
                              {step.description}
                            </CardDescription>
                          </div>
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="w-6 h-6 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="ml-24">
                          <h4 className="font-semibold mb-4 text-lg">What This Includes:</h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {step.examples.map((example, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className={`w-5 h-5 text-${step.color}-600 flex-shrink-0 mt-0.5`} />
                                <span className="text-sm text-muted-foreground">{example}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              Key Benefits
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Why Our Approach Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our systematic methodology delivers measurable results and sustainable growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Visualization */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                Our Process Flow
              </Badge>
              <h2 className="text-3xl font-bold mb-4">A Continuous Journey</h2>
              <p className="text-muted-foreground">
                Our approach is designed to be iterative and adaptive, ensuring long-term success
              </p>
            </div>

            <div className="relative">
              {/* Process Flow */}
              <div className="grid md:grid-cols-4 gap-6">
                {steps.map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <div key={step.id} className="relative">
                      <Card className="text-center p-6 h-full">
                        <div className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <IconComponent className={`w-8 h-8 text-${step.color}-600`} />
                        </div>
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </Card>
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                          <ArrowRight className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Feedback Loop */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-lg border border-blue-200">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Continuous monitoring and optimization creates a feedback loop for sustained growth
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Platform Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              Resource Platform
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Explore Our Resource Platform</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience our approach in action through our innovative resource sharing platform. 
              Browse resources, filter by location, and manage bookings seamlessly.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/browse">
                Visit Platform
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-yellow-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Our Approach?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's analyze your needs and start optimizing your business today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/services">
                Explore Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

