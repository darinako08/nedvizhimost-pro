import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AddPropertyPage.css';

const API_URL = 'http://localhost:5001/api';

function AddPropertyPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    rooms: '',
    bathrooms: '',
    floor: '',
    year: '',
    type: 'Квартира',
    city: '',
    address: ''
  });
  
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const photoInputRef = useRef();
  const videoInputRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 10) {
      alert('Можно загрузить не более 10 фотографий');
      return;
    }
    
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random()
    }));
    
    setPhotos([...photos, ...newPhotos]);
  };

  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (videos.length + files.length > 5) {
      alert('Можно загрузить не более 5 видео');
      return;
    }
    
    const newVideos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random()
    }));
    
    setVideos([...videos, ...newVideos]);
  };

  const removePhoto = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const removeVideo = (id) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверяем токен
    if (!token) {
      alert('Сессия истекла. Пожалуйста, войдите снова.');
      logout();
      navigate('/login');
      return;
    }
    
    if (!formData.title || !formData.description || !formData.price) {
      alert('Заполните обязательные поля: Название, Описание, Цена');
      return;
    }
    
    setSubmitting(true);
    
    try {
      console.log('Токен:', token); // Для отладки
      
      // 1. Создаем объявление
      const propertyResponse = await axios.post(`${API_URL}/properties`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const newPropertyId = propertyResponse.data.id;
      console.log('Объявление создано, ID:', newPropertyId);
      
      // 2. Загружаем фотографии
      if (photos.length > 0) {
        setUploading(true);
        const photoFormData = new FormData();
        photos.forEach(photo => {
          photoFormData.append('photos', photo.file);
        });
        
        await axios.post(`${API_URL}/upload/photos/${newPropertyId}`, photoFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 50) / progressEvent.total);
            setUploadProgress(percent);
          }
        });
      }
      
      // 3. Загружаем видео
      if (videos.length > 0) {
        setUploading(true);
        const videoFormData = new FormData();
        videos.forEach(video => {
          videoFormData.append('videos', video.file);
        });
        
        await axios.post(`${API_URL}/upload/videos/${newPropertyId}`, videoFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percent = 50 + Math.round((progressEvent.loaded * 50) / progressEvent.total);
            setUploadProgress(percent);
          }
        });
      }
      
      alert('✅ Объявление успешно создано и отправлено на модерацию!');
      navigate('/profile');
      
    } catch (error) {
      console.error('Ошибка:', error);
      
      if (error.response?.status === 401) {
        alert('Сессия истекла. Пожалуйста, войдите снова.');
        logout();
        navigate('/login');
      } else {
        alert('Ошибка при создании объявления: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmitting(false);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="add-property-page">
      <h1>Разместить объявление</h1>
      
      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-section">
          <h3>Основная информация</h3>
          
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Например: Светлая 3-комнатная квартира"
            />
          </div>

          <div className="form-group">
            <label>Описание *</label>
            <textarea
              name="description"
              rows="5"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите все преимущества объекта..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Характеристики</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="15000000"
              />
            </div>

            <div className="form-group">
              <label>Площадь (м²)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="85"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Комнат</label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                placeholder="3"
              />
            </div>

            <div className="form-group">
              <label>Ванных комнат</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="2"
              />
            </div>

            <div className="form-group">
              <label>Этаж</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="5"
              />
            </div>

            <div className="form-group">
              <label>Год постройки</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="2021"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Тип недвижимости</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Квартира">Квартира</option>
                <option value="Дом">Дом</option>
                <option value="Коммерческая">Коммерческая</option>
              </select>
            </div>

            <div className="form-group">
              <label>Город</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Москва"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Адрес</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="ул. Тверская, 15"
            />
          </div>
        </div>

        {/* Фотографии */}
        <div className="form-section">
          <h3>Фотографии (до 10 шт)</h3>
          <div className="upload-area" onClick={() => photoInputRef.current.click()}>
            <input
              type="file"
              ref={photoInputRef}
              multiple
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">📸</div>
            <p>Нажмите для выбора фотографий</p>
            <small>Поддерживаются: JPEG, PNG, WebP (макс. 10MB)</small>
          </div>
          
          {photos.length > 0 && (
            <div className="preview-grid">
              {photos.map(photo => (
                <div key={photo.id} className="preview-item">
                  <img src={photo.preview} alt="Preview" />
                  <button type="button" onClick={() => removePhoto(photo.id)} className="remove-btn">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Видео */}
        <div className="form-section">
          <h3>Видео (до 5 шт)</h3>
          <div className="upload-area" onClick={() => videoInputRef.current.click()}>
            <input
              type="file"
              ref={videoInputRef}
              multiple
              accept="video/mp4,video/quicktime"
              onChange={handleVideoSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">🎥</div>
            <p>Нажмите для выбора видео</p>
            <small>Поддерживаются: MP4, MOV (макс. 10MB)</small>
          </div>
          
          {videos.length > 0 && (
            <div className="preview-grid">
              {videos.map(video => (
                <div key={video.id} className="preview-item">
                  <video src={video.preview} controls />
                  <button type="button" onClick={() => removeVideo(video.id)} className="remove-btn">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={submitting || uploading}
        >
          {submitting ? 'Создание объявления...' : 
           uploading ? `Загрузка файлов... ${uploadProgress}%` : 
           'Опубликовать объявление'}
        </button>
        
        {(photos.length > 0 || videos.length > 0) && (
          <p className="upload-info">
            📸 Фотографий: {photos.length} | 🎥 Видео: {videos.length}
          </p>
        )}
      </form>
    </div>
  );
}

export default AddPropertyPage;