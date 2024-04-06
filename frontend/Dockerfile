FROM node:19.2-alpine as build
WORKDIR /app

# cp deps
COPY package.json .
COPY package-lock.json .

# install deps
RUN npm ci

# copy src
COPY . .

# build
RUN npm run build

# prod
FROM nginx:alpine

# copy static files to nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
