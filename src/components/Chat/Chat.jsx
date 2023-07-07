import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ChatContainer } from './Chat.styled';

const Chat = () => {
  const { username } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Запрос к серверу для получения сообщений
        const response = await axios.get(`API_URL/messages?username=${username}`);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [username]);

  const handleSubmit = async e => {
    e.preventDefault();
    // Отправка сообщения на сервер

    // Очистка поля ввода сообщения
    setMessageInput('');
  };

  return (
    <ChatContainer>
      <h1>Chat</h1>
      <h2>User: {username}</h2>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </ChatContainer>
  );
};

export default Chat;
