'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Building, 
  Truck, 
  FileText, 
  TrendingUp,
  BarChart3,
  Shield,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const toneStyles = {
  brand: {
    iconBg: 'bg-brand/15',
    iconText: 'text-brand',
    hoverBorder: 'hover:border-brand/30',
    statText: 'text-brand'
  },
  secondary: {
    iconBg: 'bg-brand-secondary/15',
    iconText: 'text-brand-secondary',
    hoverBorder: 'hover:border-brand-secondary/30',
    statText: 'text-brand-secondary'
  },
  highlight: {
    iconBg: 'bg-brand-highlight/15',
    iconText: 'text-brand-highlight',
    hoverBorder: 'hover:border-brand-highlight/30',
    statText: 'text-brand-highlight'
  },
  info: {
    iconBg: 'bg-state-info/10',
    iconText: 'text-state-info',
    hoverBorder: 'hover:border-state-info/30',
    statText: 'text-state-info'
  },
  success: {
    iconBg: 'bg-state-success/10',
    iconText: 'text-state-success',
    hoverBorder: 'hover:border-state-success/30',
    statText: 'text-state-success'
  },
  warning: {
    iconBg: 'bg-state-warning/10',
    iconText: 'text-state-warning',
    hoverBorder: 'hover:border-state-warning/30',
    statText: 'text-state-warning'
  },
  danger: {
    iconBg: 'bg-state-error/10',
    iconText: 'text-state-error',
    hoverBorder: 'hover:border-state-error/30',
    statText: 'text-state-error'
  }
} as const

type Tone = keyof typeof toneStyles

