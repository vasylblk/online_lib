# 🔹 Базовий імідж
FROM node:18-alpine

# 🔹 Встановлюємо робочу директорію
WORKDIR /app

# 🔹 Копіюємо package.json і встановлюємо залежності
COPY package*.json ./
RUN npm install

# 🔹 Копіюємо весь проєкт
COPY . .

# 🔹 Білдимо проєкт (Nest компілює в dist/)
RUN npm run build

# 🔹 Виставляємо команду запуску (main.ts піднімає мікросервіс через RMQ)
CMD ["node", "dist/main.js"]
