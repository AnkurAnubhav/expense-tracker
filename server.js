const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const expenseRoutes = require('./routes/expense');

// Auto-create table on startup
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses(
        expense_id SERIAL PRIMARY KEY,
        title VARCHAR(30) NOT NULL, 
        price DECIMAL(10, 2) NOT NULL, 
        category VARCHAR(30) NOT NULL, 
        essential BOOLEAN NOT NULL, 
        created_at TIMESTAMPTZ NOT NULL
      );
    `);
    console.log('Database table ready');
  } catch (err) {
    console.error('Database error:', err);
  }
};

initDB();

// Running express server
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'view/build')));

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/build/index.html'));
});

// route middlewares
app.use('/api', expenseRoutes);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port}`);
});
