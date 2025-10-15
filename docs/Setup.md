# Initialize Your Project

# 1. creates a package.json file:
   ```bash
    npm init -y
````

# 2. install the tools project needs:
```bash
    npm install express mongoose dotenv bcrypt jsonwebtoken morgan winston joi cors cookie-parser
    npm install --save-dev nodemon mocha chai supertest
````
# 3. creates a .env file:
PORT={port}
MONGO_URI={MONGO_URI}
JWT_ACCESS_SECRET=access_secret
JWT_REFRESH_SECRET=refresh_secret
# You can generate a token in the console by running this command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"





