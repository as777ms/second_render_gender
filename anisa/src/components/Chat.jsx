import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend server
const socket = io('http://localhost:5000/'); // Change to your server address

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch existing messages from backend on load
    const fetchMessages = async () => {
      const response = await fetch('http://localhost:5000/messages');
      const data = await response.json();
      setMessages(data);
    };
    fetchMessages();

    // Listen for new messages from the server
    socket.on('newMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('newMessage'); // Clean up on component unmount
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = { text: input, timestamp: new Date().toLocaleTimeString() };
      socket.emit('sendMessage', newMessage); // Send the message to backend
      setInput('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>User {index + 1}:</strong> {msg.text} <em>({msg.timestamp})</em>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
