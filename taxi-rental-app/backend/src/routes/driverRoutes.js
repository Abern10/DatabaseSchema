// backend/src/routes/driverRoutes.js
const express = require('express');
const router = express.Router();

// Login driver
router.post('/login', async (req, res) => {
  const { name } = req.body;
  
  try {
    const result = await req.db.query(
      'SELECT * FROM Driver WHERE name = $1',
      [name]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error logging in driver:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Update driver address
router.put('/:name/address', async (req, res) => {
  const { name } = req.params;
  const { road_name, number, city } = req.body;
  
  try {
    // First, ensure the address exists
    await req.db.query(
      `INSERT INTO Address (road_name, number, city) 
       VALUES ($1, $2, $3) 
       ON CONFLICT DO NOTHING`,
      [road_name, number, city]
    );
    
    const result = await req.db.query(
      `UPDATE Driver 
       SET address_road_name = $1, address_number = $2, address_city = $3 
       WHERE name = $4 
       RETURNING *`,
      [road_name, number, city, name]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating driver address:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Get all car models
router.get('/car-models', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT m.brand, m.carid, m.modelid, m.color, 
              m.construction_year, m.transmission_type 
       FROM Model m 
       ORDER BY m.brand, m.carid, m.modelid`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting car models:', error);
    res.status(500).json({ error: 'Failed to get car models' });
  }
});

// Get models the driver can drive
router.get('/:name/drivable-models', async (req, res) => {
  const { name } = req.params;
  
  try {
    const result = await req.db.query(
      `SELECT m.brand, m.carid, m.modelid, m.color, 
              m.construction_year, m.transmission_type 
       FROM Model m 
       JOIN CanDrive cd ON m.brand = cd.brand AND m.carid = cd.carid AND m.modelid = cd.modelid 
       WHERE cd.driver_name = $1 
       ORDER BY m.brand, m.carid, m.modelid`,
      [name]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting drivable models:', error);
    res.status(500).json({ error: 'Failed to get drivable models' });
  }
});

// Add a model that the driver can drive
router.post('/:name/drivable-models', async (req, res) => {
  const { name } = req.params;
  const { brand, carid, modelid } = req.body;
  
  try {
    const result = await req.db.query(
      `INSERT INTO CanDrive (driver_name, brand, carid, modelid) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, brand, carid, modelid]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding drivable model:', error);
    res.status(400).json({ error: 'Failed to add drivable model' });
  }
});

// Remove a model that the driver can drive
router.delete('/:name/drivable-models/:brand/:carid/:modelid', async (req, res) => {
  const { name, brand, carid, modelid } = req.params;
  
  try {
    await req.db.query(
      `DELETE FROM CanDrive 
       WHERE driver_name = $1 AND brand = $2 AND carid = $3 AND modelid = $4`,
      [name, brand, carid, modelid]
    );
    
    res.status(200).json({ message: 'Drivable model removed successfully' });
  } catch (error) {
    console.error('Error removing drivable model:', error);
    res.status(500).json({ error: 'Failed to remove drivable model' });
  }
});

// Get all car models
router.get('/car-models', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT m.brand, m.carid, m.modelid, m.color, 
              m.construction_year, m.transmission_type 
       FROM Model m 
       ORDER BY m.brand, m.carid, m.modelid`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting car models:', error);
    res.status(500).json({ error: 'Failed to get car models' });
  }
});

// Get all reviews for a driver
router.get('/:name/reviews', async (req, res) => {
  const { name } = req.params;
  
  try {
    const result = await req.db.query(
      `SELECT r.*, c.name as client_name 
       FROM Review r
       JOIN Driver d ON r.driver_id = d.driver_id
       JOIN Client c ON r.client_id = c.client_id
       WHERE d.name = $1
       ORDER BY r.review_id DESC`,
      [name]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting driver reviews:', error);
    res.status(500).json({ error: 'Failed to get driver reviews' });
  }
});

module.exports = router;