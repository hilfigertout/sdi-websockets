import {useState, useEffect} from 'react';
import './App.css';
import {socket} from './socket';
import Square from './Square';

function App() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonHistory, setButtonHistory] = useState([]);
  const [winner, setWinner] = useState(false);
  const [loser, setLoser] = useState(false);
  const [playerId, setPlayerId] = useState(-1);
  const [myTurn, setMyTurn] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  let fastIdHolder = playerId;

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onSequenceFinish(message) {
      console.log(message);
      let messageArray = message.split(" ")
      setButtonHistory(JSON.parse(messageArray[1]));
      setMyTurn(Number(messageArray[0]) !== fastIdHolder);
    }

    function onIdAssign(id) {
      console.log(id);
      fastIdHolder = Number(id);
      setPlayerId(fastIdHolder);
    }

    function onGameStart() {
      console.log("Game starting")
      setWinner(false);
      setLoser(false);
      setButtonHistory([])
      setMyTurn(fastIdHolder === 2)
      setHistoryIndex(0);
    }

    function onGameEnd(message) {
      setWinner(Number(message.split(" ")[1]) !== fastIdHolder) 
      setLoser(Number(message.split(" ")[1]) === fastIdHolder)
      setMyTurn(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('sequence-finish', onSequenceFinish);
    socket.on('game-start', onGameStart);
    socket.on('id-assign', onIdAssign);
    socket.on('game-end', onGameEnd);
    
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect' ,onDisconnect);
    }
  
  }, [])

  const handleSquareClick = (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      if (myTurn) {
        console.log("click")
        let color = e.target.id
        if (buttonHistory.length === historyIndex) {
          setHistoryIndex(0);
          socket.emit('sequence-finish', color);
        } else if (buttonHistory[historyIndex] === color) {
          setHistoryIndex(historyIndex + 1);  
        } else {
          setMyTurn(false);
          setHistoryIndex(0);
          socket.emit('failure')
          setLoser(true);
        }
      }
      setLoading(false);
    }
  }

  const handleConnectClick = (e) => {
    e.preventDefault();
    setLoading(true);
    if (connected) {
      socket.disconnect();
    } else {
      socket.connect();
    }
    setLoading(false);

  }

  return (
    <div className="App">
      <h1>Competitive SIMON</h1>
      {myTurn && buttonHistory.length > 0 && <h2>{`Opponent pressed ${buttonHistory[buttonHistory.length - 1]}`}</h2>}
      {!myTurn && (!winner && !loser) && <h2>Waiting for opponent</h2>}
      {winner && <h2>Victory!</h2>}
      {loser && <h2>Oops! You lost!</h2>}
      {connected && <div className="board">
        <div className="row">
          <Square id={'red'} handleClick={handleSquareClick} />
          <Square id={'blue'} handleClick={handleSquareClick} />
        </div>
        <div className="row" >
          <Square id={'yellow'} handleClick={handleSquareClick} />
          <Square id={'green'} handleClick={handleSquareClick} />
        </div>
      </div> }

      <button disabled={loading} onClick={handleConnectClick}>{connected ? "Disconnect" : "Connect" }</button>
    </div>
  );
}

export default App;
