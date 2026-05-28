import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

// Убедитесь, что порт совпадает с портом бэкенда
const API_URL = 'http://localhost:5001/api';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Получаем токен из localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Проверяем авторизацию
    if (!token) {
      setError('Требуется авторизация');
      setLoading(false);
      return;
    }
    fetchData();
  }, [activeTab, token]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    const config = {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    try {
      if (activeTab === 'dashboard') {
        console.log('Fetching stats...');
        const statsRes = await axios.get(`${API_URL}/admin/stats`, config);
        console.log('Stats response:', statsRes.data);
        setStats(statsRes.data);
      } else if (activeTab === 'users') {
        console.log('Fetching users...');
        const usersRes = await axios.get(`${API_URL}/admin/users`, config);
        console.log('Users response:', usersRes.data);
        setUsers(usersRes.data);
      } else if (activeTab === 'properties') {
        console.log('Fetching properties...');
        const propsRes = await axios.get(`${API_URL}/admin/properties`, config);
        console.log('Properties response:', propsRes.data);
        setProperties(propsRes.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        if (error.response.status === 401) {
          setError('Сессия истекла. Пожалуйста, войдите снова.');
        } else if (error.response.status === 403) {
          setError('У вас нет прав администратора.');
        } else {
          setError(`Ошибка: ${error.response.data?.message || 'Неизвестная ошибка'}`);
        }
      } else if (error.request) {
        setError('Не удалось连接到 серверу. Убедитесь, что бэкенд запущен.');
      } else {
        setError('Ошибка при загрузке данных');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/admin/properties/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert('Объявление одобрено');
    } catch (error) {
      console.error('Error approving property:', error);
      alert('Ошибка при одобрении');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Укажите причину отклонения:');
    if (reason) {
      try {
        await axios.put(`${API_URL}/admin/properties/${id}/reject`, { reason }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        alert('Объявление отклонено');
      } catch (error) {
        console.error('Error rejecting property:', error);
        alert('Ошибка при отклонении');
      }
    }
  };

  const handleBlockUser = async (id, isBlocked) => {
    try {
      await axios.put(`${API_URL}/admin/users/${id}/block`, { is_blocked: !isBlocked }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert(!isBlocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован');
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Ошибка при изменении статуса пользователя');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      try {
        await axios.delete(`${API_URL}/admin/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        alert('Объявление удалено');
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Ошибка при удалении');
      }
    }
  };

  if (!token) {
    return (
      <div className="admin-page">
        <div className="error-message">
          <h2>Доступ запрещен</h2>
          <p>Требуется авторизация для доступа к панели администратора.</p>
          <button onClick={() => window.location.href = '/login'}>Войти</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-message">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => window.location.href = '/login'}>Войти снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Панель администратора</h1>
      
      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          Дашборд
        </button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          Пользователи
        </button>
        <button className={activeTab === 'properties' ? 'active' : ''} onClick={() => setActiveTab('properties')}>
          Модерация
        </button>
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Пользователи</h3>
                <p className="stat-number">{stats.users || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Объявления</h3>
                <p className="stat-number">{stats.properties || 0}</p>
              </div>
              <div className="stat-card">
                <h3>На модерации</h3>
                <p className="stat-number">{stats.pending || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Активные</h3>
                <p className="stat-number">{stats.active || 0}</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-table-container">
              {users.length === 0 ? (
                <p>Нет пользователей</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Имя</th>
                      <th>Email</th>
                      <th>Телефон</th>
                      <th>Роль</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || '-'}</td>
                        <td>{user.role}</td>
                        <td>{user.is_blocked ? 'Заблокирован' : 'Активен'}</td>
                        <td>
                          {user.role !== 'admin' && (
                            <button 
                              className={user.is_blocked ? 'unblock-btn' : 'block-btn'}
                              onClick={() => handleBlockUser(user.id, user.is_blocked)}
                            >
                              {user.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="properties-table-container">
              {properties.length === 0 ? (
                <p>Нет объявлений</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Название</th>
                      <th>Цена</th>
                      <th>Владелец</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id}>
                        <td>{property.id}</td>
                        <td>{property.title}</td>
                        <td>{Number(property.price).toLocaleString()} ₽</td>
                        <td>{property.owner_name}</td>
                        <td>
                          <span className={`status-badge status-${property.status}`}>
                            {property.status === 'pending' ? 'На модерации' : 
                             property.status === 'active' ? 'Активно' : 'Отклонено'}
                          </span>
                        </td>
                        <td>
                          {property.status === 'pending' && (
                            <>
                              <button className="approve-btn" onClick={() => handleApprove(property.id)}>
                                Одобрить
                              </button>
                              <button className="reject-btn" onClick={() => handleReject(property.id)}>
                                Отклонить
                              </button>
                            </>
                          )}
                          <button className="delete-btn" onClick={() => handleDeleteProperty(property.id)}>
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;