'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Send,
  Bot,
  User,
  Loader2,
  ExternalLink,
  Package,
  Search,
  Heart,
  ShoppingCart,
  Star,
  HelpCircle,
  Mail,
  LogIn,
  UserPlus,
  CreditCard,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  toolInvocations?: Array<{
    toolCallId: string
    toolName: string
    args: any
    result?: any
  }>
  buttons?: Array<{
    label: string
    action: string
    variant?: 'default' | 'outline' | 'secondary'
  }>
}

interface UserState {
  id: string | null
  name: string | null
  email: string | null
  isLoggedIn: boolean
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showAuth, setShowAuth] = useState<'none' | 'login' | 'signup'>('none')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m SourceKom\'s AI assistant. 👋\n\nI can help you with:\n\n🔍 **Discover** - Search and browse resources\n💰 **Purchase** - Buy resources securely\n⭐ **Engage** - Favorite and review items\n📞 **Support** - Get help anytime\n📊 **Account** - Manage your dashboard\n\nHow can I help you today?',
      buttons: [
        { label: '🔍 Search Resources', action: 'search', variant: 'default' },
        { label: '💰 Browse Products', action: 'browse', variant: 'default' },
        { label: '⭐ My Favorites', action: 'favorites', variant: 'outline' },
        { label: '📊 My Dashboard', action: 'dashboard', variant: 'outline' },
      ],
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userState, setUserState] = useState<UserState>({
    id: null,
    name: null,
    email: null,
    isLoggedIn: false,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    // Check for logged-in user
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData)
        setUserState({
          id: user.id,
          name: user.name || user.email,
          email: user.email,
          isLoggedIn: true,
        })
        
        // Update welcome message if logged in
        if (messages.length === 1 && messages[0].id === '1') {
          setMessages([{
            ...messages[0],
            content: `Welcome back, ${user.name || 'there'}! 👋\n\nI'm SourceKom's AI assistant. I can help you with:\n\n🔍 **Discover** - Search and browse resources\n💰 **Purchase** - Buy resources securely\n⭐ **Engage** - Favorite and review items\n📞 **Support** - Get help anytime\n📊 **Account** - Manage your dashboard\n\nHow can I help you today?`,
            buttons: [
              { label: '🔍 Search Resources', action: 'search', variant: 'default' },
              { label: '💰 Browse Products', action: 'browse', variant: 'default' },
              { label: '⭐ My Favorites', action: 'favorites', variant: 'outline' },
              { label: '📊 My Dashboard', action: 'dashboard', variant: 'outline' },
            ],
          }])
        }
      } catch (e) {
        // Invalid user data
      }
    }
  }, [])

  const handleAuth = async (mode: 'login' | 'signup') => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(mode === 'signup' && { name: authForm.name }),
          email: authForm.email,
          password: authForm.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)

      // Update user state
      setUserState({
        id: data.user.id,
        name: data.user.name || data.user.email,
        email: data.user.email,
        isLoggedIn: true,
      })

      // Close auth form and add success message
      setShowAuth('none')
      setAuthForm({ name: '', email: '', password: '' })
      
      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ ${mode === 'login' ? 'Welcome back' : 'Welcome'}, ${data.user.name || data.user.email}! You're now logged in. What would you like to do?`,
        timestamp: new Date(),
        buttons: [
          { label: '🔍 Search Resources', action: 'search', variant: 'default' },
          { label: '💰 Browse Products', action: 'browse', variant: 'default' },
          { label: '📊 My Dashboard', action: 'dashboard', variant: 'outline' },
        ],
      }
      
      setMessages(prev => [...prev, successMessage])
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUserState({ id: null, name: null, email: null, isLoggedIn: false })
    
    const logoutMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'You have been logged out. Is there anything else I can help you with?',
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, logoutMessage])
  }

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'search':
        setInput('search for resources')
        setTimeout(() => inputRef.current?.focus(), 100)
        break
      case 'browse':
        setInput('show me categories')
        setTimeout(() => inputRef.current?.focus(), 100)
        break
      case 'favorites':
        if (userState.isLoggedIn) {
          setInput('show my favorites')
        } else {
          setShowAuth('login')
          addMessage('assistant', 'To view your favorites, please log in first. Use the form below:', [])
        }
        break
      case 'dashboard':
        if (userState.isLoggedIn) {
          setInput('show my dashboard')
        } else {
          setShowAuth('login')
          addMessage('assistant', 'To access your dashboard, please log in first. Use the form below:', [])
        }
        break
      case 'login':
        setShowAuth('login')
        setAuthMode('login')
        break
      case 'signup':
        setShowAuth('signup')
        setAuthMode('signup')
        break
      case 'purchase':
        if (userState.isLoggedIn) {
          setInput('help me purchase a resource')
        } else {
          setShowAuth('login')
          addMessage('assistant', 'To purchase resources, please log in first. Use the form below:', [])
        }
        break
      case 'support':
        setInput('I need help')
        setTimeout(() => inputRef.current?.focus(), 100)
        break
      case 'review':
        if (userState.isLoggedIn) {
          setInput('I want to review a resource')
        } else {
          setShowAuth('login')
          addMessage('assistant', 'To submit reviews, please log in first. Use the form below:', [])
        }
        break
      default:
        setInput(action)
        setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const addMessage = (role: 'user' | 'assistant' | 'system', content: string, buttons?: Message['buttons']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      buttons,
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = addMessage('user', input.trim())
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          messages: conversationHistory,
          userId: userState.id 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      let toolInvocations: any[] = []

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const data = JSON.parse(line.slice(2))
                
                if (data.type === 'text-delta' && data.textDelta) {
                  assistantContent += data.textDelta
                  
                  setMessages(prev => {
                    const updated = [...prev]
                    const lastMsg = updated[updated.length - 1]
                    if (lastMsg?.role === 'assistant' && lastMsg.id === userMessage.id + '_response') {
                      updated[updated.length - 1] = { ...lastMsg, content: assistantContent }
                      return updated
                    }
                    return updated
                  })
                }
                
                if (data.type === 'tool-call') {
                  toolInvocations.push({
                    toolCallId: data.toolCallId,
                    toolName: data.toolName,
                    args: data.args
                  })
                }
                
                if (data.type === 'tool-result') {
                  const invocation = toolInvocations.find(t => t.toolCallId === data.toolCallId)
                  if (invocation) {
                    invocation.result = data.result
                  }
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setIsTyping(false)
      
      // Determine buttons based on response content
      const buttons: Message['buttons'] = []
      if (assistantContent.toLowerCase().includes('resource') || assistantContent.toLowerCase().includes('found')) {
        buttons.push({ label: '🔍 Search More', action: 'search', variant: 'outline' })
      }
      if (!userState.isLoggedIn && (assistantContent.toLowerCase().includes('purchase') || assistantContent.toLowerCase().includes('buy'))) {
        buttons.push({ label: '🔐 Log In', action: 'login', variant: 'default' })
      }
      if (userState.isLoggedIn) {
        buttons.push({ label: '📊 Dashboard', action: 'dashboard', variant: 'outline' })
      }
      
      const assistantMessage = addMessage('assistant', assistantContent || 'I apologize, but I encountered an error. Please try again.', buttons)
      
      if (toolInvocations.length > 0) {
        setMessages(prev => {
          const updated = [...prev]
          const lastIdx = updated.length - 1
          if (updated[lastIdx].id === assistantMessage.id) {
            updated[lastIdx] = { ...updated[lastIdx], toolInvocations }
          }
          return updated
        })
      }

    } catch (error) {
      setIsTyping(false)
      addMessage('assistant', 'I apologize, but I\'m having trouble connecting right now. Please try again or contact us directly.', [
        { label: '📧 Contact Support', action: 'support', variant: 'default' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const renderToolResults = (toolInvocations?: Array<any>) => {
    if (!toolInvocations || toolInvocations.length === 0) return null

    return (
      <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {toolInvocations.map((invocation, idx) => {
          if (!invocation.result) return null

          const result = invocation.result

          if ((invocation.toolName === 'searchResources' || 
               invocation.toolName === 'listResourcesByCategory' ||
               invocation.toolName === 'getFeaturedResources') && result.resources) {
            return (
              <div key={idx} className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-3 space-y-2 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  <Package className="w-4 h-4" />
                  Found {result.count} resource{result.count !== 1 ? 's' : ''}
                </div>
                <div className="space-y-2">
                  {result.resources.slice(0, 5).map((resource: any) => (
                    <Link
                      key={resource.id}
                      href={resource.url}
                      className="block p-3 bg-background rounded-lg border hover:border-emerald-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate group-hover:text-emerald-600 transition-colors">{resource.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {resource.description}
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
                            <span className="text-muted-foreground font-medium">
                              {resource.isFree ? 'Free' : `SAR ${resource.price}`}
                            </span>
                            {resource.rating > 0 && (
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-3 h-3 fill-amber-500" />
                                <span className="text-xs">{resource.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </Link>
                  ))}
                  {result.count > 5 && (
                    <div className="text-xs text-muted-foreground text-center pt-1">
                      +{result.count - 5} more resource{result.count - 5 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            )
          }

          if (invocation.toolName === 'listCategories' && result.categories) {
            return (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 text-sm font-semibold mb-3 text-blue-700 dark:text-blue-300">
                  <Package className="w-4 h-4" />
                  {result.count} categor{result.count !== 1 ? 'ies' : 'y'} available
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={cat.url}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-background rounded-lg border hover:border-blue-500 hover:shadow-sm transition-all text-xs font-medium"
                    >
                      {cat.name}
                      <Badge variant="secondary" className="ml-1 text-xs">{cat.resourceCount}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )
          }

          if (invocation.toolName === 'getResourceDetails' && result.resource) {
            const res = result.resource
            return (
              <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <Link href={res.url} className="block">
                  <div className="font-semibold text-sm mb-1 text-purple-700 dark:text-purple-300">{res.title}</div>
                  <div className="text-xs text-muted-foreground mb-2">{res.description}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary">{res.category}</Badge>
                    <span className="font-medium">{res.isFree ? 'Free' : `SAR ${res.price}`}</span>
                    {res.rating > 0 && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{res.rating}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            )
          }

          return null
        })}
      </div>
    )
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 300)
        }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all hover:scale-110 active:scale-95"
        size="icon"
        aria-label="Open chat"
      >
        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
        <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </Button>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] bg-background border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4',
        isMinimized ? 'h-16' : 'h-[calc(100vh-8rem)] sm:h-[650px] sm:max-h-[calc(100vh-8rem)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="h-5 w-5" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <div className="font-semibold text-base">SourceKom Assistant</div>
            {userState.isLoggedIn && (
              <div className="text-xs text-emerald-100">{userState.name}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {userState.isLoggedIn && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 text-xs hover:bg-emerald-700"
            >
              Logout
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-emerald-700"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-emerald-700"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                  idx === messages.length - 1 && 'delay-100'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 max-w-[85%] shadow-sm transition-all',
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white'
                      : 'bg-muted border border-border/50'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  {renderToolResults(message.toolInvocations)}
                  {message.buttons && message.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.buttons.map((btn, btnIdx) => (
                        <Button
                          key={btnIdx}
                          variant={btn.variant || 'default'}
                          size="sm"
                          onClick={() => handleButtonClick(btn.action)}
                          className="text-xs h-8"
                        >
                          {btn.label}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {(isLoading || isTyping) && (
              <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3 border border-border/50 shadow-sm">
                  <div className="flex gap-1.5 px-1 py-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Auth Form */}
          {showAuth !== 'none' && (
            <div className="border-t p-4 bg-muted/50 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">
                  {authMode === 'login' ? 'Log In' : 'Sign Up'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAuth('none')
                    setAuthError(null)
                  }}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {authError && (
                <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">
                  {authError}
                </div>
              )}
              
              <div className="space-y-2">
                {authMode === 'signup' && (
                  <Input
                    placeholder="Full Name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="h-9 text-sm"
                    disabled={authLoading}
                  />
                )}
                <Input
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="h-9 text-sm"
                  disabled={authLoading}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="h-9 text-sm"
                  disabled={authLoading}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAuth(authMode)}
                    disabled={authLoading || !authForm.email || !authForm.password || (authMode === 'signup' && !authForm.name)}
                    className="flex-1 h-9 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {authLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      authMode === 'login' ? 'Log In' : 'Sign Up'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAuthMode(authMode === 'login' ? 'signup' : 'login')
                      setAuthError(null)
                    }}
                    className="h-9 text-xs"
                  >
                    {authMode === 'login' ? 'Sign Up' : 'Log In'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions (when not showing auth) */}
          {showAuth === 'none' && !userState.isLoggedIn && (
            <div className="border-t p-3 bg-muted/30">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleButtonClick('login')}
                  className="flex-1 h-8 text-xs"
                >
                  <LogIn className="w-3 h-3 mr-1" />
                  Log In
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleButtonClick('signup')}
                  className="flex-1 h-8 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Sign Up
                </Button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 h-10 text-sm rounded-xl"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              💡 Try: "search templates" • "show categories" • "help me purchase"
            </p>
          </div>
        </>
      )}
    </div>
  )
}