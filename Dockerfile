FROM node:18
WORKDIR /app

# deps
COPY package.json .
COPY package-lock.json .

# install deps
RUN npm ci --include=dev

# src
COPY . .

# build
RUN npm run compile

# run hardhat node
CMD ["npm", "run", "node"]

EXPOSE 8545
