import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PropertyPage.css';

const API_URL = 'http://localhost:5001/api';

function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const nextPhoto = () => {
    if (property?.photos && currentPhotoIndex < property.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleContact = () => {
    if (property?.owner_email) {
      window.location.href = `mailto:${property.owner_email}`;
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!property) return <div className="loading">Объект не найден</div>;

  const photos = property.photos || [];
  const mainImage = photos.length > 0 
    ? `http://localhost:5001${photos[currentPhotoIndex].file_url}`
    : (property.image || 'https://via.placeholder.com/800x500?text=Недвижимость');

  return (
    <div className="property-page">
      <div className="property-gallery">
        <div className="gallery-container">
          <img src={mainImage} alt={property.title} />
          
          {photos.length > 1 && (
            <>
              <button onClick={prevPhoto} className="gallery-nav prev" disabled={currentPhotoIndex === 0}>
                ‹
              </button>
              <button onClick={nextPhoto} className="gallery-nav next" disabled={currentPhotoIndex === photos.length - 1}>
                ›
              </button>
            </>
          )}
        </div>
        
        {photos.length > 1 && (
          <div className="gallery-thumbs">
            {photos.map((photo, index) => (
              <div 
                key={photo.id} 
                className={`thumb ${index === currentPhotoIndex ? 'active' : ''}`}
                onClick={() => setCurrentPhotoIndex(index)}
              >
                <img src={`http://localhost:5001${photo.file_url}`} alt={`Фото ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="property-info">
        <h1>{property.title}</h1>
        <div className="property-price">{Number(property.price).toLocaleString()} ₽</div>
        
        <div className="property-details">
          <div className="detail-item">
            <span className="detail-label">Спальни:</span>
            <span>{property.rooms || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Ванные комнаты:</span>
            <span>{property.bathrooms || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Кв. м.:</span>
            <span>{property.area || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Год постройки:</span>
            <span>{property.year || '-'}</span>
          </div>
        </div>

        <div className="property-description">
          <h3>Описание объекта</h3>
          <p>{property.description || 'Нет описания'}</p>
        </div>

        <div className="property-location">
          <h3>Месторасположение</h3>
          <p>{property.city}, {property.address || 'Адрес не указан'}</p>
        </div>

        <div className="property-contacts">
          <h3>Контакты</h3>
          <p>📞 {property.owner_phone || 'Не указан'}</p>
          <p>✉️ {property.owner_email || 'Не указан'}</p>
          <button onClick={handleContact} className="contact-btn">
            Связаться с продавцом
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyPage;