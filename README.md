# Competitive SIMON websockets demo

To demo this application, You'll want to spin up two players alongside the api. These are run in two docker containers.

I didn't have the time or inclination to create a docker-compose, so here's the commands:

First, `cd` into the client directory and build a docker image from the files inside:

`docker build -t websocket-client .`

Then spin up two docker containers:

`docker run --rm --name player1 -e WDS_SOCKET_PORT=3001 -d -p 3001:3000 -v "$(pwd)":/app websocket-client`

`docker run --rm --name player2 -e WDS_SOCKET_PORT=3002 -d -p 3002:3000 -v "$(pwd)":/app websocket-client`

The -v tag is optional, it only matters if you're hoping to edit the code and see the changes live. Recommended if you think there's any development to do at all.

From there, cd into the server directory and start it up!

`npm start`

And that's it! Open two web browsers, have one going to localhost:3001 and one going to localhost:3002. Once they both connect to the server, play some competitive SIMON.

# Rules of Competitive SIMON

The first player presses a button.

The second player is told what color they pressed. They must press that color, followed by another color of their choosing.

The first player is only told the second color. They must remember the first, press both of the colors so far, then press one more of their choosing.

This repeats, with each player having to recreate the entire sequence and adding one more color of their choice until one player messes up and fails to input the sequence correctly. At that point, the other player wins. 