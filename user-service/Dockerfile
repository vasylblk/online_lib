# Используем Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --only=production

# Копируем весь код проекта
COPY . .

# Открываем порт
EXPOSE 5001

# Запускаем приложение
CMD ["npm", "run", "start"]
