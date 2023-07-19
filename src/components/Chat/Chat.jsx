import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

const socket = io('http://localhost:5000');

const Chat = ({ currentUser }) => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/messages?userId=${userId}`);

        const messagesData = response.data;
        setMessages(messagesData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [userId]);

  useEffect(() => {
    console.log('Socket connection started');

    socket.emit('join', { userId });

    return () => {
      console.log('Socket connection closed');
      // Здесь мы будем отписываться от события 'message'
      socket.off('message');
    };
  }, [userId]);

  useEffect(() => {
    console.log('Listening for messages');

    socket.on('message', message => {
      console.log('Received message:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      console.log('Stopped listening for messages');
      // Здесь мы будем отписываться от события 'message'
      socket.off('message');
    };
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (messageInput.trim() === '') {
      return;
    }

    try {
      await axios.post('http://localhost:5000/messages', {
        userId,
        chatUserId: userId,
        text: messageInput,
      });
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!currentUser) {
    return <p>Please log in to view the chat.</p>;
  }

  return (
    <div>
      <h1>Chat</h1>
      <h2>CurrentUser: {currentUser}</h2>
      <h2>ChatUser: {userId}</h2>
      <div>
        {messages.map(message => (
          <div key={message._id}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

Chat.propTypes = {
  currentUser: PropTypes.string,
};

export default Chat;
