# Deploy

Инструкция рассчитана на запуск проекта в Linux через Docker Compose.

## Требования

- Linux-сервер или Linux-рабочая машина
- Docker
- Docker Compose plugin (`docker compose`)
- Git

Проверка:

```bash
docker --version
docker compose version
git --version
```

## Подготовка

Склонируйте проект и перейдите в его корень:

```bash
git clone <repo-url>
cd quest-management-system
```

Создайте `.env` из примера:

```bash
cp .env.example .env
```

Минимальные переменные:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Kolobok1*
POSTGRES_DB=quest_app_development
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
RAILS_ENV=development
BACKEND_PORT=3000
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:3000/api
```

Для сервера замените `VITE_API_BASE_URL` на публичный адрес backend API, например:

```env
VITE_API_BASE_URL=http://your-server-ip:3000/api
```

## Запуск

Соберите и запустите контейнеры:

```bash
docker compose up --build
```

Для запуска в фоне:

```bash
docker compose up --build -d
```

При старте compose поднимает:

- `db` - PostgreSQL
- `backend` - Ruby on Rails API
- `frontend` - React/Vite приложение

Backend автоматически выполняет:

```bash
bundle install
ruby bin/rails db:prepare
```

## Адреса

- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

Если проект запущен на сервере, используйте IP или домен сервера вместо `localhost`.

## Полезные Команды

Посмотреть логи всех сервисов:

```bash
docker compose logs -f
```

Посмотреть логи backend:

```bash
docker compose logs -f backend
```

Открыть Rails console:

```bash
docker compose exec backend ruby bin/rails console
```

Запустить миграции вручную:

```bash
docker compose exec backend ruby bin/rails db:migrate
```

Заполнить базу seed-данными:

```bash
docker compose exec backend ruby bin/rails db:seed
```

Пересобрать только backend:

```bash
docker compose build backend
docker compose up -d backend
```

Пересобрать только frontend:

```bash
docker compose build frontend
docker compose up -d frontend
```

Остановить проект:

```bash
docker compose down
```

Остановить проект и удалить данные PostgreSQL:

```bash
docker compose down
rm -rf pg_data
```

## OCR И PDF

Backend-контейнер уже содержит Linux-зависимости для:

- Tesseract OCR
- русский и английский языковые пакеты Tesseract
- ImageMagick
- зависимости для `wkhtmltopdf-binary`

По умолчанию Rails использует команду:

```env
TESSERACT_COMMAND=tesseract
```

В Docker Compose она уже задана для backend-сервиса.

## Обновление Проекта

Остановите сервисы, подтяните изменения и пересоберите контейнеры:

```bash
docker compose down
git pull
docker compose up --build -d
```

После обновления проверьте логи:

```bash
docker compose logs -f backend
```

## Частые Проблемы

### Порт уже занят

Измените порт в `.env`, например:

```env
BACKEND_PORT=3001
FRONTEND_PORT=5174
POSTGRES_PORT=5433
```

Затем перезапустите:

```bash
docker compose up -d
```

### Frontend не видит backend

Проверьте `VITE_API_BASE_URL` в `.env`.

Для локального запуска:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Для запуска на сервере:

```env
VITE_API_BASE_URL=http://your-server-ip:3000/api
```

После изменения переменной пересоберите frontend:

```bash
docker compose build frontend
docker compose up -d frontend
```

### Ошибка подключения к базе данных

Проверьте, что сервис `db` запущен:

```bash
docker compose ps
docker compose logs db
```

Если данные базы не нужны, можно пересоздать PostgreSQL-хранилище:

```bash
docker compose down
rm -rf pg_data
docker compose up --build -d
```

### Проблемы с правами на Linux

Rails-скрипты должны быть исполняемыми:

```bash
chmod +x quest_app/bin/*
```

После этого пересоберите backend:

```bash
docker compose build backend
docker compose up -d backend
```
