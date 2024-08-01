
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start", "test"]
<<<<<<< HEAD

=======
>>>>>>> 00d3115 (Update Dockerfile)

