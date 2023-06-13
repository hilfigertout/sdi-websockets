const express = require('express');
const server = express();
const port = 8080;


server.use(express.json());
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  next();
});



server.get('/', (req, res) => {
  //TODO
})





server.listen(port, () => console.log(`Server listening on port ${port}`));