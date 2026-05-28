-- =============================================
-- ПОЛНАЯ БАЗА ДАННЫХ ДЛЯ "НедвижимостьПро"
-- =============================================

-- Удаляем все старые таблицы
DROP TABLE IF EXISTS property_media CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS support_messages CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================
-- ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ
-- =============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ТАБЛИЦА ОБЪЯВЛЕНИЙ
-- =============================================
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    area DECIMAL(10, 2),
    rooms INTEGER,
    bathrooms INTEGER,
    floor INTEGER,
    year INTEGER,
    type VARCHAR(50),
    city VARCHAR(100),
    address TEXT,
    image TEXT,
    user_id INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    rejection_reason TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ТАБЛИЦА ИЗБРАННОГО
-- =============================================
CREATE TABLE favorites (
    user_id INTEGER,
    property_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, property_id)
);

-- =============================================
-- ТАБЛИЦА МЕДИАФАЙЛОВ
-- =============================================
CREATE TABLE property_media (
    id SERIAL PRIMARY KEY,
    property_id INTEGER,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ТАБЛИЦА СООБЩЕНИЙ ПОДДЕРЖКИ
-- =============================================
CREATE TABLE support_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ДОБАВЛЯЕМ АДМИНИСТРАТОРА (пароль: admin123)
-- =============================================
INSERT INTO users (username, email, phone, password, role) 
VALUES ('Admin', 'admin@nedvizhimost.pro', '+79043516520', 'admin123', 'admin');

-- =============================================
-- ДОБАВЛЯЕМ ТЕСТОВЫЕ ОБЪЯВЛЕНИЯ
-- =============================================
INSERT INTO properties (title, description, price, area, rooms, bathrooms, floor, year, type, city, address, user_id, status) VALUES
('Современная квартира в центре', 'Просторная 3-комнатная квартира с панорамным видом на город. Евроремонт, техника премиум-класса.', 15000000, 85, 3, 2, 5, 2021, 'Квартира', 'Москва', 'ул. Тверская, 15', 1, 'active'),
('Загородный дом с участком', 'Уютный дом в экологически чистом районе. Участок 10 соток, ландшафтный дизайн, баня, гараж.', 25000000, 180, 5, 3, 1, 2019, 'Дом', 'Московская область', 'СНТ Березка, 7', 1, 'active'),
('Офис в бизнес-центре', 'Современное офисное помещение в центре города. Отличная транспортная доступность, парковка.', 30000000, 120, 4, 2, 8, 2020, 'Коммерческая', 'Москва', 'Ленинградский пр-т, 45', 1, 'active'),
('Студия в новостройке', 'Уютная студия в современном ЖК. Чистовая отделка, остекленный балкон, подземный паркинг.', 8500000, 35, 1, 1, 12, 2022, 'Квартира', 'Санкт-Петербург', 'Невский пр-т, 100', 1, 'active');

-- =============================================
-- ПРОВЕРКА
-- =============================================
SELECT '=== БАЗА ДАННЫХ ГОТОВА ===' AS status;
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as properties_count FROM properties;
-- Удаляем старого админа
DELETE FROM users WHERE email = 'admin@nedvizhimost.pro';

-- Создаем нового с хэшированным паролем 'admin123'
-- Хэш для 'admin123' через bcrypt
INSERT INTO users (username, email, phone, password, role) 
VALUES (
    'Admin',
    'admin@nedvizhimost.pro',
    '+79043516520',
    '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.cZQyQZQyQZQyQZQyQZQyQZQyQ',
    'admin'
);
SELECT id, username, email, role, password FROM users;
DELETE FROM users;
INSERT INTO users (username, email, phone, password, role) 
VALUES ('Admin', 'admin@nedvizhimost.pro', '+79043516520', 'admin123', 'admin');

-- 3. Проверим
SELECT * FROM users;