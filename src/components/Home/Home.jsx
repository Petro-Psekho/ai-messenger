import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeContainer } from './Home.styled';
import { Select, MenuItem } from '@mui/material';

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

  const handleLanguageChange = event => {
    setLanguage(event.target.value);
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
          <Select value={language} onChange={handleLanguageChange} displayEmpty>
            <MenuItem value="" disabled>
              Select Language
            </MenuItem>
            <MenuItem value="uk">Українська</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="pl">Polski</MenuItem>
            <MenuItem value="it">Italiano</MenuItem>
            <MenuItem value="md">Moldovenească</MenuItem>
          </Select>
        </label>
        <br />
        <button type="submit">Start Chatting</button>
      </form>
    </HomeContainer>
  );
};

export default Home;
