// backend/src/routes/clientRoutes.js
const express = require('express');
const router = express.Router();

// Register a new client
router.post('/register', async (req, res) => {
  const { name, email, addresses, creditCards } = req.body;
  
  try {
    // Start a transaction
    await req.db.query('BEGIN');
    
    // Insert client and get the client_id
    const clientResult = await req.db.query(
      'INSERT INTO Client (name, email) VALUES ($1, $2) RETURNING client_id',
      [name, email]
    );
    
    const clientId = clientResult.rows[0].client_id;
    
    // Insert addresses
    for (const address of addresses) {
      const { road_name, number, city } = address;
      
      // Insert address and get the address_id
      const addressResult = await req.db.query(
        `INSERT INTO Address (road_name, number, city) 
         VALUES ($1, $2, $3) 
         RETURNING address_id`,
        [road_name, number, city]
      );
      
      const addressId = addressResult.rows[0].address_id;
      
      // Connect client to address
      await req.db.query(
        `INSERT INTO Client_Address (client_id, address_id) 
         VALUES ($1, $2)`,
        [clientId, addressId]
      );
    }
    
    // Insert credit cards
    for (const card of creditCards) {
      const { card_number, payment_address } = card;
      const { road_name, number, city } = payment_address;
      
      // Insert payment address and get the address_id
      const addressResult = await req.db.query(
        `INSERT INTO Address (road_name, number, city) 
         VALUES ($1, $2, $3) 
         RETURNING address_id`,
        [road_name, number, city]
      );
      
      const addressId = addressResult.rows[0].address_id;
      
      // Insert credit card
      await req.db.query(
        `INSERT INTO CreditCard (card_number, client_id, payment_address_id) 
         VALUES ($1, $2, $3)`,
        [card_number, clientId, addressId]
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
      `SELECT DISTINCT c.brand, m.car_id as carid, m.model_id as modelid, m.color, 
              m.construction_year, m.transmission_type 
       FROM Model m 
       JOIN Car c ON m.car_id = c.car_id
       WHERE EXISTS (
         SELECT 1 
         FROM Driver d 
         JOIN Driver_Model dm ON d.driver_id = dm.driver_id 
         WHERE dm.model_id = m.model_id
         AND NOT EXISTS (
           SELECT 1 
           FROM Rent r 
           WHERE r.driver_id = d.driver_id AND r.date = $1
         )
       ) 
       AND NOT EXISTS (
         SELECT 1 
         FROM Rent r 
         WHERE r.model_id = m.model_id 
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
  const { client_email, date, brand, carid, modelid } = req.body;
  
  try {
    // Start a transaction
    await req.db.query('BEGIN');
    
    // Get client_id from email
    const clientResult = await req.db.query(
      'SELECT client_id FROM Client WHERE email = $1',
      [client_email]
    );
    
    if (clientResult.rows.length === 0) {
      await req.db.query('ROLLBACK');
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const clientId = clientResult.rows[0].client_id;
    
    // Find an available driver for the car model
    const driverResult = await req.db.query(
      `SELECT d.driver_id 
       FROM Driver d 
       JOIN Driver_Model dm ON d.driver_id = dm.driver_id 
       WHERE dm.model_id = $1 
       AND NOT EXISTS (
         SELECT 1 
         FROM Rent r 
         WHERE r.driver_id = d.driver_id AND r.date = $2
       ) 
       LIMIT 1`,
      [modelid, date]
    );
    
    if (driverResult.rows.length === 0) {
      await req.db.query('ROLLBACK');
      return res.status(400).json({ error: 'No available driver for this model' });
    }
    
    const driverId = driverResult.rows[0].driver_id;
    
    // Check if model is available on that date
    const modelResult = await req.db.query(
      `SELECT 1 
       FROM Rent r 
       WHERE r.model_id = $1 AND r.date = $2`,
      [modelid, date]
    );
    
    if (modelResult.rows.length > 0) {
      await req.db.query('ROLLBACK');
      return res.status(400).json({ error: 'Car model is not available on that date' });
    }
    
    // Create the rent
    const rentResult = await req.db.query(
      `INSERT INTO Rent (date, client_id, driver_id, model_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [date, clientId, driverId, modelid]
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
      `SELECT r.rent_id as rentid, r.date, d.name as driver_name, 
              c.brand, m.car_id as carid, m.model_id as modelid,
              m.color, m.construction_year, m.transmission_type
       FROM Rent r
       JOIN Client cl ON r.client_id = cl.client_id
       JOIN Driver d ON r.driver_id = d.driver_id
       JOIN Model m ON r.model_id = m.model_id
       JOIN Car c ON m.car_id = c.car_id
       WHERE cl.email = $1
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
    // Get client_id and driver_id
    const clientResult = await req.db.query(
      'SELECT client_id FROM Client WHERE email = $1',
      [client_email]
    );
    
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const clientId = clientResult.rows[0].client_id;
    
    const driverResult = await req.db.query(
      'SELECT driver_id FROM Driver WHERE name = $1',
      [driver_name]
    );
    
    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    const driverId = driverResult.rows[0].driver_id;
    
    // Check if client has had a rent with this driver
    const rentCheck = await req.db.query(
      `SELECT 1 FROM Rent
       WHERE client_id = $1 AND driver_id = $2`,
      [clientId, driverId]
    );
    
    if (rentCheck.rows.length === 0) {
      return res.status(403).json({ 
        error: 'You can only review drivers you have had rides with'
      });
    }
    
    // Create the review
    const result = await req.db.query(
      `INSERT INTO Review (driver_id, client_id, rating, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [driverId, clientId, rating, message]
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
       JOIN Client_Address ca ON a.address_id = ca.address_id
       JOIN Client c ON ca.client_id = c.client_id
       WHERE c.email = $1`,
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
       JOIN Address a ON cc.payment_address_id = a.address_id
       JOIN Client c ON cc.client_id = c.client_id
       WHERE c.email = $1`,
      [email]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting client credit cards:', error);
    res.status(500).json({ error: 'Failed to get client credit cards' });
  }
});

// Get client's reviews
router.get('/:email/reviews', async (req, res) => {
  const { email } = req.params;
  
  try {
    // First get the client_id
    const clientResult = await req.db.query(
      'SELECT client_id FROM Client WHERE email = $1',
      [email]
    );
    
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const clientId = clientResult.rows[0].client_id;
    
    // Get the reviews
    const result = await req.db.query(
      `SELECT r.review_id, r.driver_id, d.name AS driver_name, 
              r.client_id, r.rating, r.message, 
              rent.rent_id, rent.date AS rent_date,
              CURRENT_TIMESTAMP AS created_at
       FROM Review r
       JOIN Driver d ON r.driver_id = d.driver_id
       JOIN Rent rent ON r.driver_id = rent.driver_id AND r.client_id = rent.client_id
       WHERE r.client_id = $1
       ORDER BY r.review_id DESC`,
      [clientId]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting client reviews:', error);
    res.status(500).json({ error: 'Failed to get client reviews' });
  }
});

module.exports = router;