'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Settings, 
  Users, 
  Package, 
  FileText, 
  BarChart3, 
  Shield,
  LogOut,
  Home,
  CreditCard,
  Mail,
  Globe,
  Key,
  Bell,
  FolderTree,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    fetchAdminStats(token)
  }, [router])

  const fetchAdminStats = async (token: string) => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">SourceKom Admin</span>
              </Link>
              <Badge variant="destructive">Admin Panel</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-6">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Package className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="w-4 h-4 mr-2" />
              CMS
            </TabsTrigger>
            <TabsTrigger value="categories">
              <FolderTree className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.stats?.growth?.newUsers30d || 0} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.stats?.totalResources || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.stats?.growth?.newResources30d || 0} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">SAR {stats?.stats?.totalRevenue?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    SAR {stats?.stats?.growth?.revenue30d?.toLocaleString() || 0} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tickets</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.stats?.pendingTickets || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.stats?.totalSupportTickets || 0} total tickets
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recent?.users?.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name || 'No name'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'outline'}>
                          {user.role}
                        </Badge>
                      </div>
                    )) || <p className="text-muted-foreground">No recent users</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Purchases</CardTitle>
                  <CardDescription>Latest completed purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recent?.purchases?.map((purchase: any) => (
                      <div key={purchase.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{purchase.resource.title}</p>
                          <p className="text-sm text-muted-foreground">{purchase.user.name || purchase.user.email}</p>
                        </div>
                        <Badge variant="outline">SAR {purchase.amount}</Badge>
                      </div>
                    )) || <p className="text-muted-foreground">No recent purchases</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <AdminUsersPanel />
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <AdminResourcesPanel />
          </TabsContent>

          {/* CMS Tab */}
          <TabsContent value="content">
            <AdminCMSPanel />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <AdminCategoriesPanel />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <AdminSettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Admin Users Panel Component
function AdminUsersPanel() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')

  useEffect(() => {
    fetchUsers()
  }, [search, roleFilter])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (roleFilter) params.append('role', roleFilter)

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage platform users and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="CREATOR">Creator</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.name || 'No name'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'outline'}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Admin Resources Panel Component
function AdminResourcesPanel() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/resources', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Management</CardTitle>
        <CardDescription>Manage all platform resources</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{resource.title}</p>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={resource.isPublished ? 'default' : 'secondary'}>
                      {resource.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant={resource.isFeatured ? 'default' : 'outline'}>
                      {resource.isFeatured ? 'Featured' : 'Regular'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {resource.isFree ? 'Free' : `SAR ${resource.price}`}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Admin CMS Panel Component
function AdminCMSPanel() {
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setContents(data.contents || [])
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Content Management System</CardTitle>
            <CardDescription>Manage pages, posts, and announcements</CardDescription>
          </div>
          <Button onClick={() => setShowEditor(true)}>
            <FileText className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {contents.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{content.title}</p>
                  <p className="text-sm text-muted-foreground">{content.excerpt || 'No excerpt'}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{content.type}</Badge>
                    <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                      {content.status}
                    </Badge>
                    {content.featured && <Badge>Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Admin Categories Panel Component
function AdminCategoriesPanel() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
        <CardDescription>Manage resource categories</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{category.description || 'No description'}</p>
                  <Badge variant={category.isActive ? 'default' : 'secondary'} className="mt-2">
                    {category.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-muted-foreground ml-2">
                    {category._count?.resources || 0} resources
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Admin Settings Panel Component
function AdminSettingsPanel() {
  return <AdminSettingsContent />
}

// Admin Settings Content Component
function AdminSettingsContent() {
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('payment')

  useEffect(() => {
    fetchSettings()
  }, [activeCategory])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/settings?category=${activeCategory}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || [])
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSetting = async (key: string, value: string, category: string, isEncrypted: boolean = false) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
          value,
          category,
          isEncrypted
        })
      })

      if (response.ok) {
        fetchSettings()
        alert('Setting saved successfully')
      }
    } catch (error) {
      console.error('Failed to save setting:', error)
      alert('Failed to save setting')
    }
  }

  const categories = [
    { id: 'payment', name: 'Payment Gateway', icon: CreditCard },
    { id: 'email', name: 'Email Service', icon: Mail },
    { id: 'sms', name: 'SMS Service', icon: Bell },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'integrations', name: 'Integrations', icon: Globe },
    { id: 'general', name: 'General', icon: Settings }
  ]

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            onClick={() => setActiveCategory(cat.id)}
            className="flex items-center gap-2"
          >
            <cat.icon className="w-4 h-4" />
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Settings Forms */}
      {activeCategory === 'payment' && (
        <PaymentSettingsForm onSave={saveSetting} />
      )}
      {activeCategory === 'email' && (
        <EmailSettingsForm onSave={saveSetting} />
      )}
      {activeCategory === 'sms' && (
        <SMSSettingsForm onSave={saveSetting} />
      )}
      {activeCategory === 'analytics' && (
        <AnalyticsSettingsForm onSave={saveSetting} />
      )}
      {activeCategory === 'integrations' && (
        <IntegrationsSettingsForm onSave={saveSetting} />
      )}
      {activeCategory === 'general' && (
        <GeneralSettingsForm onSave={saveSetting} />
      )}
    </div>
  )
}

