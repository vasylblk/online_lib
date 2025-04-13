FROM node:20

WORKDIR /app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо всі залежності, включаючи dev, бо будемо будувати
RUN npm install

# Копіюємо увесь проєкт
COPY . .

# Будуємо TypeScript в JavaScript (фолдера dist)
RUN npm run build

# Опційно: очищаємо dev-залежності
RUN npm prune --production

# Відкриваємо порт (для debug, якщо потрібно)
EXPOSE 5001

# Запускаємо зібраний файл
CMD ["npm", "run", "start:prod"]
