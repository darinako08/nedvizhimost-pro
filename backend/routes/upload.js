const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/photos'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/photos/:propertyId', authenticate, upload.array('photos', 10), async (req, res) => {
  try {
    const { propertyId } = req.params;
    const files = req.files;
    
    for (let i = 0; i < files.length; i++) {
      const fileUrl = `/uploads/photos/${files[i].filename}`;
      await pool.query(
        'INSERT INTO property_media (property_id, file_url, file_type, file_order) VALUES ($1, $2, $3, $4)',
        [propertyId, fileUrl, 'photo', i]
      );
    }
    
    res.json({ message: `Загружено ${files.length} фото` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:propertyId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM property_media WHERE property_id = $1 ORDER BY file_order',
      [req.params.propertyId]
    );
    res.json(result.rows);
  } catch (error) {
    res.json([]);
  }
});

module.exports = router;