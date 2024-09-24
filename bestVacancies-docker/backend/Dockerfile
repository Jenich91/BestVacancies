# backend/Dockerfile

# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY ./app/package*.json ./
RUN npm install

# Копируем остальные файлы приложения в контейнер
COPY ./app/src ./

# Открываем порт сервера и для БД
EXPOSE 5000 5432

# Запускаем сервер Node.js
CMD ["npm", "start"]