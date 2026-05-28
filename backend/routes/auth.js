const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  const { username, email, phone, password } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, phone, password, role) 
       VALUES ($1, $2, $3, $4, 'user') 
       RETURNING id, username, email, phone, role`,
      [username, email, phone, password]
    );
    
    const token = jwt.sign(
      { id: result.rows[0].id, role: result.rows[0].role },
      'secret_key'
    );
    
    res.json({ token, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Вход
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    
    const user = result.rows[0];
    
    if (user.password !== password) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      'secret_key'
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;