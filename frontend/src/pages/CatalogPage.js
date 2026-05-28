import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import './CatalogPage.css';

const API_URL = 'http://localhost:5001/api';

function CatalogPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    priceMin: '',
    priceMax: '',
    rooms: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      city: params.get('city') || '',
      type: params.get('type') || '',
      priceMin: params.get('priceMin') || '',
      priceMax: params.get('priceMax') || '',
      rooms: params.get('rooms') || '',
      search: params.get('search') || ''
    });
  }, [location.search]);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.type) params.append('type', filters.type);
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);
      if (filters.rooms) params.append('rooms', filters.rooms);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`${API_URL}/properties?${params.toString()}`);
      setProperties(response.data);
      applySort(response.data, sortBy);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySort = (data, sort) => {
    let sorted = [...data];
    switch (sort) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'area_asc':
        sorted.sort((a, b) => (a.area || 0) - (b.area || 0));
        break;
      case 'area_desc':
        sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
        break;
      default:
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    setFilteredProperties(sorted);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    applySort(properties, e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (newFilters.city) params.append('city', newFilters.city);
    if (newFilters.type) params.append('type', newFilters.type);
    if (newFilters.priceMin) params.append('priceMin', newFilters.priceMin);
    if (newFilters.priceMax) params.append('priceMax', newFilters.priceMax);
    if (newFilters.rooms) params.append('rooms', newFilters.rooms);
    if (newFilters.search) params.append('search', newFilters.search);
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <div className="catalog-page">
      <div className="filters-sidebar">
        <h3>Фильтры</h3>
        
        <div className="filter-group">
          <label>Поиск</label>
          <input
            type="text"
            name="search"
            placeholder="Поиск по названию..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Город</label>
          <select name="city" value={filters.city} onChange={handleFilterChange}>
            <option value="">Любой</option>
            <option value="Москва">Москва</option>
            <option value="Санкт-Петербург">Санкт-Петербург</option>
            <option value="Казань">Казань</option>
            <option value="Новосибирск">Новосибирск</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Тип недвижимости</label>
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">Любой</option>
            <option value="Квартира">Квартира</option>
            <option value="Дом">Дом</option>
            <option value="Коммерческая">Коммерческая</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Цена (₽)</label>
          <div className="price-inputs">
            <input
              type="number"
              name="priceMin"
              placeholder="От"
              value={filters.priceMin}
              onChange={handleFilterChange}
            />
            <span>-</span>
            <input
              type="number"
              name="priceMax"
              placeholder="До"
              value={filters.priceMax}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Количество комнат</label>
          <select name="rooms" value={filters.rooms} onChange={handleFilterChange}>
            <option value="">Любое</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      <div className="catalog-content">
        <div className="catalog-header">
          <h2>Объявления</h2>
          <div className="sort-control">
            <label>Сортировать по:</label>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="date">Дате (новые)</option>
              <option value="price_asc">Цене (возрастание)</option>
              <option value="price_desc">Цене (убывание)</option>
              <option value="area_asc">Площади (возрастание)</option>
              <option value="area_desc">Площади (убывание)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : filteredProperties.length === 0 ? (
          <div className="no-results">Ничего не найдено</div>
        ) : (
          <div className="grid">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;