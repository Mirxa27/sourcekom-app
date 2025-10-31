// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from './src/lib/socket';
import { SecurityUtils } from './src/lib/security';
import { logger } from './src/lib/logger';
import { HealthMonitor } from './src/app/api/health/route';
import { ResponseCache, calculateAgeSeconds } from './src/lib/cache';
import { createServer } from 'http';
import type { IncomingMessage, ServerResponse } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'zlib';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = parseInt(process.env.PORT || '3000');
const hostname = process.env.HOSTNAME || '0.0.0.0';

const ENABLE_COMPRESSION = process.env.API_COMPRESSION_ENABLED !== 'false';
const ENABLE_CACHE = process.env.API_CACHE_ENABLED !== 'false';
const MIN_COMPRESSIBLE_SIZE = parsePositiveInt(process.env.API_COMPRESS_MIN_BYTES, 1024);
const cacheTtlMs = parsePositiveInt(process.env.API_CACHE_TTL_MS, 60_000);
const cacheMaxEntries = parsePositiveInt(process.env.API_CACHE_MAX_ENTRIES, 200);
const cacheMaxEntrySize = parsePositiveInt(process.env.API_CACHE_MAX_ENTRY_SIZE, 512 * 1024);

const CACHEABLE_METHODS = new Set(['GET', 'HEAD']);
const CACHEABLE_API_PREFIXES = (process.env.API_CACHE_PATHS?.split(',') || [
  '/api/resources',
  '/api/categories',
  '/api/admin/stats',
  '/api/analytics',
]).map((path) => path.trim()).filter(Boolean);

const responseCache = new ResponseCache({
  ttlMs: cacheTtlMs,
  maxEntries: cacheMaxEntries,
  maxEntrySizeBytes: cacheMaxEntrySize,
});

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function negotiateEncoding(header: string | undefined): 'br' | 'gzip' | 'identity' {
  if (!header) return 'identity';
  const normalized = header.toLowerCase();
  if (normalized.includes('br')) return 'br';
  if (normalized.includes('gzip')) return 'gzip';
  return 'identity';
}

function isCompressibleContent(contentType: string | number | string[] | undefined): boolean {
  if (!contentType) return false;
  const value = Array.isArray(contentType) ? contentType.join(';') : contentType.toString();
  return (
    value.startsWith('text/') ||
    value.includes('json') ||
    value.includes('javascript') ||
    value.includes('svg') ||
    value.includes('xml')
  );
}

function coerceToBuffer(chunk: any, encoding?: BufferEncoding): Buffer | null {
  if (!chunk) return null;
  if (Buffer.isBuffer(chunk)) return chunk;
  return Buffer.from(chunk, encoding);
}

function extractCallback(encodingOrCallback?: any, callback?: any): (() => void) | undefined {
  if (typeof encodingOrCallback === 'function') return encodingOrCallback;
  if (typeof callback === 'function') return callback;
  return undefined;
}

function isCacheableRequest(req: IncomingMessage): boolean {
  if (!ENABLE_CACHE) return false;
  if (!req.method || !CACHEABLE_METHODS.has(req.method.toUpperCase())) return false;
  const url = req.url || '';
  if (!url.startsWith('/api/') || url.startsWith('/api/socketio')) return false;
  if (url.startsWith('/api/auth')) return false;
  return CACHEABLE_API_PREFIXES.some((prefix) => url.startsWith(prefix));
}

