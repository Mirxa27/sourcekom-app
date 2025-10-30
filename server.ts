// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from './src/lib/socket';
import { SecurityUtils } from './src/lib/security';
import { logger } from './src/lib/logger';
import { HealthMonitor } from './src/app/api/health/route';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = parseInt(process.env.PORT || '3000');
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    logger.info('Starting SourceKom server', { 
      environment: process.env.NODE_ENV, 
      port: currentPort,
      hostname 
    });

    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();
    const healthMonitor = HealthMonitor.getInstance();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      const startTime = Date.now();
      
      // Add security headers
      const securityHeaders = SecurityUtils.getSecurityHeaders();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      // Rate limiting
      const clientIP = SecurityUtils.getClientIP(req);
      const rateLimitResult = SecurityUtils.checkRateLimit(clientIP);
      
      if (!rateLimitResult.allowed) {
        logger.securityEvent('Rate limit exceeded', 'medium', {
          ip: clientIP,
          url: req.url,
          userAgent: req.headers['user-agent']
        });
        
        res.writeHead(429, { 
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString()
        });
        res.end(JSON.stringify({ 
          error: 'Too many requests',
          retryAfter: rateLimitResult.resetTime 
        }));
        return;
      }

      // CORS handling
      const origin = req.headers.origin;
      if (origin && !SecurityUtils.validateOrigin(origin)) {
        logger.securityEvent('Invalid origin', 'medium', {
          origin,
          ip: clientIP,
          url: req.url
        });
        
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Forbidden origin' }));
        return;
      }

      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }

      // Log request
      logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: clientIP,
        userAgent: req.headers['user-agent'],
        origin
      });

      // Handle the request
      const originalEnd = res.end;
      res.end = function(chunk?: any, encoding?: any) {
        const responseTime = Date.now() - startTime;
        const isError = res.statusCode >= 400;
        
        healthMonitor.recordRequest(responseTime, isError);
        
        logger.info('Request completed', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime,
          isError
        });
        
        originalEnd.call(this, chunk, encoding);
      };

      handle(req, res);
    });

    // Setup Socket.IO with security
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: SecurityUtils.getConfig().allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      maxHttpBufferSize: 1e8, // 100 MB
      pingTimeout: 60000,
      pingInterval: 25000
    });

    setupSocket(io);

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        
        // Close Socket.IO
        io.close(() => {
          logger.info('Socket.IO server closed');
          process.exit(0);
        });
      });

      // Force close after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', { 
        error: error.message, 
        stack: error.stack 
      });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection', { 
        reason: reason?.toString() || reason,
        promise: promise.toString()
      });
    });

    // Start the server
    server.listen(currentPort, hostname, () => {
      logger.info('Server started successfully', {
        url: `http://${hostname}:${currentPort}`,
        socketUrl: `ws://${hostname}:${currentPort}/api/socketio`,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform
      });
    });

  } catch (err) {
    logger.error('Server startup error', { 
      error: err.message, 
      stack: err.stack 
    });
    process.exit(1);
  }
}

// Start the server
createCustomServer();
