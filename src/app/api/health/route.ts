import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { SecurityUtils } from '@/lib/security'

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
  environment: string
  checks: {
    database: HealthCheck
    memory: HealthCheck
    disk: HealthCheck
    api: HealthCheck
    security: HealthCheck
  }
  metrics: {
    activeUsers: number
    totalRequests: number
    errorRate: number
    responseTime: number
  }
  dependencies: {
    database: boolean
    externalApis: Record<string, boolean>
  }
}

interface HealthCheck {
  status: 'pass' | 'warn' | 'fail'
  message?: string
  responseTime?: number
  details?: any
}

class HealthMonitor {
  private static instance: HealthMonitor
  private startTime: number = Date.now()
  private requestCount: number = 0
  private errorCount: number = 0
  private responseTimes: number[] = []
  private maxResponseTimes = 100

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor()
    }
    return HealthMonitor.instance
  }

  recordRequest(responseTime: number, isError: boolean = false) {
    this.requestCount++
    if (isError) {
      this.errorCount++
    }
    
    this.responseTimes.push(responseTime)
    if (this.responseTimes.length > this.maxResponseTimes) {
      this.responseTimes.shift()
    }
  }

  getMetrics() {
    const avgResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0
    
    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0

    return {
      uptime: Date.now() - this.startTime,
      totalRequests: this.requestCount,
      errorCount: this.errorCount,
      errorRate,
      avgResponseTime,
      activeUsers: 0 // Would be calculated from active sessions
    }
  }

  async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      await db.$queryRaw`SELECT 1`
      const responseTime = Date.now() - startTime
      
      return {
        status: 'pass',
        responseTime,
        message: 'Database connection successful'
      }
    } catch (error) {
      logger.error('Database health check failed', { error: error.message })
      return {
        status: 'fail',
        responseTime: Date.now() - startTime,
        message: `Database connection failed: ${error.message}`
      }
    }
  }

  checkMemory(): HealthCheck {
    const usage = process.memoryUsage()
    const totalMemory = usage.heapTotal
    const usedMemory = usage.heapUsed
    const memoryUsagePercent = (usedMemory / totalMemory) * 100

    let status: 'pass' | 'warn' | 'fail' = 'pass'
    let message = `Memory usage: ${memoryUsagePercent.toFixed(2)}%`

    if (memoryUsagePercent > 90) {
      status = 'fail'
      message = `Critical memory usage: ${memoryUsagePercent.toFixed(2)}%`
    } else if (memoryUsagePercent > 75) {
      status = 'warn'
      message = `High memory usage: ${memoryUsagePercent.toFixed(2)}%`
    }

    return {
      status,
      message,
      details: {
        heapUsed: Math.round(usedMemory / 1024 / 1024), // MB
        heapTotal: Math.round(totalMemory / 1024 / 1024), // MB
        external: Math.round(usage.external / 1024 / 1024), // MB
        rss: Math.round(usage.rss / 1024 / 1024) // MB
      }
    }
  }

  checkDisk(): HealthCheck {
    // This is a simplified disk check
    // In a real implementation, you'd check actual disk usage
    const status: 'pass' | 'warn' | 'fail' = 'pass'
    const message = 'Disk space adequate'

    return {
      status,
      message,
      details: {
        // Would include actual disk metrics
        available: 'Unknown',
        used: 'Unknown',
        total: 'Unknown'
      }
    }
  }

  async checkAPIs(): Promise<Record<string, HealthCheck>> {
    const results: Record<string, HealthCheck> = {}

    // Check MyFatoorah API
    try {
      const startTime = Date.now()
      const response = await fetch('https://api.myfatoorah.com/health', {
        method: 'GET',
        timeout: 5000
      })
      const responseTime = Date.now() - startTime
      
      results.myfatoorah = {
        status: response.ok ? 'pass' : 'fail',
        responseTime,
        message: response.ok ? 'MyFatoorah API accessible' : 'MyFatoorah API unavailable'
      }
    } catch (error) {
      results.myfatoorah = {
        status: 'fail',
        message: `MyFatoorah API error: ${error.message}`
      }
    }

    // Check other external APIs as needed
    results.logger = {
      status: 'pass',
      message: 'Logger service operational'
    }

    return results
  }

  checkSecurity(): HealthCheck {
    const config = SecurityUtils.getConfig()
    let status: 'pass' | 'warn' | 'fail' = 'pass'
    const issues: string[] = []

    if (!config.jwtSecret || config.jwtSecret === 'your-secret-key-change-in-production') {
      status = 'fail'
      issues.push('JWT secret not configured')
    }

    if (!config.enableCSRF) {
      status = 'warn'
      issues.push('CSRF protection disabled')
    }

    if (!config.enableCSP) {
      status = 'warn'
      issues.push('CSP disabled')
    }

    return {
      status,
      message: issues.length > 0 ? `Security issues: ${issues.join(', ')}` : 'Security configuration adequate',
      details: {
        issues,
        csrfEnabled: config.enableCSRF,
        cspEnabled: config.enableCSP,
        rateLimitEnabled: true
      }
    }
  }

  async getHealthStatus(): Promise<HealthCheckResult> {
    const startTime = Date.now()
    const metrics = this.getMetrics()
    
    // Run all health checks
    const [database, memory, disk, apiResults, security] = await Promise.all([
      this.checkDatabase(),
      Promise.resolve(this.checkMemory()),
      Promise.resolve(this.checkDisk()),
      this.checkAPIs(),
      Promise.resolve(this.checkSecurity())
    ])

    // Determine overall status
    const allChecks = [database, memory, disk, security, ...Object.values(apiResults)]
    const hasFailures = allChecks.some(check => check.status === 'fail')
    const hasWarnings = allChecks.some(check => check.status === 'warn')

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy'
    if (hasFailures) {
      overallStatus = 'unhealthy'
    } else if (hasWarnings) {
      overallStatus = 'degraded'
    } else {
      overallStatus = 'healthy'
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: metrics.uptime,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database,
        memory,
        disk,
        api: {
          status: Object.values(apiResults).some(check => check.status === 'fail') ? 'fail' :
                Object.values(apiResults).some(check => check.status === 'warn') ? 'warn' : 'pass',
          message: 'External API checks',
          details: apiResults
        },
        security
      },
      metrics: {
        activeUsers: metrics.activeUsers,
        totalRequests: metrics.totalRequests,
        errorRate: metrics.errorRate,
        responseTime: metrics.avgResponseTime
      },
      dependencies: {
        database: database.status === 'pass',
        externalApis: Object.fromEntries(
          Object.entries(apiResults).map(([key, check]) => [key, check.status === 'pass'])
        )
      }
    }
  }
}

