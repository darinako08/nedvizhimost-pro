import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>НедвижимостьПро</h1>
        </Link>

        <nav className="nav">
          <Link to="/catalog" className="nav-link">Каталог</Link>
          {isAuthenticated && (
            <Link to="/add-property" className="nav-link">Разместить объявление</Link>
          )}
          <Link to="/support" className="nav-link">Поддержка</Link>
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="user-name">{user?.username || 'Пользователь'}</span>
              <div className={`dropdown-menu ${menuOpen ? 'show' : ''}`}>
                <Link to="/profile" className="dropdown-item">Личный кабинет</Link>
                <Link to="/favorites" className="dropdown-item">Избранное</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="dropdown-item">Админ панель</Link>
                )}
                <button onClick={handleLogout} className="dropdown-item logout-btn">Выход</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">Войти</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;