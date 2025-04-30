const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();  // Load environment variables

// Routes
const managerRoutes = require('./src/routes/managerRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const carRoutes = require('./src/routes/carRoutes');
const rentRoutes = require('./src/routes/rentRoutes');

// Database connection configuration using environment variables
const dbConfig = {
  user: process.env.DB_USER,         // replace with your DB username in a .env file
  password: process.env.DB_PASSWORD, // replace with your DB password in a .env file
  host: process.env.DB_HOST,         // replace with your DB host in a .env file
  port: process.env.DB_PORT,         // replace with your DB port in a .env file
  database: process.env.DB_DATABASE  // replace with your DB name in a .env file
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

// Initialize Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());              // Allow requests from other origins (like frontend)
app.use(express.json());      // Parse incoming JSON request bodies

// Make `pool` available in all routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Mount routes
app.use('/api/managers', managerRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/rents', rentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});