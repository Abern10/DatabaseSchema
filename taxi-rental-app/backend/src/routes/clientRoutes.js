// backend/src/routes/clientRoutes.js
const express = require('express');
const router = express.Router();

// Register a new client
router.post('/register', async (req, res) => {
  const { name, email, addresses, creditCards } = req.body;
  
  try {
    // Start a transaction
    await req.db.query('BEGIN');
    
    // Insert client
    await req.db.query(
      'INSERT INTO Client (name, email) VALUES ($1, $2)',
      [name, email]
    );
    
    // Insert addresses
    for (const address of addresses) {
      const { road_name, number, city } = address;
      
      // Ensure address exists
      await req.db.query(
        `INSERT INTO Address (road_name, number, city) 
         VALUES ($1, $2, $3) 
         ON CONFLICT DO NOTHING`,
        [road_name, number, city]
      );
      
      // Connect client to address
      await req.db.query(
        `INSERT INTO ClientAddress (client_email, road_name, number, city) 
         VALUES ($1, $2, $3, $4)`,
        [email, road_name, number, city]
      );
    }
    
    // Insert credit cards
    for (const card of creditCards) {
      const { card_number, payment_address } = card;
      const { road_name, number, city } = payment_address;
      
      // Ensure address exists
      await req.db.query(
        `INSERT INTO Address (road_name, number, city) 
         VALUES ($1, $2, $3) 
         ON CONFLICT DO NOTHING`,
        [road_name, number, city]
      );
      
      // Insert credit card
      await req.db.query(
        `INSERT INTO CreditCard (card_number, client_email, address_road_name, address_number, address_city) 
         VALUES ($1, $2, $3, $4, $5)`,
        [card_number, email, road_name, number, city]
      );
    }
    
    // Commit transaction
    await req.db.query('COMMIT');
    
    res.status(201).json({ message: 'Client registered successfully' });
  } catch (error) {
    // Rollback in case of error
    await req.db.query('ROLLBACK');
    
    console.error('Error registering client:', error);
    res.status(400).json({ error: 'Failed to register client' });
  }
});

