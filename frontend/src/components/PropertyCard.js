import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './PropertyCard.css';

const API_URL = 'http://localhost:5001/api';

function PropertyCard({ property, onFavoriteChange }) {
  const { isAuthenticated, token } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    checkFavorite();
    // Устанавливаем URL изображения
    if (property.preview_image) {
      // Если это полный URL (http://) или относительный
      if (property.preview_image.startsWith('http')) {
        setImageUrl(property.preview_image);
      } else {
        setImageUrl(`http://localhost:5001${property.preview_image}`);
      }
    } else if (property.image) {
      setImageUrl(property.image);
    } else {
      setImageUrl('https://via.placeholder.com/400x300?text=Недвижимость');
    }
  }, [property.id, property.preview_image, property.image]);

  const checkFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get(`${API_URL}/properties/favorites/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(response.data.some(fav => fav.id === property.id));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Войдите в аккаунт, чтобы добавить в избранное');
      return;
    }
    
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/properties/${property.id}/favorite`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(false);
      } else {
        await axios.post(`${API_URL}/properties/${property.id}/favorite`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(true);
      }
      if (onFavoriteChange) onFavoriteChange();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  return (
    <div className="property-card">
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={toggleFavorite}
        disabled={favoriteLoading}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
      
      <Link to={`/property/${property.id}`}>
        <div className="card-image">
          <img src={imageUrl} alt={property.title} />
          <span className="card-type">{property.type}</span>
        </div>
        <div className="card-content">
          <h3 className="card-price">{formatPrice(property.price)}</h3>
          <h4 className="card-title">{property.title}</h4>
          <p className="card-location">{property.city}</p>
          <div className="card-features">
            <span>🏠 {property.rooms || '?'} комн.</span>
            <span>📐 {property.area || '?'} м²</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PropertyCard;