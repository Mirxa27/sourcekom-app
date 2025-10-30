'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  Zap,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage'
  description: string
  uptime: number
  responseTime: number
  lastChecked: string
}

interface Incident {
  id: string
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  startedAt: string
  resolvedAt?: string
  updates: Array<{
    timestamp: string
    message: string
  }>
}

interface Metric {
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

const services: Service[] = [
  {
    id: 'web-app',
    name: 'Web Application',
    status: 'operational',
    description: 'Main SourceKom web application and user interface',
    uptime: 99.9,
    responseTime: 245,
    lastChecked: '2024-01-15T15:30:00Z'
  },
  {
    id: 'api',
    name: 'API Services',
    status: 'operational',
    description: 'RESTful APIs for third-party integrations',
    uptime: 99.8,
    responseTime: 189,
    lastChecked: '2024-01-15T15:30:00Z'
  },
  {
    id: 'database',
    name: 'Database',
    status: 'operational',
    description: 'Primary database and data storage services',
    uptime: 99.95,
    responseTime: 45,
    lastChecked: '2024-01-15T15:30:00Z'
  },
  {
    id: 'payment',
    name: 'Payment Processing',
    status: 'operational',
    description: 'MyFatoorah payment gateway integration',
    uptime: 99.7,
    responseTime: 567,
    lastChecked: '2024-01-15T15:30:00Z'
  },
  {
    id: 'email',
    name: 'Email Services',
    status: 'degraded',
    description: 'Email notifications and communications',
    uptime: 98.5,
    responseTime: 1234,
    lastChecked: '2024-01-15T15:30:00Z'
  },
  {
    id: 'storage',
    name: 'File Storage',
    status: 'operational',
    description: 'Resource file storage and CDN',
    uptime: 99.9,
    responseTime: 123,
    lastChecked: '2024-01-15T15:30:00Z'
  },
  {
    id: 'auth',
    name: 'Authentication',
    status: 'operational',
    description: 'User authentication and authorization services',
    uptime: 99.95,
    responseTime: 89,
    lastChecked: '2024-01-15T15:30:00Z'
  },
  {
    id: 'search',
    name: 'Search Engine',
    status: 'operational',
    description: 'Resource search and indexing services',
    uptime: 99.8,
    responseTime: 156,
    lastChecked: '2024-01-15T15:30:00Z'
  }
]

const incidents: Incident[] = [
  {
    id: 'inc-001',
    title: 'Email delivery delays',
    status: 'monitoring',
    severity: 'medium',
    description: 'We are experiencing delays in email delivery for notification services. Some users may not receive immediate email notifications.',
    startedAt: '2024-01-15T10:30:00Z',
    updates: [
      {
        timestamp: '2024-01-15T10:30:00Z',
        message: 'We are investigating reports of email delivery delays.'
      },
      {
        timestamp: '2024-01-15T11:15:00Z',
        message: 'The issue has been identified as a problem with our email service provider.'
      },
      {
        timestamp: '2024-01-15T12:45:00Z',
        message: 'We have implemented a workaround and are monitoring the situation.'
      }
    ]
  },
  {
    id: 'inc-002',
    title: 'Scheduled maintenance completed',
    status: 'resolved',
    severity: 'low',
    description: 'Database maintenance has been completed successfully.',
    startedAt: '2024-01-14T02:00:00Z',
    resolvedAt: '2024-01-14T04:30:00Z',
    updates: [
      {
        timestamp: '2024-01-14T02:00:00Z',
        message: 'Scheduled database maintenance has begun.'
      },
      {
        timestamp: '2024-01-14T04:30:00Z',
        message: 'Maintenance completed successfully. All services are operational.'
      }
    ]
  }
]

const statusColors = {
  operational: 'bg-green-100 text-green-800 border-green-200',
  degraded: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  partial_outage: 'bg-orange-100 text-orange-800 border-orange-200',
  major_outage: 'bg-red-100 text-red-800 border-red-200'
}

const statusIcons = {
  operational: CheckCircle,
  degraded: AlertCircle,
  partial_outage: AlertCircle,
  major_outage: XCircle
}

const incidentStatusColors = {
  investigating: 'bg-blue-100 text-blue-800',
  identified: 'bg-yellow-100 text-yellow-800',
  monitoring: 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800'
}

const severityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
}

