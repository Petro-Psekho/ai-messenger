import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from './App.styled';

import Home from './components/Home/Home';
import UserList from './components/UserList/UserList';
import Chat from './components/Chat/Chat';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/users" element={<UserList />} />
//         <Route path="/chat/:username" element={<Chat />} />
//       </Routes>
//     </Router>
//   );
// };

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Container>
              <Home />
            </Container>
          }
        />
        <Route
          path="/users"
          element={
            <Container>
              <UserList />
            </Container>
          }
        />
        <Route
          path="/chat/:username"
          element={
            <Container>
              <Chat />
            </Container>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
