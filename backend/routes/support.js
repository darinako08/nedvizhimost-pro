const express = require('express');
const pool = require('../db');

const router = express.Router();

// Отправка сообщения (публичный)
router.post('/message', async (req, res) => {
  console.log('Support message received:', req.body);
  const { name, phone, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Заполните все обязательные поля' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO support_messages (name, phone, email, message) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, phone || null, email, message]
    );
    
    console.log('Message saved with ID:', result.rows[0].id);
    res.json({ message: 'Сообщение отправлено', id: result.rows[0].id });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Ошибка при отправке сообщения' });
  }
});

module.exports = router;