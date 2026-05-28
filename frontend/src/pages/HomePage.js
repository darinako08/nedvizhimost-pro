import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import './HomePage.css';


function HomePage() {
  const [properties, setProperties] = useState([]);
  const [searchParams, setSearchParams] = useState({
    city: '',
    type: '',
    priceMin: '',
    priceMax: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/properties');
      setProperties(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.city) params.append('city', searchParams.city);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.priceMin) params.append('priceMin', searchParams.priceMin);
    if (searchParams.priceMax) params.append('priceMax', searchParams.priceMax);
    navigate(`/catalog?${params.toString()}`);
  };

  const popularObjects = [
    { name: 'ЖК "Золотые ключи"', desc: 'Центр города, вид на парк', price: '15 000 000 ₽' },
    { name: 'Дом в Крылатском', desc: 'Экологичный район, 3 этажа', price: '25 000 000 ₽' },
    { name: 'Офис в Деловом центре', desc: 'Отдельный вход, парковка', price: '30 000 000 ₽' }
  ];

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Найдите свою идеальную недвижимость</h1>
          <p>Поиск квартир, домов и коммерческой недвижимости</p>
          
          <form className="quick-search" onSubmit={handleSearch}>
            <select 
              value={searchParams.city}
              onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
            >
              <option value="">Город ▼</option>
              <option value="Москва">Москва</option>
              <option value="Санкт-Петербург">Санкт-Петербург</option>
              <option value="Казань">Казань</option>
            </select>
            
            <select
              value={searchParams.type}
              onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
            >
              <option value="">Тип недвижимости ▼</option>
              <option value="Квартира">Квартира</option>
              <option value="Дом">Дом</option>
              <option value="Коммерческая">Коммерческая</option>
            </select>
            
            <input
              type="number"
              placeholder="Цена от"
              value={searchParams.priceMin}
              onChange={(e) => setSearchParams({...searchParams, priceMin: e.target.value})}
            />
            
            <input
              type="number"
              placeholder="Цена до"
              value={searchParams.priceMax}
              onChange={(e) => setSearchParams({...searchParams, priceMax: e.target.value})}
            />
            
            <button type="submit" className="search-btn">Найти</button>
          </form>
        </div>
      </div>

      {/* Popular Objects */}
      <div className="popular-section">
        <h2>Популярные объекты</h2>
        <div className="popular-grid">
          {popularObjects.map((obj, index) => (
            <div key={index} className="popular-card">
              <div className="popular-image"></div>
              <h4>{obj.name}</h4>
              <p>{obj.desc}</p>
              <p className="popular-price">{obj.price}</p>
              <button onClick={() => navigate('/catalog')} className="details-btn">Подробнее</button>
            </div>
          ))}
        </div>
      </div>

      {/* New Properties */}
      <div className="properties-section">
        <h2>Новые объявления</h2>
        <div className="grid">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;