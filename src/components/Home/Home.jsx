import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeContainer, FormContainer } from './Home.styled';
import { Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log(e);
    // Проверка введенных данных

    // Переход на страницу списка пользователей с передачей имени пользователя и языка
    navigate(`/users?username=${username}&language=${language}`);
  };

  const handleLanguageChange = event => {
    setLanguage(event.target.value);
    console.log(event.target.value);
  };

  return (
    <HomeContainer>
      <h1>Home</h1>
      <FormContainer onSubmit={handleSubmit}>
        {/* <label>
          Username:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label> */}

        <TextField
          autoComplete="off"
          id="outlined-basic"
          label="Username"
          variant="filled"
          onChange={e => setUsername(e.target.value)}
        />

        <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
          <InputLabel id="demo-select-small-label">Language</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={language}
            label="Language"
            onChange={handleLanguageChange}
          >
            <MenuItem value="" disabled>
              <em>Select Language</em>
            </MenuItem>
            <MenuItem value="uk">Українська</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="pl">Polski</MenuItem>
            <MenuItem value="it">Italiano</MenuItem>
            <MenuItem value="md">Moldovenească</MenuItem>
          </Select>
        </FormControl>

        <button type="submit">Start Chatting</button>
      </FormContainer>
    </HomeContainer>
  );
};

export default Home;
