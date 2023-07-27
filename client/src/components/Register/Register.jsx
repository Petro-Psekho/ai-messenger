import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RegisterContainer, FormContainer } from './Register.styled';
import { Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

const Register = () => {
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/users', {
        username,
        language,
      });

      const newUser = await response.data;

      // console.log('newUser----------->', newUser);

      await localStorage.setItem('loginedUser', JSON.stringify(newUser.username));

      const updatedUsersResponse = await axios.get('http://localhost:5000/users', {
        params: {
          language,
        },
      });

      const updatedUsers = await updatedUsersResponse.data;

      // console.log('updatedUsers----------->', updatedUsers);

      await navigate('/users', { state: { users: updatedUsers } });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLanguageChange = event => {
    setLanguage(event.target.value);
  };

  return (
    <RegisterContainer>
      <h2>SignUp</h2>
      <FormContainer onSubmit={handleSubmit}>
        <TextField
          autoComplete="off"
          id="outlined-basic"
          label="Username"
          variant="filled"
          value={username}
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
    </RegisterContainer>
  );
};

export default Register;
