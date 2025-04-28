// backend/src/routes/carRoutes.js
const express = require('express');
const router = express.Router();

// Get all cars
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT * FROM Car ORDER BY brand, carid`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting cars:', error);
    res.status(500).json({ error: 'Failed to get cars' });
  }
});

// Get all models of a specific car
router.get('/:brand/:carid/models', async (req, res) => {
  const { brand, carid } = req.params;
  
  try {
    const result = await req.db.query(
      `SELECT * FROM Model 
       WHERE brand = $1 AND carid = $2 
       ORDER BY modelid`,
      [brand, carid]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting car models:', error);
    res.status(500).json({ error: 'Failed to get car models' });
  }
});

// Get all models
router.get('/models', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT * FROM Model ORDER BY brand, carid, modelid`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting models:', error);
    res.status(500).json({ error: 'Failed to get models' });
  }
});

module.exports = router;