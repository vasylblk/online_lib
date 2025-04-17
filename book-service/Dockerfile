FROM node:20

WORKDIR /app

# Копіюємо env
COPY .env .env

# Копіюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо код
COPY . .

# Збірка
RUN npm run build

# Видаляємо dev-залежності
RUN npm prune --production

EXPOSE 5002

CMD ["npm", "run", "start:prod"]
