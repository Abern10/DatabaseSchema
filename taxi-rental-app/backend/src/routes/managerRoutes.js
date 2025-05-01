// src/routes/managerRoutes.js
const express = require('express');
const router = express.Router();

// Login manager
router.post('/login', async (req, res) => {
  const { ssn } = req.body;
  
  try {
    const result = await req.db.query(
      'SELECT * FROM Manager WHERE ssn = $1',
      [ssn]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error logging in manager:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Register manager
router.post('/register', async (req, res) => {
  const { name, email, ssn } = req.body;
  
  try {
    const result = await req.db.query(
      'INSERT INTO Manager (name, email, ssn) VALUES ($1, $2, $3) RETURNING *',
      [name, email, ssn]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering manager:', error);
    res.status(400).json({ error: 'Failed to register manager' });
  }
});

// Get top k clients by rent count
router.get('/top-clients/:k', async (req, res) => {
  const k = parseInt(req.params.k);
  
  try {
    const result = await req.db.query(
      `SELECT c.name, c.email, COUNT(r.rent_id) as rent_count
       FROM Client c
       JOIN Rent r ON c.client_id = r.client_id
       GROUP BY c.client_id, c.name, c.email
       ORDER BY rent_count DESC
       LIMIT $1`,
      [k]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting top clients:', error);
    res.status(500).json({ error: 'Failed to get top clients' });
  }
});

// Get car model usage statistics
router.get('/car-model-usage', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT car.brand, m.model_id, m.color, m.construction_year, m.transmission_type, 
              COUNT(r.rent_id) as rent_count
       FROM Model m
       JOIN Car car ON m.car_id = car.car_id
       LEFT JOIN Rent r ON m.model_id = r.model_id
       GROUP BY car.brand, m.model_id, m.color, m.construction_year, m.transmission_type
       ORDER BY rent_count DESC`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting car model usage:', error);
    res.status(500).json({ error: 'Failed to get car model usage' });
  }
});

// Get driver performance statistics
router.get('/driver-performance', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT d.name, COUNT(r.rent_id) as total_rents,
              COALESCE(AVG(rev.rating), 0) as average_rating
       FROM Driver d
       LEFT JOIN Rent r ON d.driver_id = r.driver_id
       LEFT JOIN Review rev ON d.driver_id = rev.driver_id
       GROUP BY d.driver_id, d.name
       ORDER BY total_rents DESC, average_rating DESC`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting driver performance:', error);
    res.status(500).json({ error: 'Failed to get driver performance' });
  }
});

// Get clients from city1 who booked rides with drivers from city2
router.get('/client-driver-cities/:city1/:city2', async (req, res) => {
  const { city1, city2 } = req.params;
  
  try {
    const result = await req.db.query(
      `SELECT DISTINCT c.name, c.email
       FROM Client c
       JOIN Client_Address ca ON c.client_id = ca.client_id
       JOIN Address client_addr ON ca.address_id = client_addr.address_id
       JOIN Rent r ON c.client_id = r.client_id
       JOIN Driver d ON r.driver_id = d.driver_id
       JOIN Address driver_addr ON d.address_id = driver_addr.address_id
       WHERE client_addr.city = $1 AND driver_addr.city = $2`,
      [city1, city2]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting client-driver city data:', error);
    res.status(500).json({ error: 'Failed to get client-driver city data' });
  }
});

// Get problematic local drivers (Chicago drivers with rating < 2.5 and at least 2 local clients)
router.get('/problematic-drivers', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT d.name, AVG(rev.rating) as average_rating, COUNT(DISTINCT r.rent_id) as rent_count,
              COUNT(DISTINCT r.client_id) as local_client_count
       FROM Driver d
       JOIN Address a ON d.address_id = a.address_id
       JOIN Rent r ON d.driver_id = r.driver_id
       JOIN Review rev ON d.driver_id = rev.driver_id
       JOIN Client c ON r.client_id = c.client_id
       JOIN Client_Address ca ON c.client_id = ca.client_id
       JOIN Address client_addr ON ca.address_id = client_addr.address_id
       WHERE a.city = 'Chicago' AND client_addr.city = 'Chicago'
       GROUP BY d.driver_id, d.name
       HAVING AVG(rev.rating) < 2.5 AND COUNT(DISTINCT r.client_id) >= 2`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting problematic drivers:', error);
    res.status(500).json({ error: 'Failed to get problematic drivers' });
  }
});

// Get brand ratings and rides
router.get('/brand-ratings', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT car.brand,
              AVG(rev.rating) as average_driver_rating,
              COUNT(r.rent_id) as rent_count
       FROM Car car
       JOIN Model m ON car.car_id = m.car_id
       JOIN Rent r ON m.model_id = r.model_id
       JOIN Driver d ON r.driver_id = d.driver_id
       JOIN Review rev ON d.driver_id = rev.driver_id
       GROUP BY car.brand
       ORDER BY average_driver_rating DESC`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting brand ratings:', error);
    res.status(500).json({ error: 'Failed to get brand ratings' });
  }
});

// Add a driver
router.post('/drivers', async (req, res) => {
  const { name, address } = req.body;
  
  try {
    // Start a transaction
    await req.db.query('BEGIN');
    
    // Insert the address if it doesn't exist
    const addressResult = await req.db.query(
      `INSERT INTO Address (road_name, number, city) 
       VALUES ($1, $2, $3) 
       ON CONFLICT DO NOTHING
       RETURNING address_id`,
      [address.road_name, address.number, address.city]
    );
    
    // If address already exists, get its ID
    let addressId;
    if (addressResult.rows.length > 0) {
      addressId = addressResult.rows[0].address_id;
    } else {
      const existingAddress = await req.db.query(
        'SELECT address_id FROM Address WHERE road_name = $1 AND number = $2 AND city = $3',
        [address.road_name, address.number, address.city]
      );
      addressId = existingAddress.rows[0].address_id;
    }
    
    // Insert the driver
    const driverResult = await req.db.query(
      `INSERT INTO Driver (name, address_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [name, addressId]
    );
    
    // Commit transaction
    await req.db.query('COMMIT');
    
    res.status(201).json(driverResult.rows[0]);
  } catch (error) {
    // Rollback in case of error
    await req.db.query('ROLLBACK');
    
    console.error('Error adding driver:', error);
    res.status(400).json({ error: 'Failed to add driver' });
  }
});

// Remove a driver
router.delete('/drivers/:id', async (req, res) => {
  const driverId = req.params.id;
  
  try {
    // Check if driver exists
    const checkResult = await req.db.query(
      'SELECT * FROM Driver WHERE driver_id = $1',
      [driverId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Delete associated records
    await req.db.query('BEGIN');
    
    // Delete driver-model associations
    await req.db.query(
      'DELETE FROM Driver_Model WHERE driver_id = $1',
      [driverId]
    );
    
    // Delete reviews
    await req.db.query(
      'DELETE FROM Review WHERE driver_id = $1',
      [driverId]
    );
    
    // Delete rents
    await req.db.query(
      'DELETE FROM Rent WHERE driver_id = $1',
      [driverId]
    );
    
    // Delete driver
    await req.db.query(
      'DELETE FROM Driver WHERE driver_id = $1',
      [driverId]
    );
    
    await req.db.query('COMMIT');
    
    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    await req.db.query('ROLLBACK');
    
    console.error('Error deleting driver:', error);
    res.status(500).json({ error: 'Failed to delete driver' });
  }
});

// Add a car
router.post('/cars', async (req, res) => {
  const { brand } = req.body;
  
  try {
    const result = await req.db.query(
      'INSERT INTO Car (brand) VALUES ($1) RETURNING *',
      [brand]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(400).json({ error: 'Failed to add car' });
  }
});

// Add a model
router.post('/models', async (req, res) => {
  const { car_id, color, construction_year, transmission_type } = req.body;
  
  try {
    const result = await req.db.query(
      `INSERT INTO Model (car_id, color, construction_year, transmission_type) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [car_id, color, construction_year, transmission_type]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding model:', error);
    res.status(400).json({ error: 'Failed to add model' });
  }
});

// Remove a car and all its models
router.delete('/cars/:id', async (req, res) => {
  const carId = req.params.id;
  
  try {
    // Check if car exists
    const checkResult = await req.db.query(
      'SELECT * FROM Car WHERE car_id = $1',
      [carId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    // Delete associated records
    await req.db.query('BEGIN');
    
    // Get all model IDs for this car
    const modelsResult = await req.db.query(
      'SELECT model_id FROM Model WHERE car_id = $1',
      [carId]
    );
    
    const modelIds = modelsResult.rows.map(row => row.model_id);
    
    if (modelIds.length > 0) {
      // Delete driver-model associations
      await req.db.query(
        'DELETE FROM Driver_Model WHERE model_id = ANY($1::int[])',
        [modelIds]
      );
      
      // Delete rents
      await req.db.query(
        'DELETE FROM Rent WHERE model_id = ANY($1::int[])',
        [modelIds]
      );
      
      // Delete models
      await req.db.query(
        'DELETE FROM Model WHERE car_id = $1',
        [carId]
      );
    }
    
    // Delete car
    await req.db.query(
      'DELETE FROM Car WHERE car_id = $1',
      [carId]
    );
    
    await req.db.query('COMMIT');
    
    res.status(200).json({ message: 'Car and its models deleted successfully' });
  } catch (error) {
    await req.db.query('ROLLBACK');
    
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

// Remove a model
router.delete('/models/:id', async (req, res) => {
  const modelId = req.params.id;
  
  try {
    // Check if model exists
    const checkResult = await req.db.query(
      'SELECT * FROM Model WHERE model_id = $1',
      [modelId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }
    
    // Delete associated records
    await req.db.query('BEGIN');
    
    // Delete driver-model associations
    await req.db.query(
      'DELETE FROM Driver_Model WHERE model_id = $1',
      [modelId]
    );
    
    // Delete rents
    await req.db.query(
      'DELETE FROM Rent WHERE model_id = $1',
      [modelId]
    );
    
    // Delete model
    await req.db.query(
      'DELETE FROM Model WHERE model_id = $1',
      [modelId]
    );
    
    await req.db.query('COMMIT');
    
    res.status(200).json({ message: 'Model deleted successfully' });
  } catch (error) {
    await req.db.query('ROLLBACK');
    
    console.error('Error deleting model:', error);
    res.status(500).json({ error: 'Failed to delete model' });
  }
});

module.exports = router;