function shouldSkipCaching(res: ServerResponse): boolean {
  if (res.statusCode !== 200) return true;
  const cacheControl = res.getHeader('Cache-Control');
  if (typeof cacheControl === 'string' && /no-store|private/i.test(cacheControl)) {
    return true;
  }
  return false;
}

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
      const requestUrl = req.url || '/';
      const normalizedMethod = (req.method ?? 'GET').toUpperCase();
      const cacheKeyMethod = normalizedMethod === 'HEAD' ? 'GET' : normalizedMethod;
      const isApiRequest = requestUrl.startsWith('/api/') && !requestUrl.startsWith('/api/socketio');
      const isNextInternal = requestUrl.startsWith('/_next/') || requestUrl.startsWith('/favicon.ico');

      res.once('finish', () => {
        const responseTime = Date.now() - startTime;
        const isError = res.statusCode >= 400;
        healthMonitor.recordRequest(responseTime, isError);
        if (!isNextInternal || isError) {
          logger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime,
            isError
          });
        }
      });

      // Add security headers immediately so cached responses include them
      const securityHeaders = SecurityUtils.getSecurityHeaders();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

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

      // Skip socket.io requests from Next.js handler (handled by Socket.IO server)
      if (requestUrl.startsWith('/api/socketio')) {
        return;
      }

      const acceptEncodingHeader = req.headers['accept-encoding'];
      const acceptEncodingRaw = Array.isArray(acceptEncodingHeader)
        ? acceptEncodingHeader.join(',')
        : acceptEncodingHeader;
      const negotiatedEncoding = ENABLE_COMPRESSION && isApiRequest
        ? negotiateEncoding(acceptEncodingRaw)
        : 'identity';

      const cacheable = isApiRequest && isCacheableRequest(req);
      let cacheKey: string | null = null;

      if (cacheable) {
        cacheKey = ResponseCache.buildKey(cacheKeyMethod, requestUrl, negotiatedEncoding);
        const cachedEntry = responseCache.get(cacheKey);
        if (cachedEntry) {
          res.statusCode = cachedEntry.statusCode;
          Object.entries(cachedEntry.headers).forEach(([name, value]) => {
            res.setHeader(name, value);
          });
          res.setHeader('Age', calculateAgeSeconds(cachedEntry.createdAt).toString());
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('Content-Length', cachedEntry.body.length);
          if (normalizedMethod === 'HEAD') {
            res.end();
          } else {
            res.end(cachedEntry.body);
          }
          return;
        }
      }

      if (!isNextInternal) {
        logger.info('Incoming request', {
          method: req.method,
          url: req.url,
          ip: clientIP,
          userAgent: req.headers['user-agent'],
          origin
        });
      }

      const shouldCaptureBody = isApiRequest && normalizedMethod === 'GET' && (ENABLE_COMPRESSION || cacheable);
      const capturedChunks: Buffer[] = [];
      const originalWrite = res.write;
      const originalEnd = res.end;

      if (shouldCaptureBody) {
        res.write = function (this: ServerResponse<IncomingMessage>, chunk: any, encoding?: BufferEncoding | ((error: Error | null | undefined) => void), cb?: (error: Error | null | undefined) => void) {
          let resolvedEncoding: BufferEncoding | undefined;
          let resolvedCallback: ((error: Error | null | undefined) => void) | undefined;

          if (typeof encoding === 'function') {
            resolvedCallback = encoding;
          } else {
            resolvedEncoding = encoding;
            resolvedCallback = cb;
          }

          const buffer = coerceToBuffer(chunk, resolvedEncoding);
          if (buffer) {
            capturedChunks.push(buffer);
          }

          const writeArgs: any[] = [chunk];
          if (resolvedEncoding) {
            writeArgs.push(resolvedEncoding);
          }
          if (resolvedCallback) {
            writeArgs.push(resolvedCallback);
          }

          return (originalWrite as unknown as (...args: any[]) => boolean).apply(this, writeArgs);
        } as typeof res.write;

        res.end = function (this: ServerResponse<IncomingMessage>, chunk?: any, encoding?: BufferEncoding | (() => void), cb?: () => void) {
          let resolvedEncoding: BufferEncoding | undefined;
          let resolvedCallback: (() => void) | undefined;

          if (typeof encoding === 'function') {
            resolvedCallback = encoding;
          } else {
            resolvedEncoding = encoding;
            resolvedCallback = cb;
          }

          if (chunk) {
            const buffer = coerceToBuffer(chunk, resolvedEncoding);
            if (buffer) {
              capturedChunks.push(buffer);
            }
          }

          const basePayload = capturedChunks.length > 0 ? Buffer.concat(capturedChunks) : Buffer.alloc(0);
          let payload = basePayload;
          let chosenEncoding: 'br' | 'gzip' | 'identity' = 'identity';

          if (
            ENABLE_COMPRESSION &&
            negotiatedEncoding !== 'identity' &&
            payload.length >= MIN_COMPRESSIBLE_SIZE &&
            isCompressibleContent(res.getHeader('Content-Type'))
          ) {
            try {
              if (negotiatedEncoding === 'br') {
                payload = brotliCompressSync(payload, {
                  params: {
                    [zlibConstants.BROTLI_PARAM_QUALITY]: 5
                  }
                });
                chosenEncoding = 'br';
              } else if (negotiatedEncoding === 'gzip') {
                payload = gzipSync(payload, { level: 6 });
                chosenEncoding = 'gzip';
              }
            } catch (compressionError) {
              logger.warn('Response compression failed', {
                url: requestUrl,
                error: compressionError instanceof Error ? compressionError.message : String(compressionError)
              });
              payload = basePayload;
              chosenEncoding = 'identity';
            }
          }

          if (chosenEncoding !== 'identity') {
            res.setHeader('Content-Encoding', chosenEncoding);
            res.setHeader('Vary', ResponseCache.appendVaryHeader(res.getHeader('Vary'), 'Accept-Encoding'));
          } else {
            res.removeHeader('Content-Encoding');
          }
          res.setHeader('Content-Length', payload.length);

          if (cacheable && cacheKey) {
            if (!shouldSkipCaching(res) && payload.length > 0) {
              const headersForCache = ResponseCache.sanitizeHeaders(res.getHeaders());
              delete headersForCache['x-cache'];
              if (!headersForCache['cache-control']) {
                headersForCache['cache-control'] = `public, max-age=${Math.floor(cacheTtlMs / 1000)}`;
              }
              const stored = responseCache.set(cacheKey, {
                statusCode: res.statusCode,
                headers: headersForCache,
                body: payload,
                createdAt: Date.now()
              });
              res.setHeader('Age', '0');
              res.setHeader('X-Cache', stored ? 'MISS' : 'BYPASS');
            } else {
              res.setHeader('X-Cache', 'SKIP');
            }
          } else if (cacheable) {
            res.setHeader('X-Cache', 'PASS');
          }

          const endArgs: any[] = [payload];
          if (resolvedEncoding) {
            endArgs.push(resolvedEncoding);
          }
          if (resolvedCallback) {
            endArgs.push(resolvedCallback);
          }

          return (originalEnd as unknown as (...args: any[]) => ServerResponse<IncomingMessage>).apply(this, endArgs);
        } as typeof res.end;
      } else if (cacheable) {
        res.setHeader('X-Cache', 'PASS');
      }

      try {
        handle(req, res);
      } catch (err: unknown) {
        logger.error('Request handler error', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          url: req.url
        });
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
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

  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.error('Server startup error', { 
      error: error.message, 
      stack: error.stack 
    });
    process.exit(1);
  }
}

// Start the server
createCustomServer();
