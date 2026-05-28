import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import './FavoritesPage.css';

const API_URL = 'http://localhost:5001/api';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/favorites/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="favorites-page">
      <h1>❤️ Избранное</h1>
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>У вас пока нет избранных объявлений</p>
          <p>Нажмите ❤️ на карточке объявления, чтобы добавить его в избранное</p>
        </div>
      ) : (
        <div className="grid">
          {favorites.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onFavoriteChange={fetchFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;