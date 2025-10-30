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
  FileText,
  Settings
} from 'lucide-react'
import Link from 'next/link'

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
      value: analytics?.revenue || "SAR 458K",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "emerald"
    },
    {
      title: "Active Resources",
      value: analytics?.activeResources || 247,
      change: "+8.2%",
      trend: "up", 
      icon: Building,
      color: "blue"
    },
    {
      title: "Total Downloads",
      value: analytics?.downloads || "1,234",
      change: "+23.1%",
      trend: "up",
      icon: Download,
      color: "purple"
    },
    {
      title: "Active Users",
      value: analytics?.activeUsers || "892",
      change: "+5.4%",
      trend: "up",
      icon: Users,
      color: "orange"
    }
  ]

  const categoryPerformance = [
    { name: "Office Space", revenue: "SAR 125K", downloads: 342, growth: "+15%" },
    { name: "Equipment", revenue: "SAR 98K", downloads: 256, growth: "+8%" },
    { name: "Personnel", revenue: "SAR 87K", downloads: 189, growth: "+12%" },
    { name: "Storage", revenue: "SAR 76K", downloads: 145, growth: "+6%" },
    { name: "Vehicles", revenue: "SAR 52K", downloads: 98, growth: "+18%" },
    { name: "Legal Services", revenue: "SAR 20K", downloads: 67, growth: "+22%" }
  ]

  const recentActivity = [
    { id: 1, type: "download", resource: "Office Space - Riyadh Plaza", user: "Ahmed Company", time: "2 hours ago", amount: "SAR 2,500" },
    { id: 2, type: "upload", resource: "Warehouse Equipment Set", user: "Logistics Pro", time: "4 hours ago", amount: "-" },
    { id: 3, type: "download", resource: "Legal Contract Template", user: "StartUp Hub", time: "6 hours ago", amount: "SAR 500" },
    { id: 4, type: "download", resource: "Delivery Truck Rental", user: "FastMove Co", time: "8 hours ago", amount: "SAR 1,200" },
    { id: 5, type: "upload", resource: "Meeting Room Package", user: "Business Center", time: "12 hours ago", amount: "-" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SourceKom</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link href="/legal" className="text-muted-foreground hover:text-foreground transition-colors">
                Legal Services
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <Settings className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/upload">Upload Resource</Link>
            </Button>
          </div>
        </div>
      </div>

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
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 text-${stat.color}-600`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {stat.trend === "up" ? (
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={stat.trend === "up" ? "text-emerald-600" : "text-red-600"}>
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
                    Monthly revenue breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="w-8 h-8 mr-2" />
                    Revenue chart visualization
                  </div>
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
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'download' ? 'bg-emerald-100' : 'bg-blue-100'
                        }`}>
                          {activity.type === 'download' ? (
                            <Download className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.resource}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                        {activity.amount !== "-" && (
                          <Badge variant="secondary">{activity.amount}</Badge>
                        )}
                      </div>
                    ))}
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
                <div className="space-y-4">
                  {categoryPerformance.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-emerald-600" />
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
                        <p className="text-sm text-emerald-600">{category.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <TrendingUp className="w-8 h-8 mr-2" />
                    User growth chart
                  </div>
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
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <DollarSign className="w-8 h-8 mr-2" />
                    Revenue breakdown chart
                  </div>
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
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Premium Office Space</span>
                      <Badge>SAR 45K</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Equipment Package Pro</span>
                      <Badge>SAR 32K</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Legal Consultation Bundle</span>
                      <Badge>SAR 28K</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Warehouse Solutions</span>
                      <Badge>SAR 24K</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}