// Payment Settings Form
function PaymentSettingsForm({ onSave }: { onSave: (key: string, value: string, category: string, isEncrypted: boolean) => void }) {
  const [formData, setFormData] = useState({
    myfatoorah_api_key: '',
    myfatoorah_test_mode: 'true',
    myfatoorah_base_url: 'https://apitest.myfatoorah.com',
    currency: 'SAR',
    vat_rate: '15'
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>MyFatoorah Payment Gateway</CardTitle>
        <CardDescription>Configure MyFatoorah payment gateway settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>API Key</Label>
          <Input
            type="password"
            value={formData.myfatoorah_api_key}
            onChange={(e) => setFormData({ ...formData, myfatoorah_api_key: e.target.value })}
            placeholder="Enter MyFatoorah API Key"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Test Mode</Label>
          <select
            value={formData.myfatoorah_test_mode}
            onChange={(e) => setFormData({ ...formData, myfatoorah_test_mode: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background mt-2"
          >
            <option value="true">Enabled (Test Mode)</option>
            <option value="false">Disabled (Production)</option>
          </select>
        </div>
        <div>
          <Label>Base URL</Label>
          <Input
            type="text"
            value={formData.myfatoorah_base_url}
            onChange={(e) => setFormData({ ...formData, myfatoorah_base_url: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Currency</Label>
          <Input
            type="text"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>VAT Rate (%)</Label>
          <Input
            type="number"
            value={formData.vat_rate}
            onChange={(e) => setFormData({ ...formData, vat_rate: e.target.value })}
            className="mt-2"
          />
        </div>
        <Button onClick={() => {
          onSave('myfatoorah_api_key', formData.myfatoorah_api_key, 'payment', true)
          onSave('myfatoorah_test_mode', formData.myfatoorah_test_mode, 'payment', false)
          onSave('myfatoorah_base_url', formData.myfatoorah_base_url, 'payment', false)
          onSave('currency', formData.currency, 'payment', false)
          onSave('vat_rate', formData.vat_rate, 'payment', false)
        }}>
          Save Payment Settings
        </Button>
      </CardContent>
    </Card>
  )
}

// Email Settings Form
function EmailSettingsForm({ onSave }: { onSave: (key: string, value: string, category: string, isEncrypted: boolean) => void }) {
  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    from_email: '',
    from_name: 'SourceKom'
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Service Configuration</CardTitle>
        <CardDescription>Configure SMTP settings for email notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>SMTP Host</Label>
          <Input
            type="text"
            value={formData.smtp_host}
            onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
            placeholder="smtp.example.com"
            className="mt-2"
          />
        </div>
        <div>
          <Label>SMTP Port</Label>
          <Input
            type="number"
            value={formData.smtp_port}
            onChange={(e) => setFormData({ ...formData, smtp_port: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>SMTP Username</Label>
          <Input
            type="text"
            value={formData.smtp_user}
            onChange={(e) => setFormData({ ...formData, smtp_user: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>SMTP Password</Label>
          <Input
            type="password"
            value={formData.smtp_password}
            onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>From Email</Label>
          <Input
            type="email"
            value={formData.from_email}
            onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>From Name</Label>
          <Input
            type="text"
            value={formData.from_name}
            onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
            className="mt-2"
          />
        </div>
        <Button onClick={() => {
          onSave('smtp_host', formData.smtp_host, 'email', false)
          onSave('smtp_port', formData.smtp_port, 'email', false)
          onSave('smtp_user', formData.smtp_user, 'email', false)
          onSave('smtp_password', formData.smtp_password, 'email', true)
          onSave('from_email', formData.from_email, 'email', false)
          onSave('from_name', formData.from_name, 'email', false)
        }}>
          Save Email Settings
        </Button>
      </CardContent>
    </Card>
  )
}

// SMS Settings Form
function SMSSettingsForm({ onSave }: { onSave: (key: string, value: string, category: string, isEncrypted: boolean) => void }) {
  const [formData, setFormData] = useState({
    sms_provider: '',
    sms_api_key: '',
    sms_sender_id: ''
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Service Configuration</CardTitle>
        <CardDescription>Configure SMS service for notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>SMS Provider</Label>
          <select
            value={formData.sms_provider}
            onChange={(e) => setFormData({ ...formData, sms_provider: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background mt-2"
          >
            <option value="">Select Provider</option>
            <option value="twilio">Twilio</option>
            <option value="nexmo">Vonage (Nexmo)</option>
            <option value="custom">Custom API</option>
          </select>
        </div>
        <div>
          <Label>API Key</Label>
          <Input
            type="password"
            value={formData.sms_api_key}
            onChange={(e) => setFormData({ ...formData, sms_api_key: e.target.value })}
            placeholder="Enter SMS API Key"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Sender ID</Label>
          <Input
            type="text"
            value={formData.sms_sender_id}
            onChange={(e) => setFormData({ ...formData, sms_sender_id: e.target.value })}
            placeholder="SourceKom"
            className="mt-2"
          />
        </div>
        <Button onClick={() => {
          onSave('sms_provider', formData.sms_provider, 'sms', false)
          onSave('sms_api_key', formData.sms_api_key, 'sms', true)
          onSave('sms_sender_id', formData.sms_sender_id, 'sms', false)
        }}>
          Save SMS Settings
        </Button>
      </CardContent>
    </Card>
  )
}

// Analytics Settings Form
function AnalyticsSettingsForm({ onSave }: { onSave: (key: string, value: string, category: string, isEncrypted: boolean) => void }) {
  const [formData, setFormData] = useState({
    google_analytics_id: '',
    google_tag_manager_id: '',
    facebook_pixel_id: ''
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Configuration</CardTitle>
        <CardDescription>Configure analytics and tracking services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Google Analytics ID</Label>
          <Input
            type="text"
            value={formData.google_analytics_id}
            onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
            placeholder="G-XXXXXXXXXX"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Google Tag Manager ID</Label>
          <Input
            type="text"
            value={formData.google_tag_manager_id}
            onChange={(e) => setFormData({ ...formData, google_tag_manager_id: e.target.value })}
            placeholder="GTM-XXXXXXX"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Facebook Pixel ID</Label>
          <Input
            type="text"
            value={formData.facebook_pixel_id}
            onChange={(e) => setFormData({ ...formData, facebook_pixel_id: e.target.value })}
            placeholder="Enter Pixel ID"
            className="mt-2"
          />
        </div>
        <Button onClick={() => {
          onSave('google_analytics_id', formData.google_analytics_id, 'analytics', false)
          onSave('google_tag_manager_id', formData.google_tag_manager_id, 'analytics', false)
          onSave('facebook_pixel_id', formData.facebook_pixel_id, 'analytics', false)
        }}>
          Save Analytics Settings
        </Button>
      </CardContent>
    </Card>
  )
}

// Integrations Settings Form
function IntegrationsSettingsForm({ onSave }: { onSave: (key: string, value: string, category: string, isEncrypted: boolean) => void }) {
  const [formData, setFormData] = useState({
    stripe_api_key: '',
    paypal_client_id: '',
    social_login_enabled: 'false'
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Third-Party Integrations</CardTitle>
        <CardDescription>Configure additional third-party services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Stripe API Key (Optional)</Label>
          <Input
            type="password"
            value={formData.stripe_api_key}
            onChange={(e) => setFormData({ ...formData, stripe_api_key: e.target.value })}
            placeholder="sk_live_..."
            className="mt-2"
          />
        </div>
        <div>
          <Label>PayPal Client ID (Optional)</Label>
          <Input
            type="text"
            value={formData.paypal_client_id}
            onChange={(e) => setFormData({ ...formData, paypal_client_id: e.target.value })}
            placeholder="Enter PayPal Client ID"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Social Login</Label>
          <select
            value={formData.social_login_enabled}
            onChange={(e) => setFormData({ ...formData, social_login_enabled: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background mt-2"
          >
            <option value="false">Disabled</option>
            <option value="true">Enabled</option>
          </select>
        </div>
        <Button onClick={() => {
          onSave('stripe_api_key', formData.stripe_api_key, 'integrations', true)
          onSave('paypal_client_id', formData.paypal_client_id, 'integrations', true)
          onSave('social_login_enabled', formData.social_login_enabled, 'integrations', false)
        }}>
          Save Integration Settings
        </Button>
      </CardContent>
    </Card>
  )
}

// General Settings Form
function GeneralSettingsForm({ onSave }: { onSave: (key: string, value: string, category: string, isEncrypted: boolean) => void }) {
  const [formData, setFormData] = useState({
    site_name: 'SourceKom',
    site_url: '',
    maintenance_mode: 'false',
    registration_enabled: 'true'
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure general platform settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Site Name</Label>
          <Input
            type="text"
            value={formData.site_name}
            onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Site URL</Label>
          <Input
            type="url"
            value={formData.site_url}
            onChange={(e) => setFormData({ ...formData, site_url: e.target.value })}
            placeholder="https://sourcekom.com"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Maintenance Mode</Label>
          <select
            value={formData.maintenance_mode}
            onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background mt-2"
          >
            <option value="false">Disabled</option>
            <option value="true">Enabled</option>
          </select>
        </div>
        <div>
          <Label>Registration</Label>
          <select
            value={formData.registration_enabled}
            onChange={(e) => setFormData({ ...formData, registration_enabled: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background mt-2"
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <Button onClick={() => {
          onSave('site_name', formData.site_name, 'general', false)
          onSave('site_url', formData.site_url, 'general', false)
          onSave('maintenance_mode', formData.maintenance_mode, 'general', false)
          onSave('registration_enabled', formData.registration_enabled, 'general', false)
        }}>
          Save General Settings
        </Button>
      </CardContent>
    </Card>
  )
}
