const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Получить все объявления (с первой фотографией)
router.get('/', async (req, res) => {
  try {
    // Получаем объявления
    const propertiesResult = await pool.query(`
      SELECT p.*, u.username as owner_name 
      FROM properties p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
    `);
    
    // Для каждого объявления получаем первую фотографию
    const properties = [];
    for (const prop of propertiesResult.rows) {
      const mediaResult = await pool.query(`
        SELECT file_url FROM property_media 
        WHERE property_id = $1 AND file_type = 'photo' 
        ORDER BY file_order ASC 
        LIMIT 1
      `, [prop.id]);
      
      properties.push({
        ...prop,
        preview_image: mediaResult.rows[0]?.file_url || prop.image || null
      });
    }
    
    res.json(properties);
  } catch (error) {
    console.error('GET properties error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Получить одно объявление (со всеми фотографиями)
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username as owner_name, u.phone as owner_phone, u.email as owner_email
      FROM properties p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }
    
    const property = result.rows[0];
    
    // Получаем все фотографии
    const mediaResult = await pool.query(`
      SELECT * FROM property_media 
      WHERE property_id = $1 AND file_type = 'photo'
      ORDER BY file_order ASC
    `, [req.params.id]);
    
    property.photos = mediaResult.rows;
    
    res.json(property);
  } catch (error) {
    console.error('GET property error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Создать объявление
router.post('/', authenticate, async (req, res) => {
  const { title, description, price, area, rooms, bathrooms, floor, year, type, city, address } = req.body;
  
  try {
    const result = await pool.query(`
      INSERT INTO properties (title, description, price, area, rooms, bathrooms, floor, year, type, city, address, user_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending')
      RETURNING *
    `, [title, description, price, area, rooms, bathrooms, floor, year, type, city, address, req.userId]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Добавить в избранное
router.post('/:id/favorite', authenticate, async (req, res) => {
  try {
    await pool.query(
      'INSERT INTO favorites (user_id, property_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.userId, req.params.id]
    );
    res.json({ message: 'Добавлено в избранное' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Удалить из избранного
router.delete('/:id/favorite', authenticate, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND property_id = $2',
      [req.userId, req.params.id]
    );
    res.json({ message: 'Удалено из избранного' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить избранное (с фотографиями)
router.get('/favorites/list', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username as owner_name
      FROM properties p
      JOIN favorites f ON p.id = f.property_id
      JOIN users u ON p.user_id = u.id
      WHERE f.user_id = $1 AND p.status = 'active'
    `, [req.userId]);
    
    // Добавляем фотографии для каждого избранного
    const favorites = [];
    for (const prop of result.rows) {
      const mediaResult = await pool.query(`
        SELECT file_url FROM property_media 
        WHERE property_id = $1 AND file_type = 'photo' 
        ORDER BY file_order ASC 
        LIMIT 1
      `, [prop.id]);
      
      favorites.push({
        ...prop,
        preview_image: mediaResult.rows[0]?.file_url || prop.image || null
      });
    }
    
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;