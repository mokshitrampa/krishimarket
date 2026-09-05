const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if unable to set custom DNS
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Trust proxy for reverse proxies (Render, Vercel, Heroku)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());

// CORS configuration supporting development and production frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  config.clientUrl
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      config.nodeEnv !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiter for Auth endpoints to protect against brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Health check endpoint (support both /health and /api/health)
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Farmer-to-Consumer Agri Marketplace API is running.',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Mount Routes: support both /api/... and direct /... in case frontend omitted /api
const routesList = [
  ['/auth', authRoutes, authLimiter],
  ['/farmers', farmerRoutes],
  ['/products', productRoutes],
  ['/cart', cartRoutes],
  ['/orders', orderRoutes],
  ['/reviews', reviewRoutes],
  ['/favorites', favoriteRoutes],
  ['/disputes', disputeRoutes],
  ['/categories', categoryRoutes],
  ['/admin', adminRoutes]
];

routesList.forEach(([path, router, limiter]) => {
  if (limiter) {
    app.use(`/api${path}`, limiter, router);
    app.use(path, limiter, router);
  } else {
    app.use(`/api${path}`, router);
    app.use(path, router);
  }
});

// Catch 404 for unhandled API routes
app.use(['/api/*', '/*'], (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start server after connecting to database
const startServer = async () => {
  try {
    await connectDB();
    const port = config.port;
    app.listen(port, () => {
      console.log(`=============================================`);
      console.log(`🌾 KrishiDirect Backend Server Running`);
      console.log(`📡 Port: ${port}`);
      console.log(`🌐 Node Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health Check: http://localhost:${port}/api/health`);
      console.log(`=============================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;