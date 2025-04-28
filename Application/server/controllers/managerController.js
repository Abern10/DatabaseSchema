// controllers/managerController.js
const db = require('../config/db');

// Manager registration and login
exports.registerManager = async (req, res) => {
  try {
    const { ssn, name, email } = req.body;
    
    // Check if manager already exists
    const managerCheck = await db.query('SELECT * FROM Manager WHERE ssn = $1', [ssn]);
    
    if (managerCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'Manager already exists' });
    }
    
    // Insert new manager
    const newManager = await db.query(
      'INSERT INTO Manager (ssn, name, email) VALUES ($1, $2, $3) RETURNING *',
      [ssn, name, email]
    );
    
    res.status(201).json(newManager.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.loginManager = async (req, res) => {
  try {
    const { ssn } = req.body;
    
    // Check if manager exists
    const manager = await db.query('SELECT * FROM Manager WHERE ssn = $1', [ssn]);
    
    if (manager.rows.length === 0) {
      return res.status(400).json({ msg: 'Manager not found' });
    }
    
    res.json(manager.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Car and model management
exports.addCar = async (req, res) => {
  try {
    const { brand, carId } = req.body;
    
    // Insert new car
    const newCar = await db.query(
      'INSERT INTO Car (brand, carid) VALUES ($1, $2) RETURNING *',
      [brand, carId]
    );
    
    res.status(201).json(newCar.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Implementation for other functions would follow similar pattern
// ...

// For the more complex queries like problematic local drivers:
exports.getProblematicLocalDrivers = async (req, res) => {
  try {
    const query = `
      SELECT d.name
      FROM Driver d
      JOIN DriverAddress da ON d.name = da.driver_name
      JOIN Address a ON da.road_name = a.road_name AND da.number = a.number AND da.city = a.city
      JOIN Rent r ON d.name = r.driver_name
      JOIN Client c ON r.client_name = c.name
      JOIN ClientAddress ca ON c.name = ca.client_name
      JOIN Address a2 ON ca.road_name = a2.road_name AND ca.number = a2.number AND ca.city = a2.city
      JOIN Review re ON d.name = re.drivername
      WHERE a.city = 'Chicago' 
        AND a2.city = 'Chicago'
      GROUP BY d.name
      HAVING COUNT(DISTINCT c.name) >= 2 
        AND AVG(re.rating) < 2.5
    `;
    
    const problematicDrivers = await db.query(query);
    
    res.json(problematicDrivers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};