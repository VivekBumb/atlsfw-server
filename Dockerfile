FROM node:18

# Create app directory
WORKDIR /
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5050

CMD [ "node", "index.js" ]
