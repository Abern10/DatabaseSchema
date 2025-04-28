// backend/src/routes/rentRoutes.js
const express = require('express');
const router = express.Router();

// Get all rents
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT r.*, m.color, m.construction_year, m.transmission_type 
       FROM Rent r
       JOIN Model m ON r.brand = m.brand AND r.carid = m.carid AND r.modelid = m.modelid
       ORDER BY r.date DESC`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting rents:', error);
    res.status(500).json({ error: 'Failed to get rents' });
  }
});

// Get a specific rent
router.get('/:rentid', async (req, res) => {
  const { rentid } = req.params;
  
  try {
    const result = await req.db.query(
      `SELECT r.*, m.color, m.construction_year, m.transmission_type 
       FROM Rent r
       JOIN Model m ON r.brand = m.brand AND r.carid = m.carid AND r.modelid = m.modelid
       WHERE r.rentid = $1`,
      [rentid]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rent not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error getting rent:', error);
    res.status(500).json({ error: 'Failed to get rent' });
  }
});

module.exports = router;