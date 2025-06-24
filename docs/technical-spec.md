Оновлене технічне завдання (TS + Roles + Jest)
🧾 Технічне завдання: Task Manager API з аутентифікацією, ролями, пагінацією, логуванням, сортуванням, Jest тестами та Docker
🎯 Мета:
Створити REST API для керування задачами із підтримкою аутентифікації, ролей користувачів, пагінації, сортування, логування, тестування та Docker.

⚙️ Технології:
Node.js + NestJS (TypeScript)

PostgreSQL

TypeORM або Prisma

JWT (авторизація)

bcrypt

Winston або Pino (логування)

Jest (юнит та інтеграційні тести)

Docker + Docker Compose

📦 Моделі:
User
Поле	Тип	Опис
id	uuid	Унікальний ідентифікатор
email	string	Логін користувача
password	string	Захешований пароль
role	enum	Роль користувача (user, admin)
createdAt	timestamp	Дата створення

Task
Поле	Тип	Опис
id	uuid	Унікальний ідентифікатор
userId	uuid	Власник задачі (зв’язок з User)
title	string	Назва задачі
description	string	Опис задачі
status	enum	Статус (pending, in_progress, done)
createdAt	timestamp	Дата створення

📥 Ендпоінти:
Аутентифікація:
POST /auth/register — реєстрація

POST /auth/login — логін, отримання JWT

Користувачі:
PATCH /users/:id/role — змінити роль користувача (тільки для admin)

Задачі:
GET /tasks — список задач (пагінація + сортування)

GET /tasks/:id — отримати задачу

POST /tasks — створити задачу

PATCH /tasks/:id — оновити задачу

DELETE /tasks/:id — видалити задачу

🧰 Основні вимоги:
JWT авторизація та рольова модель (user, admin)

Валідація даних

Пагінація через параметри page та limit

Сортування за createdAt, title, status (asc/desc)

Логування через Winston/Pino (запити, помилки)

Обробка помилок та захист ресурсів

Docker + Docker Compose

Jest: юніт і інтеграційні тести (авторизація, CRUD задач, зміна ролі)

✅ Тестування (Jest):
Тестування реєстрації та логіну

Тестування ролей і авторизації (доступ admin до зміни ролей)

CRUD задач із перевіркою прав доступу

Пагінація та сортування у відповідях

Логування (mock Winston/Pino)

README.md
markdown
Копіювати
Редагувати
# Task Manager API

REST API для керування задачами з аутентифікацією, ролями, пагінацією, сортуванням, логуванням та тестуванням.

---

## Технології

- Node.js + NestJS + TypeScript
- PostgreSQL + TypeORM/Prisma
- JWT для аутентифікації
- Winston/Pino для логування
- Jest для тестування
- Docker + Docker Compose

---

## Запуск проекту

1. Клонувати репозиторій
2. Скопіювати `.env.example` в `.env` та заповнити змінні середовища
3. Запустити Docker контейнери:
   ```bash
   docker-compose up --build
API буде доступний за адресою: http://localhost:3000

API Ендпоінти
Auth
POST /auth/register — реєстрація

POST /auth/login — логін

Users
PATCH /users/:id/role — змінити роль (тільки для admin)

Tasks (треба авторизація)
GET /tasks — список задач (підтримка пагінації, сортування)

GET /tasks/:id — деталі задачі

POST /tasks — створення задачі

PATCH /tasks/:id — оновлення задачі

DELETE /tasks/:id — видалення задачі

Функції
Аутентифікація: JWT + bcrypt

Ролі: user (стандартний), admin (може змінювати ролі інших)

Пагінація та сортування: параметри page, limit, sortBy, order

Логування: інформація про запити та помилки

Docker: контейнери для сервера та БД

Тестування: Jest з покриттям на основні функції API

Запуск тестів
bash
Копіювати
Редагувати
npm run test
.env Приклади
ini
Копіювати
Редагувати
DATABASE_URL=postgres://user:password@db:5432/tasksdb
JWT_SECRET=your_jwt_secret
PORT=3000
Логування
Логи записуються у консоль і файл logs/app.log

Логуються запити, помилки та важлива інформація

Пагінація та сортування приклад
GET /tasks?page=1&limit=10&sortBy=createdAt&order=desc
