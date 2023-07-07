import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { UserListContainer } from './UserList.styled';

const UserList = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Запрос к серверу для получения списка пользователей
        const response = await axios.get('API_URL/users');
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const { username, language } = new URLSearchParams(location.search);

  return (
    <UserListContainer>
      <h1>User List</h1>
      <p>Logged in as: {username}</p>
      <p>Language: {language}</p>
      <h2>Available Users:</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/chat/${user.username}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </UserListContainer>
  );
};

export default UserList;
