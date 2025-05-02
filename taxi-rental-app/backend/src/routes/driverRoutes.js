// backend/src/routes/driverRoutes.js
const express = require('express');
const router = express.Router();

// Register a new driver
router.post('/register', async (req, res) => {
  const { name, email, address } = req.body;
  
  try {
    // Start a transaction
    await req.db.query('BEGIN');
    
    // First, check if the address exists or create it
    let addressId;
    
    if (address) {
      const { road_name, number, city } = address;
      
      // Check if address already exists
      const addressCheck = await req.db.query(
        'SELECT address_id FROM Address WHERE road_name = $1 AND number = $2 AND city = $3',
        [road_name, number, city]
      );
      
      if (addressCheck.rows.length > 0) {
        addressId = addressCheck.rows[0].address_id;
      } else {
        // Insert the address
        const addressResult = await req.db.query(
          'INSERT INTO Address (road_name, number, city) VALUES ($1, $2, $3) RETURNING address_id',
          [road_name, number, city]
        );
        
        addressId = addressResult.rows[0].address_id;
      }
    } else {
      // If no address provided, insert a default address
      const defaultAddressResult = await req.db.query(
        'INSERT INTO Address (road_name, number, city) VALUES ($1, $2, $3) RETURNING address_id',
        ['Default Road', 1, 'Default City']
      );
      
      addressId = defaultAddressResult.rows[0].address_id;
    }
    
    // Insert the driver
    const result = await req.db.query(
      'INSERT INTO Driver (name, address_id) VALUES ($1, $2) RETURNING *',
      [name, addressId]
    );
    
    // Commit the transaction
    await req.db.query('COMMIT');
    
    res.status(201).json({ 
      success: true, 
      message: 'Driver registered successfully',
      data: result.rows[0]
    });
  } catch (error) {
    // Rollback in case of error
    await req.db.query('ROLLBACK');
    
    console.error('Error registering driver:', error);
    res.status(400).json({ error: 'Failed to register driver' });
  }
});

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

// Get driver profile
router.get('/:name/profile', async (req, res) => {
  const { name } = req.params;
  
  try {
    // Get driver information
    const driverResult = await req.db.query(
      `SELECT d.driver_id, d.name, 
              a.road_name, a.number, a.city,
              COALESCE(COUNT(r.rent_id), 0) as total_rides,
              COALESCE(AVG(rev.rating), 0) as average_rating
       FROM Driver d
       JOIN Address a ON d.address_id = a.address_id
       LEFT JOIN Rent r ON d.driver_id = r.driver_id
       LEFT JOIN Review rev ON d.driver_id = rev.driver_id
       WHERE d.name = $1
       GROUP BY d.driver_id, d.name, a.road_name, a.number, a.city`,
      [name]
    );
    
    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Get additional contact info (simulated here - you would need to add these to your schema)
    // In a real implementation, you would either add these columns to the Driver table
    // or have a separate DriverContact table
    const driverData = driverResult.rows[0];
    
    // Build the response object
    const profile = {
      id: driverData.driver_id,
      name: driverData.name,
      address: {
        road_name: driverData.road_name,
        number: driverData.number,
        city: driverData.city
      },
      // Simulated data - in a real implementation, these would come from your database
      license_number: `DL-${Math.floor(100000000 + Math.random() * 900000000)}`,
      license_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
      phone_number: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      email: `${driverData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      joining_date: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
      total_rides: parseInt(driverData.total_rides) || 0,
      average_rating: parseFloat(driverData.average_rating) || 0
    };
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error getting driver profile:', error);
    res.status(500).json({ error: 'Failed to get driver profile' });
  }
});

// Update driver address
router.put('/:name/address', async (req, res) => {
  const { name } = req.params;
  const { road_name, number, city } = req.body;
  
  try {
    // Start a transaction
    await req.db.query('BEGIN');
    
    // Get driver_id
    const driverResult = await req.db.query(
      'SELECT driver_id, address_id FROM Driver WHERE name = $1',
      [name]
    );
    
    if (driverResult.rows.length === 0) {
      await req.db.query('ROLLBACK');
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    const { driver_id, address_id } = driverResult.rows[0];
    
    // Check if this is the only driver using this address
    const addressUsageResult = await req.db.query(
      'SELECT COUNT(*) FROM Driver WHERE address_id = $1',
      [address_id]
    );
    
    const addressUsageCount = parseInt(addressUsageResult.rows[0].count);
    
    let newAddressId;
    
    if (addressUsageCount === 1) {
      // If this is the only driver using this address, update it
      await req.db.query(
        'UPDATE Address SET road_name = $1, number = $2, city = $3 WHERE address_id = $4',
        [road_name, number, city, address_id]
      );
      
      newAddressId = address_id;
    } else {
      // If other drivers are using this address, create a new one
      const newAddressResult = await req.db.query(
        'INSERT INTO Address (road_name, number, city) VALUES ($1, $2, $3) RETURNING address_id',
        [road_name, number, city]
      );
      
      newAddressId = newAddressResult.rows[0].address_id;
      
      // Update the driver to use the new address
      await req.db.query(
        'UPDATE Driver SET address_id = $1 WHERE driver_id = $2',
        [newAddressId, driver_id]
      );
    }
    
    // Commit the transaction
    await req.db.query('COMMIT');
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: {
        road_name,
        number,
        city
      }
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await req.db.query('ROLLBACK');
    
    console.error('Error updating driver address:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Update driver contact information
router.put('/:name/contact', async (req, res) => {
  const { name } = req.params;
  const { phone_number, email } = req.body;
  
  try {
    // This is a placeholder for demonstration
    // In a real implementation, you would need to add these columns to your schema
    // and update the database
    
    res.status(200).json({
      success: true,
      message: 'Contact information updated successfully',
      data: {
        phone_number,
        email
      }
    });
  } catch (error) {
    console.error('Error updating driver contact:', error);
    res.status(500).json({ error: 'Failed to update contact information' });
  }
});

// Get all reviews for a driver
router.get('/:name/reviews', async (req, res) => {
  const { name } = req.params;
  
  try {
    // Get driver_id
    const driverResult = await req.db.query(
      'SELECT driver_id FROM Driver WHERE name = $1',
      [name]
    );
    
    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    const driver_id = driverResult.rows[0].driver_id;
    
    // Get all reviews for this driver
    const reviewsResult = await req.db.query(
      `SELECT r.review_id as id, 
              r.rating, 
              r.message, 
              c.name as client_name, 
              c.email as client_email,
              rent.rent_id as ride_id,
              rent.date as ride_date,
              CURRENT_TIMESTAMP as date
       FROM Review r
       JOIN Client c ON r.client_id = c.client_id
       LEFT JOIN Rent rent ON r.client_id = rent.client_id AND r.driver_id = rent.driver_id
       WHERE r.driver_id = $1
       ORDER BY rent.date DESC`,
      [driver_id]
    );
    
    res.status(200).json(reviewsResult.rows);
  } catch (error) {
    console.error('Error getting driver reviews:', error);
    res.status(500).json({ error: 'Failed to get driver reviews' });
  }
});


module.exports = router;