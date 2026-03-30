const express  = require('express');
const path     = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
  user:     'briannapereira',
  host:     'localhost',
  database: 'greentech',
  password: '',
  port:     5432,
});

async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS company (
        id SERIAL PRIMARY KEY, name VARCHAR(100), tagline VARCHAR(200),
        founded INT, mission TEXT, email VARCHAR(100), phone VARCHAR(30), address TEXT
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY, name VARCHAR(100), description TEXT,
        details TEXT, price NUMERIC(10,2), category VARCHAR(50), image VARCHAR(200)
      );
    `);
    const { rows: c } = await client.query('SELECT id FROM company LIMIT 1');
    if (c.length === 0) {
      await client.query(`INSERT INTO company (name,tagline,founded,mission,email,phone,address) VALUES (
        'GreenTech Solutions','Innovating for a Sustainable Future.',2026,
        'To empower homes and businesses with clean, renewable energy solutions that are cost-effective and environmentally responsible.',
        'info@greentechsolutions.com','(813) 123-4567','1500 Energy RD, Tampa,FL, USA'
      );`);
    }
    const { rows: p } = await client.query('SELECT id FROM products LIMIT 1');
    if (p.length === 0) {
      await client.query(`INSERT INTO products (name,description,details,price,category,image) VALUES
       ('Solar Roof Kit','A streamlined solar package for homes, created for efficiency, durability, and modern aesthetics.',
        'The Solar Roof Kit includes efficient panels, mounting hardware, and energy-saving technology designed for home use. Features 400W high-efficiency panels.',
        2500.00,'Solar','images/kit.jpg'),
        ('Eco Battery Storage','Store renewable energy for nighttime use, backup power, and improved energy independence.',
        'Eco Battery Storage stores extra solar energy for later use, providing backup power and reducing dependency on the grid. Provides 10 kWh of usable capacity.',
        3000.00,'Storage','images/battery storage.webp'),
        ('Smart Energy Monitor','Track energy usage in real time and identify savings opportunities with data driven insights.',
        'The Smart Energy Monitor gives real-time usage insights, helping customers track consumption and lower monthly energy costs. Monitors up to 400W of usage.',
        1000.00,'Monitoring','images/monitor.jpg');
      `);
    }
    console.log('Database ready.');
  } finally {
    client.release();
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/company', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM company LIMIT 1');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

seedDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});