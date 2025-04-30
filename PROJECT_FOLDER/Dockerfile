FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install wait-for-it.sh untuk menunggu database siap
RUN apt-get update && apt-get install -y wait-for-it

EXPOSE 3000

CMD ["sh", "-c", "wait-for-it db:5432 --timeout=30 -- npm start"]