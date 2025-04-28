// controllers/clientController.js
const db = require('../config/db');

// Client registration and login
exports.registerClient = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if client already exists
    const clientCheck = await db.query('SELECT * FROM Client WHERE name = $1 OR email = $2', [name, email]);
    
    if (clientCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'Client already exists' });
    }
    
    // Insert new client
    const newClient = await db.query(
      'INSERT INTO Client (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    
    res.status(201).json(newClient.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.loginClient = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if client exists
    const client = await db.query('SELECT * FROM Client WHERE email = $1', [email]);
    
    if (client.rows.length === 0) {
      return res.status(400).json({ msg: 'Client not found' });
    }
    
    res.json(client.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Address and credit card management
exports.addAddress = async (req, res) => {
  try {
    const { client_name, road_name, number, city } = req.body;
    
    // Check if address exists
    let address = await db.query(
      'SELECT * FROM Address WHERE road_name = $1 AND number = $2 AND city = $3',
      [road_name, number, city]
    );
    
    // If address doesn't exist, create it
    if (address.rows.length === 0) {
      await db.query(
        'INSERT INTO Address (road_name, number, city) VALUES ($1, $2, $3)',
        [road_name, number, city]
      );
    }
    
    // Add client address
    await db.query(
      'INSERT INTO ClientAddress (client_name, road_name, number, city) VALUES ($1, $2, $3, $4)',
      [client_name, road_name, number, city]
    );
    
    res.status(201).json({ msg: 'Address added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addCreditCard = async (req, res) => {
  try {
    const { client_name, card_number, road_name, number, city } = req.body;
    
    // Insert credit card
    await db.query(
      'INSERT INTO CreditCard (card_number) VALUES ($1)',
      [card_number]
    );
    
    // Associate credit card with client
    await db.query(
      'UPDATE CreditCard SET client_name = $1 WHERE card_number = $2',
      [client_name, card_number]
    );
    
    // Add payment address if provided
    if (road_name && number && city) {
      // Check if address exists
      let address = await db.query(
        'SELECT * FROM Address WHERE road_name = $1 AND number = $2 AND city = $3',
        [road_name, number, city]
      );
      
      // If address doesn't exist, create it
      if (address.rows.length === 0) {
        await db.query(
          'INSERT INTO Address (road_name, number, city) VALUES ($1, $2, $3)',
          [road_name, number, city]
        );
      }
      
      // Add payment address for credit card (assuming this relationship exists in schema)
      // This would need additional tables/relationships in your schema
    }
    
    res.status(201).json({ msg: 'Credit card added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Rent management
exports.getAvailableModels = async (req, res) => {
  try {
    const { date } = req.params;
    
    // Complex query to find available car models
    const query = `
      SELECT m.brand, m.carid, m.modelid, m.color, m.construction_year, m.transmission_type
      FROM Model m
      WHERE EXISTS (
        SELECT 1 
        FROM CanDrive cd
        JOIN Driver d ON cd.driver_name = d.name
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
      )
    `;
    
    const availableModels = await db.query(query, [date]);
    
    res.json(availableModels.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.bookRent = async (req, res) => {
  try {
    const { client_name, date, brand, carid, modelid, card_number } = req.body;
    
    // Check if model is available on this date
    const availabilityCheck = await db.query(`
      SELECT m.brand, m.carid, m.modelid
      FROM Model m
      WHERE m.brand = $1 AND m.carid = $2 AND m.modelid = $3
      AND EXISTS (
        SELECT 1 
        FROM CanDrive cd
        JOIN Driver d ON cd.driver_name = d.name
        WHERE cd.brand = m.brand AND cd.carid = m.carid AND cd.modelid = m.modelid
        AND NOT EXISTS (
          SELECT 1 
          FROM Rent r
          WHERE r.driver_name = d.name AND r.date = $4
        )
      )
      AND NOT EXISTS (
        SELECT 1 
        FROM Rent r
        WHERE r.brand = m.brand AND r.carid = m.carid AND r.modelid = m.modelid
        AND r.date = $4
      )
    `, [brand, carid, modelid, date]);
    
    if (availabilityCheck.rows.length === 0) {
      return res.status(400).json({ msg: 'Car model not available on this date' });
    }
    
    // Find an available driver who can drive this model
    const availableDriver = await db.query(`
      SELECT cd.driver_name
      FROM CanDrive cd
      WHERE cd.brand = $1 AND cd.carid = $2 AND cd.modelid = $3
      AND NOT EXISTS (
        SELECT 1 
        FROM Rent r
        WHERE r.driver_name = cd.driver_name AND r.date = $4
      )
      LIMIT 1
    `, [brand, carid, modelid, date]);
    
    if (availableDriver.rows.length === 0) {
      return res.status(400).json({ msg: 'No available driver for this car model' });
    }
    
    const driver_name = availableDriver.rows[0].driver_name;
    
    // Create a new rentid (assuming sequential)
    const maxRentId = await db.query('SELECT MAX(rentid) FROM Rent');
    const rentid = maxRentId.rows[0].max ? maxRentId.rows[0].max + 1 : 1;
    
    // Create new rent
    await db.query(
      'INSERT INTO Rent (rentid, date, client_name, driver_name, card_number, brand, carid, modelid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [rentid, date, client_name, driver_name, card_number, brand, carid, modelid]
    );
    
    res.status(201).json({ 
      msg: 'Rent booked successfully', 
      rentid, 
      driver_name,
      date,
      model: { brand, carid, modelid }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getClientRents = async (req, res) => {
  try {
    const { clientName } = req.params;
    
    const rents = await db.query(`
      SELECT r.rentid, r.date, r.driver_name, r.brand, r.carid, r.modelid,
             m.color, m.construction_year, m.transmission_type
      FROM Rent r
      JOIN Model m ON r.brand = m.brand AND r.carid = m.carid AND r.modelid = m.modelid
      WHERE r.client_name = $1
    `, [clientName]);
    
    res.json(rents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.bookRentBestDriver = async (req, res) => {
  try {
    const { client_name, date, brand, carid, modelid, card_number } = req.body;
    
    // Check if model is available on this date
    const availabilityCheck = await db.query(`
      SELECT m.brand, m.carid, m.modelid
      FROM Model m
      WHERE m.brand = $1 AND m.carid = $2 AND m.modelid = $3
      AND EXISTS (
        SELECT 1 
        FROM CanDrive cd
        JOIN Driver d ON cd.driver_name = d.name
        WHERE cd.brand = m.brand AND cd.carid = m.carid AND cd.modelid = m.modelid
        AND NOT EXISTS (
          SELECT 1 
          FROM Rent r
          WHERE r.driver_name = d.name AND r.date = $4
        )
      )
      AND NOT EXISTS (
        SELECT 1 
        FROM Rent r
        WHERE r.brand = m.brand AND r.carid = m.carid AND r.modelid = m.modelid
        AND r.date = $4
      )
    `, [brand, carid, modelid, date]);
    
    if (availabilityCheck.rows.length === 0) {
      return res.status(400).json({ msg: 'Car model not available on this date' });
    }
    
    // Find the available driver with highest rating
    const bestDriver = await db.query(`
      SELECT cd.driver_name, COALESCE(AVG(r.rating), 0) as avg_rating
      FROM CanDrive cd
      LEFT JOIN Review r ON cd.driver_name = r.drivername
      WHERE cd.brand = $1 AND cd.carid = $2 AND cd.modelid = $3
      AND NOT EXISTS (
        SELECT 1 
        FROM Rent rent
        WHERE rent.driver_name = cd.driver_name AND rent.date = $4
      )
      GROUP BY cd.driver_name
      ORDER BY avg_rating DESC
      LIMIT 1
    `, [brand, carid, modelid, date]);
    
    if (bestDriver.rows.length === 0) {
      return res.status(400).json({ msg: 'No available driver for this car model' });
    }
    
    const driver_name = bestDriver.rows[0].driver_name;
    
    // Create a new rentid (assuming sequential)
    const maxRentId = await db.query('SELECT MAX(rentid) FROM Rent');
    const rentid = maxRentId.rows[0].max ? maxRentId.rows[0].max + 1 : 1;
    
    // Create new rent
    await db.query(
      'INSERT INTO Rent (rentid, date, client_name, driver_name, card_number, brand, carid, modelid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [rentid, date, client_name, driver_name, card_number, brand, carid, modelid]
    );
    
    res.status(201).json({ 
      msg: 'Rent booked successfully with best driver', 
      rentid, 
      driver_name,
      driver_rating: bestDriver.rows[0].avg_rating,
      date,
      model: { brand, carid, modelid }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Reviews
exports.addReview = async (req, res) => {
  try {
    const { client_name, driver_name, rating, message } = req.body;
    
    // Check if client has rented a car with this driver
    const rentCheck = await db.query(
      'SELECT * FROM Rent WHERE client_name = $1 AND driver_name = $2',
      [client_name, driver_name]
    );
    
    if (rentCheck.rows.length === 0) {
      return res.status(400).json({ msg: 'You cannot review a driver you have not rented a car with' });
    }
    
    // Get next reviewid for this driver
    const maxReviewId = await db.query(
      'SELECT MAX(reviewid) FROM Review WHERE drivername = $1',
      [driver_name]
    );
    const reviewid = maxReviewId.rows[0].max ? maxReviewId.rows[0].max + 1 : 1;
    
    // Add review
    await db.query(
      'INSERT INTO Review (drivername, reviewid, rating, message, client_name) VALUES ($1, $2, $3, $4, $5)',
      [driver_name, reviewid, rating, message, client_name]
    );
    
    res.status(201).json({ msg: 'Review added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};