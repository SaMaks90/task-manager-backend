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
