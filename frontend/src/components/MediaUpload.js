import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MediaUpload.css';

const API_URL = 'http://localhost:5001/api';

function MediaUpload({ propertyId, onUploadComplete }) {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { token } = useAuth();
  
  const photoInputRef = useRef();
  const videoInputRef = useRef();

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

  const uploadFiles = async () => {
    if (photos.length === 0 && videos.length === 0) {
      alert('Выберите файлы для загрузки');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Загрузка фотографий
      if (photos.length > 0) {
        const photoFormData = new FormData();
        photos.forEach(photo => {
          photoFormData.append('photos', photo.file);
        });
        
        await axios.post(`${API_URL}/upload/photos/${propertyId}`, photoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted / 2);
          }
        });
      }
      
      // Загрузка видео
      if (videos.length > 0) {
        const videoFormData = new FormData();
        videos.forEach(video => {
          videoFormData.append('videos', video.file);
        });
        
        await axios.post(`${API_URL}/upload/videos/${propertyId}`, videoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(50 + percentCompleted / 2);
          }
        });
      }
      
      alert('Файлы успешно загружены!');
      setPhotos([]);
      setVideos([]);
      if (onUploadComplete) onUploadComplete();
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка при загрузке файлов: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="media-upload">
      <h3>Загрузка медиафайлов</h3>
      
      <div className="upload-sections">
        {/* Фотографии */}
        <div className="upload-section">
          <h4>Фотографии (до 10 шт)</h4>
          <div className="upload-area" onClick={() => photoInputRef.current.click()}>
            <input
              type="file"
              ref={photoInputRef}
              multiple
              accept="image/*"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">📸</div>
            <p>Нажмите для выбора фотографий</p>
            <small>Поддерживаются: JPEG, PNG, WebP</small>
          </div>
          
          <div className="preview-grid">
            {photos.map(photo => (
              <div key={photo.id} className="preview-item">
                <img src={photo.preview} alt="Preview" />
                <button onClick={() => removePhoto(photo.id)} className="remove-btn">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Видео */}
        <div className="upload-section">
          <h4>Видео (до 5 шт)</h4>
          <div className="upload-area" onClick={() => videoInputRef.current.click()}>
            <input
              type="file"
              ref={videoInputRef}
              multiple
              accept="video/*"
              onChange={handleVideoSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">🎥</div>
            <p>Нажмите для выбора видео</p>
            <small>Поддерживаются: MP4, MOV, AVI</small>
          </div>
          
          <div className="preview-grid">
            {videos.map(video => (
              <div key={video.id} className="preview-item">
                <video src={video.preview} controls />
                <button onClick={() => removeVideo(video.id)} className="remove-btn">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(photos.length > 0 || videos.length > 0) && (
        <button 
          onClick={uploadFiles} 
          disabled={uploading}
          className="upload-submit-btn"
        >
          {uploading ? `Загрузка... ${uploadProgress}%` : 'Загрузить все файлы'}
        </button>
      )}
    </div>
  );
}

export default MediaUpload;