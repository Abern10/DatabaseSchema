// backend/src/routes/managerRoutes.js
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

// Register a manager
router.post('/register', async (req, res) => {
  const { name, email, ssn } = req.body;
  
  try {
    // Insert the manager
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

// Delete a car
router.delete('/cars/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // First, check if there are any models associated with this car
    const modelCheck = await req.db.query(
      'SELECT * FROM Model WHERE car_id = $1',
      [id]
    );
    
    if (modelCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete car with associated models' });
    }
    
    // Delete the car
    await req.db.query(
      'DELETE FROM Car WHERE car_id = $1',
      [id]
    );
    
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

// Add a model
router.post('/models', async (req, res) => {
  const { car_id, color, construction_year, transmission_type } = req.body;
  
  try {
    // Find the highest model_id for this car
    const maxModelIdResult = await req.db.query(
      'SELECT MAX(model_id) FROM Model WHERE car_id = $1',
      [car_id]
    );
    
    const maxModelId = maxModelIdResult.rows[0].max || 0;
    const newModelId = maxModelId + 1;
    
    // Insert the model
    const result = await req.db.query(
      `INSERT INTO Model (car_id, model_id, color, construction_year, transmission_type) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [car_id, newModelId, color, construction_year, transmission_type]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding model:', error);
    res.status(400).json({ error: 'Failed to add model' });
  }
});

// Delete a model
router.delete('/models/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // First, check if there are any rents associated with this model
    const rentCheck = await req.db.query(
      'SELECT * FROM Rent WHERE model_id = $1',
      [id]
    );
    
    if (rentCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete model with associated rents' });
    }
    
    // Check if there are any drivers associated with this model
    const driverCheck = await req.db.query(
      'SELECT * FROM Driver_Model WHERE model_id = $1',
      [id]
    );
    
    if (driverCheck.rows.length > 0) {
      // Remove the associations
      await req.db.query(
        'DELETE FROM Driver_Model WHERE model_id = $1',
        [id]
      );
    }
    
    // Delete the model
    await req.db.query(
      'DELETE FROM Model WHERE model_id = $1',
      [id]
    );
    
    res.status(200).json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error('Error deleting model:', error);
    res.status(500).json({ error: 'Failed to delete model' });
  }
});

// Add a driver
router.post('/drivers', async (req, res) => {
  const { name, address } = req.body;
  
  try {
    // Start a transaction
    await req.db.query('BEGIN');
    
    // First, check if the address exists
    let addressId;
    const addressCheck = await req.db.query(
      'SELECT address_id FROM Address WHERE road_name = $1 AND number = $2 AND city = $3',
      [address.road_name, address.number, address.city]
    );
    
    if (addressCheck.rows.length > 0) {
      addressId = addressCheck.rows[0].address_id;
    } else {
      // Insert the address
      const addressResult = await req.db.query(
        'INSERT INTO Address (road_name, number, city) VALUES ($1, $2, $3) RETURNING address_id',
        [address.road_name, address.number, address.city]
      );
      
      addressId = addressResult.rows[0].address_id;
    }
    
    // Insert the driver
    const driverResult = await req.db.query(
      'INSERT INTO Driver (name, address_id) VALUES ($1, $2) RETURNING *',
      [name, addressId]
    );
    
    // Commit the transaction
    await req.db.query('COMMIT');
    
    res.status(201).json(driverResult.rows[0]);
  } catch (error) {
    // Rollback in case of error
    await req.db.query('ROLLBACK');
    
    console.error('Error adding driver:', error);
    res.status(400).json({ error: 'Failed to add driver' });
  }
});

// Delete a driver
router.delete('/drivers/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Start a transaction
    await req.db.query('BEGIN');
    
    // Check if there are any rents associated with this driver
    const rentCheck = await req.db.query(
      'SELECT * FROM Rent WHERE driver_id = $1',
      [id]
    );
    
    if (rentCheck.rows.length > 0) {
      await req.db.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot delete driver with associated rents' });
    }
    
    // Check if there are any reviews associated with this driver
    const reviewCheck = await req.db.query(
      'SELECT * FROM Review WHERE driver_id = $1',
      [id]
    );
    
    if (reviewCheck.rows.length > 0) {
      // Delete the reviews
      await req.db.query(
        'DELETE FROM Review WHERE driver_id = $1',
        [id]
      );
    }
    
    // Check if there are any model associations
    const modelCheck = await req.db.query(
      'SELECT * FROM Driver_Model WHERE driver_id = $1',
      [id]
    );
    
    if (modelCheck.rows.length > 0) {
      // Delete the associations
      await req.db.query(
        'DELETE FROM Driver_Model WHERE driver_id = $1',
        [id]
      );
    }
    
    // Delete the driver
    await req.db.query(
      'DELETE FROM Driver WHERE driver_id = $1',
      [id]
    );
    
    // Commit the transaction
    await req.db.query('COMMIT');
    
    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    // Rollback in case of error
    await req.db.query('ROLLBACK');
    
    console.error('Error deleting driver:', error);
    res.status(500).json({ error: 'Failed to delete driver' });
  }
});

// Get top clients with the most rents
router.get('/reports/top-clients', async (req, res) => {
  const limit = req.query.limit || 5;
  
  try {
    const result = await req.db.query(
      `SELECT c.name, c.email, COUNT(r.rent_id) as rent_count
       FROM Client c
       JOIN Rent r ON c.client_id = r.client_id
       GROUP BY c.client_id, c.name, c.email
       ORDER BY rent_count DESC
       LIMIT $1`,
      [limit]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting top clients:', error);
    res.status(500).json({ error: 'Failed to get top clients' });
  }
});

// Get car model usage statistics
router.get('/reports/car-model-usage', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT c.brand, m.car_id, m.model_id, m.color, m.construction_year, m.transmission_type,
              COUNT(r.rent_id) as rides_count
       FROM Car c
       JOIN Model m ON c.car_id = m.car_id
       LEFT JOIN Rent r ON m.model_id = r.model_id
       GROUP BY c.brand, m.car_id, m.model_id, m.color, m.construction_year, m.transmission_type
       ORDER BY rides_count DESC`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting car model usage:', error);
    res.status(500).json({ error: 'Failed to get car model usage statistics' });
  }
});

// Get driver performance statistics
router.get('/reports/driver-performance', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT d.name, d.driver_id, 
              COUNT(r.rent_id) as total_rents,
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
    res.status(500).json({ error: 'Failed to get driver performance statistics' });
  }
});

// Get clients from one city who booked drivers from another city
router.get('/reports/city-cross', async (req, res) => {
  const { city1, city2 } = req.query;
  
  if (!city1 || !city2) {
    return res.status(400).json({ error: 'Both cities are required' });
  }
  
  try {
    const result = await req.db.query(
      `SELECT c.name as client_name, c.email as client_email, ca.city as client_city,
              d.name as driver_name, da.city as driver_city
       FROM Client c
       JOIN Client_Address ca ON c.client_id = ca.client_id
       JOIN Address a1 ON ca.address_id = a1.address_id
       JOIN Rent r ON c.client_id = r.client_id
       JOIN Driver d ON r.driver_id = d.driver_id
       JOIN Address da ON d.address_id = da.address_id
       WHERE a1.city = $1 AND da.city = $2`,
      [city1, city2]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting city cross-reference:', error);
    res.status(500).json({ error: 'Failed to get city cross-reference' });
  }
});

// Get problematic local drivers
router.get('/reports/problematic-drivers', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT d.name, d.driver_id,
              AVG(rev.rating) as average_rating,
              COUNT(DISTINCT r.rent_id) as total_rents,
              COUNT(DISTINCT r.client_id) as local_client_count
       FROM Driver d
       JOIN Address a ON d.address_id = a.address_id
       JOIN Rent r ON d.driver_id = r.driver_id
       JOIN Review rev ON d.driver_id = rev.driver_id
       JOIN Client c ON r.client_id = c.client_id
       JOIN Client_Address ca ON c.client_id = ca.client_id
       JOIN Address ca_addr ON ca.address_id = ca_addr.address_id
       WHERE a.city = 'Chicago' AND ca_addr.city = 'Chicago' AND rev.rating < 2.5
       GROUP BY d.driver_id, d.name
       HAVING COUNT(DISTINCT r.client_id) >= 2
       ORDER BY average_rating ASC`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting problematic drivers:', error);
    res.status(500).json({ error: 'Failed to get problematic drivers' });
  }
});

// Get brand ratings and rides
router.get('/reports/brand-ratings', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT c.brand,
              AVG(rev.rating) as average_driver_rating,
              COUNT(r.rent_id) as rent_count
       FROM Car c
       JOIN Model m ON c.car_id = m.car_id
       JOIN Rent r ON m.model_id = r.model_id
       JOIN Driver d ON r.driver_id = d.driver_id
       LEFT JOIN Review rev ON d.driver_id = rev.driver_id
       GROUP BY c.brand
       ORDER BY average_driver_rating DESC`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting brand ratings:', error);
    res.status(500).json({ error: 'Failed to get brand ratings' });
  }
});

module.exports = router;