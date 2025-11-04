const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

require('./config/passportConfig');

const app = express();

// MIDDLEWARE SETUP 
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// db connecn 
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// For debugging
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Image Search API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Image Search API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      api: '/api',
      health: '/health'
    }
  });
});

// error handling
// handled 404 error
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `The route ${req.method} ${req.path} does not exist`,
    availableEndpoints: {
      auth: {
        'GET /auth/google': 'Google OAuth',
        'GET /auth/facebook': 'Facebook OAuth', 
        'GET /auth/github': 'GitHub OAuth',
        'GET /auth/logout': 'Logout',
        'GET /auth/currentUser': 'Get current user'
      },
      api: {
        'GET /api/topSearches': 'Get top searches',
        'POST /api/search': 'Search images',
        'GET /api/history': 'Get search history'
      }
    }
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

//server start on part 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is started on ${PORT}`);
});