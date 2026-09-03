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

// Security Middleware
app.use(helmet());

// CORS configuration supporting development and production frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  config.clientUrl
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.vercel.app') ||
        config.nodeEnv !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked origin: ' + origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

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
app.use('/api/auth', authLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Farmer-to-Consumer Agri Marketplace API is running.',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Catch 404 for unhandled API routes
app.use('/api/*', (req, res) => {
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