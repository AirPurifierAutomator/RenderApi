const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const app = express();
app.use(express.json());

// TiDB Cloud connection
const pool = mysql.createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: 'rChdBcmPh6AhXhn.root',
    password: '3kmCMWHZkkhXHH35',
    database: 'test',
    ssl: {
      ca: fs.readFileSync('./ca.pem'),
      rejectUnauthorized: true,
    },
});

app.post('/api/sensor-data', async (req, res) => {
  const { co, co2, temp, humidity } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.execute(
      'INSERT INTO sensor_data (co, co2, temperature, humidity) VALUES (?, ?, ?, ?)',
      [co, co2, temp, humidity]
    );
    conn.release();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get('/api/data', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM your_table_name');
      res.json(rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(3000, () => console.log('Server running on port 3000'));