// Login client
router.post('/login', async (req, res) => {
  const { email } = req.body;
  
  try {
    const result = await req.db.query(
      'SELECT * FROM Client WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error logging in client:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get available car models for a specific date
router.get('/available-models', async (req, res) => {
  const { date } = req.query;
  
  try {
    const result = await req.db.query(
      `SELECT DISTINCT m.brand, m.carid, m.modelid, m.color, 
              m.construction_year, m.transmission_type 
       FROM Model m 
       WHERE EXISTS (
         SELECT 1 
         FROM Driver d 
         JOIN CanDrive cd ON d.name = cd.driver_name 
         WHERE cd.brand = m.brand AND cd.carid = m.carid AND cd.modelid = m.modelid 
         AND NOT EXISTS (
           SELECT 1 
           FROM Rent r 
           WHERE r.driver_name = d.name AND r.date = $1
         )
       ) 
       AND NOT EXISTS (
         SELECT 1 
         FROM Rent r 
         WHERE r.brand = m.brand AND r.carid = m.carid AND r.modelid = m.modelid 
         AND r.date = $1
       )`,
      [date]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting available models:', error);
    res.status(500).json({ error: 'Failed to get available models' });
  }
});

// Book a rent
router.post('/rents', async (req, res) => {
  const { client_email, date, brand, carid, modelid, card_number, address_road_name, address_number, address_city } = req.body;
  
  try {
    // Start a transaction
    await req.db.query('BEGIN');
    
    // Find an available driver for the car model
    const driverResult = await req.db.query(
      `SELECT d.name 
       FROM Driver d 
       JOIN CanDrive cd ON d.name = cd.driver_name 
       WHERE cd.brand = $1 AND cd.carid = $2 AND cd.modelid = $3 
       AND NOT EXISTS (
         SELECT 1 
         FROM Rent r 
         WHERE r.driver_name = d.name AND r.date = $4
       ) 
       LIMIT 1`,
      [brand, carid, modelid, date]
    );
    
    if (driverResult.rows.length === 0) {
      await req.db.query('ROLLBACK');
      return res.status(400).json({ error: 'No available driver for this model' });
    }
    
    const driver_name = driverResult.rows[0].name;
    
    // Check if model is available on that date
    const modelResult = await req.db.query(
      `SELECT 1 
       FROM Rent r 
       WHERE r.brand = $1 AND r.carid = $2 AND r.modelid = $3 AND r.date = $4`,
      [brand, carid, modelid, date]
    );
    
    if (modelResult.rows.length > 0) {
      await req.db.query('ROLLBACK');
      return res.status(400).json({ error: 'Car model is not available on that date' });
    }
    
    // Create the rent
    const rentResult = await req.db.query(
      `INSERT INTO Rent (date, client_email, driver_name, brand, carid, modelid, card_number, 
                address_road_name, address_number, address_city) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [date, client_email, driver_name, brand, carid, modelid, card_number, 
       address_road_name, address_number, address_city]
    );
    
    // Commit transaction
    await req.db.query('COMMIT');
    
    res.status(201).json(rentResult.rows[0]);
  } catch (error) {
    // Rollback in case of error
    await req.db.query('ROLLBACK');
    
    console.error('Error booking rent:', error);
    res.status(400).json({ error: 'Failed to book rent' });
  }
});

// Get client's rents
router.get('/:email/rents', async (req, res) => {
  const { email } = req.params;
  
  try {
    const result = await req.db.query(
      `SELECT r.rentid, r.date, r.driver_name, 
              r.brand, r.carid, r.modelid,
              m.color, m.construction_year, m.transmission_type
       FROM Rent r
       JOIN Model m ON r.brand = m.brand AND r.carid = m.carid AND r.modelid = m.modelid
       WHERE r.client_email = $1
       ORDER BY r.date DESC`,
      [email]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting client rents:', error);
    res.status(500).json({ error: 'Failed to get client rents' });
  }
});

// Submit a review for a driver
router.post('/reviews', async (req, res) => {
  const { driver_name, rating, message, client_email } = req.body;
  
  try {
    // Check if client has had a rent with this driver
    const rentCheck = await req.db.query(
      `SELECT 1 FROM Rent
       WHERE client_email = $1 AND driver_name = $2`,
      [client_email, driver_name]
    );
    
    if (rentCheck.rows.length === 0) {
      return res.status(403).json({ 
        error: 'You can only review drivers you have had rides with'
      });
    }
    
    // Check if driver exists
    const driverCheck = await req.db.query(
      'SELECT 1 FROM Driver WHERE name = $1',
      [driver_name]
    );
    
    if (driverCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Create the review
    const result = await req.db.query(
      `INSERT INTO Review (driver_name, rating, message, client_email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [driver_name, rating, message, client_email]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ error: 'Failed to create review' });
  }
});

// Get client addresses
router.get('/:email/addresses', async (req, res) => {
  const { email } = req.params;
  
  try {
    const result = await req.db.query(
      `SELECT a.road_name, a.number, a.city
       FROM Address a
       JOIN ClientAddress ca ON a.road_name = ca.road_name 
                             AND a.number = ca.number 
                             AND a.city = ca.city
       WHERE ca.client_email = $1`,
      [email]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting client addresses:', error);
    res.status(500).json({ error: 'Failed to get client addresses' });
  }
});

// Get client credit cards
router.get('/:email/credit-cards', async (req, res) => {
  const { email } = req.params;
  
  try {
    const result = await req.db.query(
      `SELECT cc.card_number, a.road_name, a.number, a.city
       FROM CreditCard cc
       JOIN Address a ON cc.address_road_name = a.road_name 
                     AND cc.address_number = a.number 
                     AND cc.address_city = a.city
       WHERE cc.client_email = $1`,
      [email]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting client credit cards:', error);
    res.status(500).json({ error: 'Failed to get client credit cards' });
  }
});

module.exports = router;