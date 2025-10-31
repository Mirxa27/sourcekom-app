'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Download, 
  Eye,
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Building,
  Truck,
  FileText
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { cn } from '@/lib/utils'

const statStyles = {
  success: {
    iconBg: 'bg-state-success/10',
    iconText: 'text-state-success'
  },
  info: {
    iconBg: 'bg-state-info/10',
    iconText: 'text-state-info'
  },
  highlight: {
    iconBg: 'bg-brand-highlight/15',
    iconText: 'text-brand-highlight'
  },
  warning: {
    iconBg: 'bg-state-warning/10',
    iconText: 'text-state-warning'
  }
} as const

type StatTone = keyof typeof statStyles

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Revenue",
      value: analytics?.revenue || "SAR 0",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      tone: "success"
    },
    {
      title: "Active Resources",
      value: analytics?.activeResources || 0,
      change: "+8.2%",
      trend: "up", 
      icon: Building,
      tone: "info"
    },
    {
      title: "Total Downloads",
      value: analytics?.downloads?.toLocaleString() || "0",
      change: "+23.1%",
      trend: "up",
      icon: Download,
      tone: "highlight"
    },
    {
      title: "Active Users",
      value: analytics?.activeUsers || 0,
      change: "+5.4%",
      trend: "up",
      icon: Users,
      tone: "warning"
    }
  ] as const

  const categoryPerformance = analytics?.categoryPerformance || [
    { name: "Office Space", revenue: "SAR 0", downloads: 0, growth: "+0%" },
    { name: "Equipment", revenue: "SAR 0", downloads: 0, growth: "+0%" }
  ]

  const recentActivity = analytics?.recentActivity || []

  const topPerformingResources = analytics?.topPerformingResources || []

  // Recharts requires actual color values, not CSS variables
  const CHART_COLORS = [
    '#10b981', // success - green
    '#3b82f6', // info - blue
    '#0fa968', // brand-highlight - teal
    '#f59e0b', // warning - amber
    '#ef4444'  // error - red
  ] as const

  const formatCurrency = (value: number) => {
    return `SAR ${value.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your resource performance and business metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            const tone = statStyles[stat.tone as StatTone]
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", tone.iconBg)}>
                    <IconComponent className={cn("w-4 h-4", tone.iconText)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {stat.trend === "up" ? (
                      <ArrowUp className="w-3 h-3 text-state-success" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-state-error" />
                    )}
                    <span className={stat.trend === "up" ? "text-state-success" : "text-state-error"}>
                      {stat.change}
                    </span>
                    <span>from last period</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

          <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Daily revenue breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.revenueData && analytics.revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={256}>
                      <LineChart data={analytics.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return `${date.getMonth() + 1}/${date.getDate()}`
                          }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `SAR ${value}`}
                        />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          labelFormatter={(value) => {
                            const date = new Date(value)
                            return date.toLocaleDateString()
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="var(--success)" 
                          strokeWidth={2}
                          name="Revenue"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <BarChart3 className="w-8 h-8 mr-2" />
                      No revenue data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest downloads and uploads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity: any) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'download' ? 'bg-state-success/10' : 'bg-state-info/10'
                        }`}>
                          {activity.type === 'download' ? (
                            <Download className="w-4 h-4 text-state-success" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-state-info" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.resource}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user || 'Unknown'} • {activity.time}
                          </p>
                        </div>
                        {activity.amount && activity.amount !== "-" && (
                          <Badge variant="secondary">{activity.amount}</Badge>
                        )}
                      </div>
                    ))}
                    {recentActivity.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>
                  How different resource categories are performing
                </CardDescription>
              </CardHeader>
                <CardContent>
                  {analytics?.categoryPerformance && analytics.categoryPerformance.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.categoryPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="downloads" fill="var(--success)" name="Downloads" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="space-y-4">
                      {categoryPerformance.map((category: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-state-success/10 rounded-lg flex items-center justify-center">
                              <Building className="w-5 h-5 text-state-success" />
                            </div>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {category.downloads} downloads
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{category.revenue}</p>
                            <p className="text-sm text-state-success">{category.growth}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>
                    New user registration trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.userGrowthData && analytics.userGrowthData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={256}>
                      <LineChart data={analytics.userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return `${date.getMonth() + 1}/${date.getDate()}`
                          }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          labelFormatter={(value) => {
                            const date = new Date(value)
                            return date.toLocaleDateString()
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="var(--info)" 
                          strokeWidth={2}
                          name="New Users"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <TrendingUp className="w-8 h-8 mr-2" />
                      No user growth data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>
                    How users interact with your resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Daily Active Users</span>
                      <Badge>342</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Session Duration</span>
                      <Badge>8m 24s</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Resources per User</span>
                      <Badge>3.2</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <Badge>12.5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>
                    Revenue by category and source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.categoryPerformance && analytics.categoryPerformance.length > 0 ? (
                    <ResponsiveContainer width="100%" height={256}>
                      <PieChart>
                        <Pie
                          data={analytics.categoryPerformance.map((cat: any) => ({
                            name: cat.name,
                            value: parseFloat(cat.revenue.replace(/[^0-9.]/g, '')) || 0
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="var(--brand-highlight)"
                          dataKey="value"
                        >
                          {analytics.categoryPerformance.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <DollarSign className="w-8 h-8 mr-2" />
                      No revenue breakdown data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Resources</CardTitle>
                  <CardDescription>
                    Highest revenue-generating resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {topPerformingResources.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topPerformingResources} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis 
                          dataKey="title" 
                          type="category" 
                          tick={{ fontSize: 12 }}
                          width={150}
                        />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="revenue" fill="var(--success)" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="space-y-4">
                      {topPerformingResources.map((resource: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="truncate">{resource.title}</span>
                          <Badge>{resource.revenueFormatted || resource.revenue}</Badge>
                        </div>
                      ))}
                      {topPerformingResources.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No data available</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
