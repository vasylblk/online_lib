FROM node:20

WORKDIR /app

# Встановлюємо всі залежності (dev + prod)
COPY package*.json ./
RUN npm install

# Копіюємо код і компілюємо
COPY . .
RUN npm run build

# (опціонально) видаляємо dev-залежності для зменшення розміру
RUN npm prune --production

EXPOSE 3000

# Запуск продакшн-серверу
CMD ["node", "dist/src/main"]

