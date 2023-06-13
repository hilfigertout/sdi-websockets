import {useState, useEffect} from 'react';
import './App.css';
import {socket} from './socket';
import Square from './Square';

function App() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonHistory, setButtonHistory] = useState([]);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect)
    
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect' ,onDisconnect);
    }
  
  })

  const handleSquareClick = (e) => {
    setLoading(true);
    e.preventDefault();
    socket.emit('button-push', e.target.id);
    setLoading(false);
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
      <div className="board">
        <div className="row">
          <Square id={'red'} handleClick={handleSquareClick} />
          <Square id={'blue'} handleClick={handleSquareClick} />
        </div>
        <div className="row" >
          <Square id={'yellow'} handleClick={handleSquareClick} />
          <Square id={'green'} handleClick={handleSquareClick} />
        </div>
      </div>

      <button disabled={loading} onClick={handleConnectClick}>{connected ? "Disconnect" : "Connect" }</button>
    </div>
  );
}

export default App;
