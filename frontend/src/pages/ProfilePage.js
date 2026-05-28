import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import './ProfilePage.css';

const API_URL = 'http://localhost:5001/api';

function ProfilePage() {
  const { user, token } = useAuth();
  const [userProperties, setUserProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProperties();
  }, []);

  const fetchUserProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/properties`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProperties(response.data);
    } catch (error) {
      console.error('Error fetching user properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = userProperties.filter(prop => {
    if (activeTab === 'active') return prop.status === 'active';
    if (activeTab === 'pending') return prop.status === 'pending';
    if (activeTab === 'rejected') return prop.status === 'rejected';
    return true;
  });

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Личный кабинет</h1>
        <div className="profile-info">
          <p><strong>Имя:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Телефон:</strong> {user?.phone || 'Не указан'}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={activeTab === 'active' ? 'active' : ''} onClick={() => setActiveTab('active')}>
          Активные ({userProperties.filter(p => p.status === 'active').length})
        </button>
        <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>
          На модерации ({userProperties.filter(p => p.status === 'pending').length})
        </button>
        <button className={activeTab === 'rejected' ? 'active' : ''} onClick={() => setActiveTab('rejected')}>
          Отклоненные ({userProperties.filter(p => p.status === 'rejected').length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : filteredProperties.length === 0 ? (
        <div className="no-properties">У вас нет объявлений в этой категории</div>
      ) : (
        <div className="grid">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;