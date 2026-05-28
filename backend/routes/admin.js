const express = require('express');
const pool = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

// Статистика
router.get('/stats', async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const properties = await pool.query('SELECT COUNT(*) FROM properties');
    const pending = await pool.query("SELECT COUNT(*) FROM properties WHERE status = 'pending'");
    const active = await pool.query("SELECT COUNT(*) FROM properties WHERE status = 'active'");
    
    res.json({
      users: parseInt(users.rows[0].count),
      properties: parseInt(properties.rows[0].count),
      pending: parseInt(pending.rows[0].count),
      active: parseInt(active.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Все объявления для модерации
router.get('/properties', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username as owner_name, u.email as owner_email
      FROM properties p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Одобрить объявление
router.put('/properties/:id/approve', async (req, res) => {
  try {
    await pool.query("UPDATE properties SET status = 'active' WHERE id = $1", [req.params.id]);
    res.json({ message: 'Объявление одобрено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отклонить объявление
router.put('/properties/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    await pool.query("UPDATE properties SET status = 'rejected', rejection_reason = $1 WHERE id = $2", [reason, req.params.id]);
    res.json({ message: 'Объявление отклонено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Удалить объявление
router.delete('/properties/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    res.json({ message: 'Объявление удалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Все пользователи
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, phone, role, is_blocked FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Заблокировать/разблокировать пользователя
router.put('/users/:id/block', async (req, res) => {
  try {
    const { is_blocked } = req.body;
    await pool.query('UPDATE users SET is_blocked = $1 WHERE id = $2', [is_blocked, req.params.id]);
    res.json({ message: is_blocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;