import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeContainer } from './Home.styled';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Проверка введенных данных

    // Переход на страницу списка пользователей с передачей имени пользователя и языка
    navigate(`/users?username=${username}&language=${language}`);
  };

  return (
    <HomeContainer>
      <h1>Home</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Language:
          <input type="text" value={language} onChange={e => setLanguage(e.target.value)} />
        </label>
        <br />
        <button type="submit">Start Chatting</button>
      </form>
    </HomeContainer>
  );
};

export default Home;