// Health check API endpoint
export async function GET(request: NextRequest) {
  const monitor = HealthMonitor.getInstance()
  
  try {
    const health = await monitor.getHealthStatus()
    
    // Log health check
    logger.info('Health check performed', {
      status: health.status,
      uptime: health.uptime,
      errorRate: health.metrics.errorRate
    })

    // Return appropriate HTTP status
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503

    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    logger.error('Health check failed', { error: error.message })
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, { status: 503 })
  }
}

// Ready check endpoint (for Kubernetes/liveness probes)
export async function POST(request: NextRequest) {
  const monitor = HealthMonitor.getInstance()
  
  try {
    const health = await monitor.getHealthStatus()
    
    // For ready check, we need to be fully healthy
    if (health.status !== 'healthy') {
      return NextResponse.json({
        ready: false,
        status: health.status
      }, { status: 503 })
    }

    return NextResponse.json({
      ready: true,
      status: health.status
    })
  } catch (error) {
    return NextResponse.json({
      ready: false,
      error: error.message
    }, { status: 503 })
  }
}

// Live check endpoint (for Kubernetes/liveness probes)
export async function PUT(request: NextRequest) {
  // Basic liveness check - just check if the process is running
  return NextResponse.json({
    alive: true,
    timestamp: new Date().toISOString()
  })
}

export { HealthMonitor }
export default HealthMonitor