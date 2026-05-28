import React, { useState } from 'react';
import axios from 'axios';
import './SupportPage.css';

const API_URL = 'http://localhost:5001/api';

function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Заполните обязательные поля (Имя, Email, Сообщение)');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/support/message`, formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Ошибка при отправке сообщения. Попробуйте позже.');
    }
  };

  if (submitted) {
    return (
      <div className="support-page">
        <div className="success-message">
          <h2>Спасибо!</h2>
          <p>Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.</p>
          <button onClick={() => setSubmitted(false)} className="ok-btn">OK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="support-page">
      <div className="support-container">
        <div className="support-info">
          <h2>Служба поддержки</h2>
          <h3>Свяжитесь с нами</h3>
          <div className="contact-info">
            <p>📞 Телефон: 8(904)351-65-20</p>
            <p>📧 Email: support@nedvizhimost.pro</p>
            <p>📍 Адрес: г. Москва, ул. Тверская, 15</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="support-form">
          <input
            type="text"
            name="name"
            placeholder="Ваше имя *"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail *"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Ваше сообщение *"
            rows="5"
            required
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="submit-btn">Отправить</button>
        </form>
      </div>
    </div>
  );
}

export default SupportPage;