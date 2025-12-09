import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tripRoutes from './routes/trip.routes';
import paymentRoutes from './routes/payment.routes';
import riderRoutes from './routes/rider.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';

// Import config
import { sequelize } from './config/database';
import { initializeRedis } from './config/redis';

// Load environment variables
dotenv.config();

class Server {
  private app: Application;
  private httpServer;
  private io: SocketIOServer;
  private port: number;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
      },
    });
    this.port = parseInt(process.env.PORT || '5000', 10);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeWebSocket();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
    }));

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Compression
    this.app.use(compression());

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Rate limiting
    this.app.use(rateLimiter);
  }

  private initializeRoutes(): void {
    const apiVersion = process.env.API_VERSION || 'v1';

    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'CoolRides API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    });

    // API routes
    this.app.use(`/api/${apiVersion}/auth`, authRoutes);
    this.app.use(`/api/${apiVersion}/users`, userRoutes);
    this.app.use(`/api/${apiVersion}/trips`, tripRoutes);
    this.app.use(`/api/${apiVersion}/payments`, paymentRoutes);
    this.app.use(`/api/${apiVersion}/riders`, riderRoutes);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.originalUrl}`,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private initializeWebSocket(): void {
    this.io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Join user to their personal room
      socket.on('join', (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join rider to riders pool
      socket.on('rider:online', (riderId: string) => {
        socket.join('riders');
        socket.join(`rider:${riderId}`);
        console.log(`Rider ${riderId} is now online`);
      });

      // Rider goes offline
      socket.on('rider:offline', (riderId: string) => {
        socket.leave('riders');
        console.log(`Rider ${riderId} is now offline`);
      });

      // Location updates
      socket.on('location:update', (data: { userId: string; location: any }) => {
        socket.to(`user:${data.userId}`).emit('location:updated', data.location);
      });

      // Trip updates
      socket.on('trip:update', (data: { tripId: string; status: string }) => {
        this.io.to(`trip:${data.tripId}`).emit('trip:status', data);
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    // Make io accessible to routes
    this.app.set('io', this.io);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected successfully');

      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized');
      }
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  private async initializeRedisConnection(): Promise<void> {
    try {
      await initializeRedis();
      console.log('✅ Redis connected successfully');
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      // Don't exit, allow app to run without Redis
    }
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await this.initializeDatabase();

      // Initialize Redis
      await this.initializeRedisConnection();

      // Start server
      this.httpServer.listen(this.port, () => {
        console.log('=================================');
        console.log(`🛺 CoolRides API Server`);
        console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
        console.log(`🌐 URL: http://localhost:${this.port}`);
        console.log(`📡 WebSocket: ws://localhost:${this.port}`);
        console.log('=================================');
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start server
const server = new Server();
server.start();

export default server;
