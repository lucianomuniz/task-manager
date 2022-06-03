const http = require('http');

require('dotenv').config();
const { mongoConnect } = require('./db/mongo');
const app = require('./app');

const PORT = process.env.PORT;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();

  server.listen(PORT, () => {
    console.log('Server is up on port ' + PORT);
  });
}

startServer();
