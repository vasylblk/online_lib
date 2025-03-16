# ���������� Node.js �����
FROM node:20


# ������������� ������� ����������
WORKDIR /app

# �������� package.json � package-lock.json
COPY package*.json ./

# ������������� �����������
RUN npm install --only=production

# �������� ���� ��� �������
COPY . .

# ��������� ����
EXPOSE 5001

# ��������� ����������
CMD ["npm", "run", "start"]
