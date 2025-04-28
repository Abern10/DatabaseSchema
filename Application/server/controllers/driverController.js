// controllers/driverController.js
const db = require('../config/db');

// Driver login
exports.loginDriver = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if driver exists
    const driver = await db.query('SELECT * FROM Driver WHERE name = $1', [name]);
    
    if (driver.rows.length === 0) {
      return res.status(400).json({ msg: 'Driver not found' });
    }
    
    res.json(driver.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Address management
exports.updateAddress = async (req, res) => {
  try {
    const { name } = req.params;
    const { road_name, number, city } = req.body;
    
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
    
    // Check if driver already has an address
    const driverAddress = await db.query(
      'SELECT * FROM DriverAddress WHERE driver_name = $1',
      [name]
    );
    
    if (driverAddress.rows.length > 0) {
      // Update existing driver address
      await db.query(
        'UPDATE DriverAddress SET road_name = $1, number = $2, city = $3 WHERE driver_name = $4',
        [road_name, number, city, name]
      );
    } else {
      // Create new driver address
      await db.query(
        'INSERT INTO DriverAddress (driver_name, road_name, number, city) VALUES ($1, $2, $3, $4)',
        [name, road_name, number, city]
      );
    }
    
    res.json({ msg: 'Address updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Car models
exports.getAllModels = async (req, res) => {
  try {
    const models = await db.query(`
      SELECT m.brand, m.carid, m.modelid, m.color, m.construction_year, m.transmission_type
      FROM Model m
      JOIN Car c ON m.brand = c.brand AND m.carid = c.carid
    `);
    
    res.json(models.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addCanDriveModel = async (req, res) => {
  try {
    const { driver_name, brand, carid, modelid } = req.body;
    
    // Check if model exists
    const model = await db.query(
      'SELECT * FROM Model WHERE brand = $1 AND carid = $2 AND modelid = $3',
      [brand, carid, modelid]
    );
    
    if (model.rows.length === 0) {
      return res.status(400).json({ msg: 'Model not found' });
    }
    
    // Check if driver already can drive this model
    const canDriveCheck = await db.query(
      'SELECT * FROM CanDrive WHERE driver_name = $1 AND brand = $2 AND carid = $3 AND modelid = $4',
      [driver_name, brand, carid, modelid]
    );
    
    if (canDriveCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'Driver can already drive this model' });
    }
    
    // Add new can drive relationship
    await db.query(
      'INSERT INTO CanDrive (driver_name, brand, carid, modelid) VALUES ($1, $2, $3, $4)',
      [driver_name, brand, carid, modelid]
    );
    
    res.status(201).json({ msg: 'Model added to driver successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};