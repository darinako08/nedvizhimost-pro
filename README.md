# 🏠 НедвижимостьПро

Платформа для поиска, покупки, аренды и продажи недвижимости с панелью администратора.

## ✨ Функционал

### Для пользователей:
- 🔍 Поиск недвижимости с фильтрацией
- ❤️ Избранное (лайки)
- 📸 Загрузка фото до 10 шт
- 🎥 Загрузка видео до 5 шт
- 📱 Адаптивный дизайн
- 💬 Форма обратной связи

### Для администратора:
- 📊 Дашборд со статистикой
- ✅ Модерация объявлений
- 👥 Управление пользователями
- 📋 Просмотр сообщений поддержки

## 🛠 Технологии

**Frontend:** React 18, React Router v6, Axios, CSS3
**Backend:** Node.js, Express, PostgreSQL, JWT, Multer

## 🚀 Быстрый старт

### 1. Клонирование
```bash
git clone https://github.com/BAIL_HIK/nedvizhimost-pro.git
cd nedvizhimost-pro
```

#### 2. Настройка базы данных

```bash
# Создайте базу данных
psql -U postgres -c "CREATE DATABASE nedvizhimost_pro"

# Импортируйте схему и начальные данные
psql -U postgres -d nedvizhimost_pro -f database.sql
```

#### 3. Настройка бэкенда

```bash
# Перейдите в папку бэкенда
cd backend

# Установите зависимости
npm install

# Создайте файл с переменными окружения
copy .env.example .env
```

**Отредактируйте файл `.env`:** (укажите ваш пароль PostgreSQL)

```env
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ВАШ_ПАРОЛЬ
DB_NAME=nedvizhimost_pro
JWT_SECRET=secret_key
```

#### 4. Запуск бэкенда

```bash
node server.js
```

✅ Должно появиться: `Сервер запущен на порту 5001`

#### 5. Настройка и запуск фронтенда (в новом терминале)

```bash
# Перейдите в папку фронтенда
cd frontend

# Установите зависимости
npm install

# Запустите приложение
npm start
```

✅ Откроется браузер с приложением: `http://localhost:3000`

---

## 🔐 Данные для входа

| Роль | Email | Пароль |
|------|-------|--------|
| **Администратор** | `admin@nedvizhimost.pro` | `admin123` |
| **Пользователь** | Зарегистрируйтесь через форму | - |

---

## 📁 Структура проекта

```
nedvizhimost-pro/
│
├── backend/                      # Серверная часть
│   ├── middleware/               # Промежуточные обработчики
│   │   └── auth.js              # Проверка JWT токена
│   ├── routes/                   # API маршруты
│   │   ├── auth.js              # Регистрация / Вход
│   │   ├── admin.js             # Панель администратора
│   │   ├── properties.js        # Работа с объявлениями
│   │   ├── upload.js            # Загрузка файлов
│   │   ├── support.js           # Обратная связь
│   │   └── users.js             # Профиль пользователя
│   ├── uploads/                  # Загруженные фото (создается автоматически)
│   ├── .env.example              # Пример настроек
│   ├── db.js                     # Подключение к PostgreSQL
│   ├── package.json              # Зависимости
│   └── server.js                 # Точка входа
│
├── frontend/                     # Клиентская часть
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/           # Переиспользуемые компоненты
│       │   ├── Header.js
│       │   ├── Footer.js
│       │   ├── PropertyCard.js
│       │   └── MediaUpload.js
│       ├── pages/                # Страницы приложения
│       │   ├── HomePage.js       # Главная
│       │   ├── CatalogPage.js    # Каталог
│       │   ├── PropertyPage.js   # Карточка объекта
│       │   ├── LoginPage.js      # Вход / Регистрация
│       │   ├── ProfilePage.js    # Личный кабинет
│       │   ├── FavoritesPage.js  # Избранное
│       │   ├── AddPropertyPage.js # Добавление объявления
│       │   ├── AdminPage.js      # Панель администратора
│       │   └── SupportPage.js    # Поддержка
│       ├── context/              # Контекст авторизации
│       │   └── AuthContext.js
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
│
├── database.sql                  # SQL схема базы данных
└── README.md                     # Этот файл
```

---

## 📡 API Endpoints

### Аутентификация
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация нового пользователя |
| POST | `/api/auth/login` | Вход в систему |

### Объявления
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/properties` | Получить все активные объявления |
| GET | `/api/properties/:id` | Получить конкретное объявление |
| POST | `/api/properties` | Создать новое объявление |
| POST | `/api/properties/:id/favorite` | Добавить в избранное |
| DELETE | `/api/properties/:id/favorite` | Удалить из избранного |
| GET | `/api/properties/favorites/list` | Получить избранное пользователя |

### Поддержка
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/support/message` | Отправить сообщение в поддержку |

### Администратор (требуется роль `admin`)
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/admin/stats` | Получить статистику |
| GET | `/api/admin/users` | Список всех пользователей |
| PUT | `/api/admin/users/:id/block` | Блокировка/разблокировка |
| GET | `/api/admin/properties` | Все объявления (для модерации) |
| PUT | `/api/admin/properties/:id/approve` | Одобрить объявление |
| PUT | `/api/admin/properties/:id/reject` | Отклонить объявление |
| GET | `/api/admin/messages` | Сообщения из поддержки |

---


## 🗺 Roadmap (Планы по развитию)

- [ ] **VR-туры** - интерактивные 3D-туры по объектам
- [ ] **Интеграция с картами** - отображение объектов на Яндекс.Картах
- [ ] **Ипотечный калькулятор** - расчет ежемесячного платежа
- [ ] **Чат между пользователями** - общение продавцов и покупателей
- [ ] **Email-уведомления** - оповещения о новых объявлениях
- [ ] **Telegram-бот** - поиск и уведомления в Telegram

---

## 📞 Контакты

По всем вопросам: **support@nedvizhimost.pro**




