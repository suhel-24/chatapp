import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to server

function App() {
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((msgs) => [...msgs, msg]);
    });
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('chat message', message, roomId);
      setMessage('');
    }
  };

  const handleJoinRoom = () => {
    socket.emit('join room', roomId || null); // Send null for random room
  };

  return (
    <div>
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID (optional)"
      />
      <button onClick={handleJoinRoom}>Join Room</button>
      <form onSubmit={handleSendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <button type="submit">Send</button>
      </form>
      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
  );
}

export default App;
