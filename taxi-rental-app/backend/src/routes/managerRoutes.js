//idk why server code was in here but i commented it out

// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// require('dotenv').config();

// // Routes
// const managerRoutes = require('./src/routes/managerRoutes');
// const driverRoutes = require('./src/routes/driverRoutes');
// const clientRoutes = require('./src/routes/clientRoutes');
// const carRoutes = require('./src/routes/carRoutes');
// const rentRoutes = require('./src/routes/rentRoutes');

// // Initialize app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Database connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Make the database connection available to routes
// app.use((req, res, next) => {
//   req.db = pool;
//   next();
// });

// // Routes
// app.use('/api/managers', managerRoutes);
// app.use('/api/drivers', driverRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/cars', carRoutes);
// app.use('/api/rents', rentRoutes);

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });