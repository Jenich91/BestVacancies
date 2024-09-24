# frontend/Dockerfile

# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY ./app/package*.json ./
RUN npm install

# Копируем остальные файлы приложения в контейнер
COPY ./app/src ./src
COPY ./app/public ./public

# Открываем порт для приложения
EXPOSE 3000

# Запускаем клиент React
CMD ["npm", "start"]
