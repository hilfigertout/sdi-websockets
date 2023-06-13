import {useState, useEffect} from 'react';
import './App.css';
import {socket} from './socket';

function App() {
  const [connected, setConnected] = useState(false);

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

  const handleClick = (e) => {
    e.preventDefault();
    if (connected) {
      socket.disconnect();
    } else {
      socket.connect();
    }

  }

  return (
    <div className="App">
      <button onClick={handleClick}>{connected ? "Disconnect" : "Connect" }</button>
    </div>
  );
}

export default App;
