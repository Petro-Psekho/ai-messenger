import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = ({ currentUser, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout(); // Вызов функции для выхода пользователя
    navigate('/login'); // Перенаправление на главную страницу
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/register">SignUp</Link>
          </li>
          <li>
            <Link to="/login">SignIn</Link>
          </li>
        </ul>
        {currentUser && (
          <div>
            <span>Current User: {currentUser}</span>
            <button onClick={handleLogoutClick}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
};

Header.propTypes = {
  currentUser: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
};

export default Header;
