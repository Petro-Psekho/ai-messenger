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
  const [chatUserName, setChatUserName] = useState('');

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
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    // В этом useEffect мы можем получить имя пользователя по его userId.

    const fetchChatUserName = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users`);
        const usersData = response.data;
        const chatUser = usersData.find(user => user._id === userId);
        if (chatUser) {
          setChatUserName(chatUser.username);
        } else {
          console.log('User not found:', userId);
        }
      } catch (error) {
        console.error('Error fetching chat user:', error);
      }
    };

    fetchChatUserName();
  }, [userId]);

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
      <h2>ChatUser: {chatUserName}</h2> {/* Используем chatUserName вместо userId */}
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
