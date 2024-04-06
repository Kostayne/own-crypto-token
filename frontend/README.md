# ERC20 Wallet (Frontend)

## Docker
You can use docker compose in project root to start local hardhat node & serve wallet files
```
cd ..
docker compose up
```

### Docker | Client only
Build an image
```
docker build -t erc20wallet .
```

Run the image
```
docker run -d -p 80:80 erc20wallet
```

## Local dev
### Install dependencies
```
npm i
```

### Run dev mode
```
npm run dev
```

### Build app
This will generate static files into build folder, you need a server like nginx or express to serve them.
```
npm run build
```