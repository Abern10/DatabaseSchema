const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();  // Load environment variables

// Initialize Express app
const app = express();
const PORT = 5000;

// Database connection configuration using environment variables
const dbConfig = {
  user: process.env.DB_USER,         
  password: process.env.DB_PASSWORD, 
  host: process.env.DB_HOST,         
  port: process.env.DB_PORT,         
  database: process.env.DB_DATABASE  
};

// Initialize PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Test the database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => {
    console.error('Database connection error:', err.stack);
    process.exit(1); // Stop the server if DB connection fails
  });

// Middleware
app.use(cors());              
app.use(express.json());      

// Make `pool` available in all routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Try loading all route files
let managerRoutes, driverRoutes, clientRoutes, carRoutes, rentRoutes;

try {
  // Import routes with proper error handling
  managerRoutes = require('./src/routes/managerRoutes');
  console.log('Manager routes loaded successfully');
} catch (error) {
  console.error('Error loading manager routes:', error.message);
  managerRoutes = express.Router(); // Create an empty router as fallback
}

try {
  driverRoutes = require('./src/routes/driverRoutes');
  console.log('Driver routes loaded successfully');
} catch (error) {
  console.error('Error loading driver routes:', error.message);
  driverRoutes = express.Router();
}

try {
  clientRoutes = require('./src/routes/clientRoutes');
  console.log('Client routes loaded successfully');
} catch (error) {
  console.error('Error loading client routes:', error.message);
  clientRoutes = express.Router();
}

try {
  carRoutes = require('./src/routes/carRoutes');
  console.log('Car routes loaded successfully');
} catch (error) {
  console.error('Error loading car routes:', error.message);
  carRoutes = express.Router();
}

try {
  rentRoutes = require('./src/routes/rentRoutes');
  console.log('Rent routes loaded successfully');
} catch (error) {
  console.error('Error loading rent routes:', error.message);
  rentRoutes = express.Router();
}

// Mount routes
app.use('/api/managers', managerRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/rents', rentRoutes);

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});