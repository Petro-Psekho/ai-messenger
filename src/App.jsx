import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header/Header';
import Register from './components/Register/Register';
import UserList from './components/UserList/UserList';
import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const loginedUser = localStorage.getItem('loginedUser');

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        setCurrentUser(loginedUser);
      } catch (error) {
        console.error(error);
      }
    };

    checkCurrentUser();
  }, [loginedUser]);

  const handleRegistration = async (username, language) => {
    try {
      const response = await axios.post('/users', {
        username,
        language,
      });
      const newUser = response.data;
      console.log('newUser====>', newUser);
      setCurrentUser(newUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async username => {
    try {
      setCurrentUser(username);
      await localStorage.setItem('loginedUser', JSON.stringify(username));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('loginedUser');
  };

  return (
    <Router>
      <Header currentUser={currentUser} handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/register"
          element={!currentUser && <Register handleRegistration={handleRegistration} />}
        />
        <Route
          path="/users"
          element={currentUser && <UserList currentUser={currentUser.toString()} />}
        />
        <Route path="/login" element={!currentUser && <Login handleLogin={handleLogin} />} />
        <Route
          path="/chat/:userId"
          element={currentUser && <Chat currentUser={currentUser.toString()} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