export default function SystemStatus() {
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')

  const operationalServices = services.filter(s => s.status === 'operational').length
  const totalServices = services.length
  const overallStatus = operationalServices === totalServices ? 'operational' : 
                        operationalServices >= totalServices * 0.8 ? 'degraded' : 'partial_outage'

  const refreshStatus = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 2000)
  }

  const formatUptime = (uptime: number) => {
    return `${uptime}%`
  }

  const formatResponseTime = (ms: number) => {
    return `${ms}ms`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOverallStatusIcon = () => {
    switch (overallStatus) {
      case 'operational': return CheckCircle
      case 'degraded': return AlertCircle
      case 'partial_outage': return XCircle
      default: return AlertCircle
    }
  }

  const OverallStatusIcon = getOverallStatusIcon()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--sourcekom-blue)] to-[var(--sourcekom-blue-light)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              System Status
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              System Status and Performance
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Real-time monitoring of SourceKom services and infrastructure
            </p>
            
            {/* Overall Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <OverallStatusIcon className="w-12 h-12" />
                <div className="text-center">
                  <div className="text-3xl font-bold capitalize">
                    {overallStatus.replace('_', ' ')}
                  </div>
                  <div className="text-white/80">
                    {operationalServices} of {totalServices} systems operational
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-white/70">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshStatus}
                  disabled={isRefreshing}
                  className="text-white/70 hover:text-white hover:bg-white/20"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Active Incidents */}
        {incidents.filter(inc => inc.status !== 'resolved').length > 0 && (
          <div className="mb-8">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Active Incidents ({incidents.filter(inc => inc.status !== 'resolved').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {incidents.filter(inc => inc.status !== 'resolved').map((incident) => (
                  <div key={incident.id} className="border-l-4 border-orange-400 pl-4 py-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{incident.title}</h3>
                      <Badge className={incidentStatusColors[incident.status]}>
                        {incident.status}
                      </Badge>
                      <Badge className={severityColors[incident.severity]}>
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{incident.description}</p>
                    <div className="text-sm text-muted-foreground">
                      Started: {formatDate(incident.startedAt)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="uptime">Uptime History</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => {
                const StatusIcon = statusIcons[service.status]
                return (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={`w-6 h-6 ${
                            service.status === 'operational' ? 'text-green-600' :
                            service.status === 'degraded' ? 'text-yellow-600' :
                            service.status === 'partial_outage' ? 'text-orange-600' : 'text-red-600'
                          }`} />
                          <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        <Badge className={statusColors[service.status]}>
                          {service.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Uptime</div>
                          <div className="text-lg font-semibold text-green-600">
                            {formatUptime(service.uptime)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Response Time</div>
                          <div className={`text-lg font-semibold ${
                            service.responseTime < 200 ? 'text-green-600' :
                            service.responseTime < 500 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {formatResponseTime(service.responseTime)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                        Last checked: {formatDate(service.lastChecked)}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <div className="space-y-6">
              {incidents.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No incidents reported</h3>
                    <p className="text-muted-foreground">
                      All systems are operating normally. No incidents have been reported in the last 30 days.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                incidents.map((incident) => (
                  <Card key={incident.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{incident.title}</h3>
                          <Badge className={incidentStatusColors[incident.status]}>
                            {incident.status}
                          </Badge>
                          <Badge className={severityColors[incident.severity]}>
                            {incident.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(incident.startedAt)}
                          {incident.resolvedAt && ` - ${formatDate(incident.resolvedAt)}`}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{incident.description}</p>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Updates</h4>
                        {incident.updates.map((update, index) => (
                          <div key={index} className="flex items-start space-x-3 pl-4 border-l-2 border-muted">
                            <div className="w-2 h-2 bg-muted rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground mb-1">
                                {formatDate(update.timestamp)}
                              </div>
                              <p>{update.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground">Overall Uptime</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold mb-1">234ms</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold mb-1">12.5K</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Server className="w-6 h-6 text-orange-600" />
                    </div>
                    <Minus className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold mb-1">68%</div>
                  <div className="text-sm text-muted-foreground">Server Load</div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Key performance metrics over the selected time period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4" />
                    <p>Performance charts would be displayed here</p>
                    <p className="text-sm">Integration with monitoring service required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uptime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Uptime History</CardTitle>
                <CardDescription>
                  System uptime over the past 90 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-4">
                      <div className="w-32">
                        <div className="font-medium">{service.name}</div>
                      </div>
                      <div className="flex-1">
                        <div className="h-8 bg-muted rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-lg"
                            style={{ width: `${service.uptime}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <div className="font-semibold">{formatUptime(service.uptime)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Uptime Table */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Uptime Report</CardTitle>
                <CardDescription>
                  Detailed uptime statistics for the past 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Month</th>
                        <th className="text-center p-2">Web App</th>
                        <th className="text-center p-2">API</th>
                        <th className="text-center p-2">Database</th>
                        <th className="text-center p-2">Payments</th>
                        <th className="text-center p-2">Overall</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Jan 2024', 'Dec 2023', 'Nov 2023', 'Oct 2023'].map((month) => (
                        <tr key={month} className="border-b">
                          <td className="p-2 font-medium">{month}</td>
                          <td className="text-center p-2">99.9%</td>
                          <td className="text-center p-2">99.8%</td>
                          <td className="text-center p-2">99.95%</td>
                          <td className="text-center p-2">99.7%</td>
                          <td className="text-center p-2 font-semibold">99.84%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Subscribe to Updates */}
        <div className="mt-16 text-center bg-gradient-to-r from-[var(--sourcekom-blue)]/10 to-[var(--sourcekom-yellow)]/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Stay Informed
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to status updates and get notified about incidents and maintenance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--sourcekom-blue)] hover:bg-[var(--sourcekom-blue-light)] text-white">
              <Bell className="w-5 h-5 mr-2" />
              Subscribe to Updates
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/help/support">
                <MessageCircle className="w-5 h-5 mr-2" />
                Report an Issue
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}