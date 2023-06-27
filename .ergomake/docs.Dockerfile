FROM node:19-alpine

WORKDIR /docs

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "serve", "--", "-p", "3001"]
