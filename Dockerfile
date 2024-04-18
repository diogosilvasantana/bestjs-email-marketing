FROM node:16-alpine

# Instale o dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache openssl
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]