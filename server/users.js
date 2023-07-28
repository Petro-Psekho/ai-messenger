const trimStr = require("./utils");

let users = [];

const findUser = (user) => {
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  return users.find(
    (user) => trimStr(user.name) === userName && trimStr(user.room) === userRoom
  );
};

const addUser = (user) => {
  const isExist = findUser(user);

  !isExist && users.push(user);

  const currentUser = isExist || user;

  return { isExist: !!isExist, user: currentUser };
};

const getRoomsUser = (room) => {
  users.filter((u) => u.room === room);
};

module.exports = { addUser, findUser, getRoomsUser };
