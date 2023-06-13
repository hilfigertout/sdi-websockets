const express = require('express');
const {Server} = require('socket.io');
const { createServer } = require("http");
const port = 8080;

const app = express();
const expressServer= createServer(app)
const socketServer = new Server(expressServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

let players = 0;



app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  next();
});

socketServer.on('connection', (socket) => {

  console.log("A player connected");
  if (players >= 2) {
    socket.emit("error", "Too many players on currently.");
    socket.disconnect(true);

  } else {
    players++;
    socket.join('game');
    let gameOver = false;
    while (players === 2 && !gameOver) {
      
    }
  }

  socket.on('disconnect', (socket) => {
    console.log('A player disconnected')
    players--;
  });
})


app.get('/', (req, res) => {
  //TODO
})





expressServer.listen(port, () => console.log(`Express Server listening on port ${port}`));