export default function ServicesPage() {
  const services = [
    {
      id: 'logistics',
      icon: Truck,
      title: 'Logistics and Supply Chain Management',
      description: 'Comprehensive solutions for optimizing your logistics operations and supply chain processes to improve efficiency and reduce costs.',
      tone: 'brand',
      features: [
        'Supply chain optimization',
        'Inventory management',
        'Transportation logistics',
        'Warehouse management',
        'Cost reduction strategies',
        'Performance monitoring'
      ],
      process: [
        'Analyze current logistics operations',
        'Identify optimization opportunities',
        'Implement streamlined processes',
        'Monitor and refine performance'
      ]
    },
    {
      id: 'resource-optimization',
      icon: Building,
      title: 'Resource Optimization and Exchange',
      description: 'Innovative platform for businesses to exchange underutilized resources, creating new value and reducing waste.',
      tone: 'info',
      features: [
        'Resource sharing platform',
        'Underutilized asset identification',
        'Resource matching algorithms',
        'Exchange facilitation',
        'Utilization tracking',
        'Cost-sharing models'
      ],
      process: [
        'Resource assessment and valuation',
        'Matching with compatible businesses',
        'Exchange agreement facilitation',
        'Ongoing optimization support'
      ]
    },
    {
      id: 'consulting',
      icon: TrendingUp,
      title: 'Strategic Business Consulting',
      description: 'Expert guidance on business strategy, market positioning, and growth opportunities tailored to the Saudi Arabian market.',
      tone: 'secondary',
      features: [
        'Market analysis and research',
        'Strategic planning',
        'Growth opportunity identification',
        'Competitive analysis',
        'Business model optimization',
        'Performance improvement strategies'
      ],
      process: [
        'Business assessment and analysis',
        'Strategy development',
        'Implementation planning',
        'Results monitoring and adjustment'
      ]
    },
    {
      id: 'efficiency',
      icon: BarChart3,
      title: 'Operational Efficiency Improvement',
      description: 'Analysis and enhancement of business operations to maximize productivity and minimize resource waste.',
      tone: 'warning',
      features: [
        'Process optimization',
        'Workflow analysis',
        'Productivity enhancement',
        'Waste reduction',
        'Quality improvement',
        'Performance metrics development'
      ],
      process: [
        'Current state analysis',
        'Efficiency gap identification',
        'Improvement plan development',
        'Implementation and monitoring'
      ]
    },
    {
      id: 'sustainability',
      icon: Shield,
      title: 'Sustainable Business Practices',
      description: 'Implementation of environmentally friendly and socially responsible business practices that also improve profitability.',
      tone: 'success',
      features: [
        'Sustainability assessment',
        'Green strategy development',
        'Environmental impact reduction',
        'Social responsibility programs',
        'Sustainable supply chain',
        'ESG reporting and compliance'
      ],
      process: [
        'Sustainability audit',
        'Goal setting and planning',
        'Implementation support',
        'Progress tracking and reporting'
      ]
    },
    {
      id: 'market-entry',
      icon: Target,
      title: 'Market Entry and Expansion Services',
      description: 'Support for businesses looking to enter or expand within the Saudi Arabian market, leveraging our local knowledge and connections.',
      tone: 'danger',
      features: [
        'Market entry strategy',
        'Regulatory compliance guidance',
        'Local partnership development',
        'Cultural adaptation support',
        'Market positioning',
        'Growth acceleration'
      ],
      process: [
        'Market feasibility analysis',
        'Entry strategy development',
        'Implementation support',
        'Growth optimization'
      ]
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-secondary">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-brand/15 text-brand hover:bg-brand/25 border-brand/30">
              Our Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-brand bg-clip-text text-transparent">
              Comprehensive Solutions for Business Excellence
            </h1>
            <p className="text-xl text-app-muted mb-8">
              SourceKom offers comprehensive solutions to optimize your resources and enhance your business performance in the Saudi Arabian market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="brand" asChild>
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" className="border-brand text-brand hover:bg-brand hover:text-app" asChild>
                <Link href="/contact">
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tailored solutions designed to address the unique challenges and opportunities in the Saudi Arabian business landscape
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon
              const tone = toneStyles[service.tone as Tone]
              return (
                <Card key={service.id} className={cn("hover:shadow-lg transition-shadow group", tone.hoverBorder)}>
                  <CardHeader>
                    <div className={cn("w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform", tone.iconBg)}>
                      <IconComponent className={cn("w-8 h-8", tone.iconText)} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Features</h4>
                        <ul className="space-y-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-3 h-3 text-state-success flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/services/${service.id}`}>
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-brand/15 text-brand hover:bg-brand/25 border-brand/30">
              Our Process
            </Badge>
            <h2 className="text-3xl font-bold mb-4">How We Deliver Excellence</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our proven methodology ensures successful outcomes for every client engagement
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-brand/15">
                <Lightbulb className="w-8 h-8 text-brand" />
              </div>
              <h3 className="font-semibold mb-2">1. Discover</h3>
              <p className="text-sm text-muted-foreground">
                We begin by understanding your business challenges, goals, and opportunities through comprehensive analysis.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-brand-secondary/15">
                <Target className="w-8 h-8 text-brand-secondary" />
              </div>
              <h3 className="font-semibold mb-2">2. Strategize</h3>
              <p className="text-sm text-muted-foreground">
                Our experts develop tailored strategies that align with your business objectives and market conditions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-brand-highlight/15">
                <Users className="w-8 h-8 text-brand-highlight" />
              </div>
              <h3 className="font-semibold mb-2">3. Implement</h3>
              <p className="text-sm text-muted-foreground">
                We work alongside your team to execute strategies with minimal disruption to your operations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-state-warning/10">
                <BarChart3 className="w-8 h-8 text-state-warning" />
              </div>
              <h3 className="font-semibold mb-2">4. Optimize</h3>
              <p className="text-sm text-muted-foreground">
                Continuous monitoring and refinement ensure sustained improvement and long-term success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-brand/15 text-brand hover:bg-brand/25 border-brand/30">
                Key Benefits
              </Badge>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Services</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-state-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Local Market Expertise</h3>
                    <p className="text-muted-foreground">Deep understanding of Saudi Arabian business landscape and regulatory environment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-state-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Proven Methodology</h3>
                    <p className="text-muted-foreground">Systematic approach backed by years of successful client engagements.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-state-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Customized Solutions</h3>
                    <p className="text-muted-foreground">Tailored strategies that address your specific business needs and challenges.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-state-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Measurable Results</h3>
                    <p className="text-muted-foreground">Focus on delivering tangible outcomes and ROI for your business.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-state-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Ongoing Support</h3>
                    <p className="text-muted-foreground">Continuous partnership to ensure long-term success and adaptation.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-state-success mb-2">30%</div>
                <p className="text-sm text-muted-foreground">Average Cost Reduction</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-brand mb-2">85%</div>
                <p className="text-sm text-muted-foreground">Client Satisfaction Rate</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-brand-highlight mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Businesses Transformed</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-state-warning mb-2">10+</div>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-secondary text-app">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss how our services can help you achieve your business goals and drive sustainable growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="brand" size="lg" asChild>
              <Link href="/contact">
                Schedule Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-app text-app hover:bg-app/80" asChild>
              <Link href="tel:+9661234567890">
                <Phone className="w-4 h-4 mr-2" />
                Call Us Now
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-app-muted">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@sourcekom.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+966 123 456 7890</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Mon-Fri 9AM-5PM</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}