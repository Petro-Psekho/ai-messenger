import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserList = ({ currentUser }) => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('userList-------------->>>>', userList);
  }, [userList]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      const users = response.data;
      setUserList(users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async id => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      const updatedUserList = userList.filter(user => user._id !== id);
      setUserList(updatedUserList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChatClick = (userId, username) => {
    navigate(`/chat/${userId}&username${username}`);
  };

  if (!userList || userList.length === 0) {
    return <p>No users available.</p>;
  }

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {userList.map(user => (
          <li key={user._id}>
            <p>
              {user.username} ({user.language})
              {currentUser && (
                <>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                  <button onClick={() => handleChatClick(user._id, user.username)}>Chat</button>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

UserList.propTypes = {
  currentUser: PropTypes.string,
};

export default UserList;
