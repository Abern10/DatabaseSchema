const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const managerRoutes = require('./routes/managerRoutes');
const driverRoutes = require('./routes/driverRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/managers', managerRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/clients', clientRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Taxi Rental Management API is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});