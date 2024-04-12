
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'your_database_name'
});


db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});


const app = express();


app.use(bodyParser.json());


app.post('/transactions', (req, res) => {
  const { amount, description } = req.body;
  const transaction = { amount, description };

  const sql = 'INSERT INTO transactions SET ?';
  db.query(sql, transaction, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Transaction created:', result);
    res.status(201).json({ message: 'Transaction created successfully', transactionId: result.insertId });
  });
});


app.get('/transactions', (req, res) => {
  const sql = 'SELECT * FROM transactions';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
});


app.put('/transactions/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const { amount, description } = req.body;

  const sql = 'UPDATE transactions SET amount = ?, description = ? WHERE id = ?';
  db.query(sql, [amount, description, transactionId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ message: 'Transaction updated successfully' });
  });
});

app.delete('/transactions/:transactionId', (req, res) => {
  const { transactionId } = req.params;

  const sql = 'DELETE FROM transactions WHERE id = ?';
  db.query(sql, transactionId, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
