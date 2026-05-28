import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>НедвижимостьПро</h3>
          <p>Найдите свою идеальную недвижимость</p>
        </div>
        
        <div className="footer-section">
          <h4>Наши услуги</h4>
          <ul>
            <li>Арендa</li>
            <li>Оценка недвижимости</li>
            <li>Покупка недвижимости</li>
            <li><a href="/support">Поддержка</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Контакты</h4>
          <p>Телефон: 8(904)351-65-20</p>
          <p>Email: info@nedvizhimost.pro</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 НедвижимостьПро. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;