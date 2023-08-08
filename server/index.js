const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const axios = require('axios');

require('dotenv').config();

const { API_KEY, API_URL, MODEL, PROMT } = process.env;

const route = require('./route');

const { addUser, findUser, getRoomUsers, removeUser } = require('./users');

app.use(cors({ origin: '*' }));
app.use(route);
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.post('/translate', async (req, res) => {
  console.log('Received a translation request'); // Добавить эту строку
  const { message, lang } = req.body;
  try {
    console.log('Translating message:', message); // Добавить эту строку
    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            // content: `you're a professional polyglot translator, translate the message into ${lang}`,
            content: PROMT,
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const translatedMessage = response.data.choices[0].message.content;

    res.json({ translatedMessage });
  } catch (error) {
    console.error(`Call error API ${MODEL}:`, error.message);
    res.status(500).json({ error: 'Translation Error' });
  }
});

async function translateMessage(message, lang) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            // content: `you're a professional polyglot translator, translate the message into ${lang}`,
            content: PROMT,
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`Call error API ${MODEL}:`, error.message);

    throw error;
  }
}

io.on('connection', socket => {
  console.log('User connected'); // Добавить эту строку
  socket.on('join', ({ name, room, lang }) => {
    console.log(`${name} joined room ${room}`); // Добавить эту строку

    socket.join(room);

    const { user, isExist } = addUser({ name, room, lang });

    const userMessage = isExist ? `${user.name}, here you go again` : `Hello ${user.name}`;

    socket.emit('message', {
      data: { user: { name: 'Admin' }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit('message', {
      data: { user: { name: 'Admin' }, message: `${user.name} has joined` },
    });

    io.to(user.room).emit('room', {
      data: { users: getRoomUsers(user.room) },
    });
  });

  socket.on('sendMessage', async ({ message, params }) => {
    console.log('Received a message:', message); // Добавить эту строку
    const user = findUser(params);

    // if (user) {
    //   io.to(user.room).emit("message", { data: { user, message } });
    // }

    if (user) {
      console.log('Translating message for:', user.name); // Добавить эту строку
      // Здесь вызываем функцию для перевода сообщения на язык юзера
      const translatedMessage = await translateMessage(message, user.lang);

      // Отправляем переведенное сообщение обратно в комнату
      io.to(user.room).emit('message', {
        data: { user, message: translatedMessage },
      });
    }
  });

  socket.on('leftRoom', ({ params }) => {
    console.log('User left the room'); // Добавить эту строку
    const user = removeUser(params);

    if (user) {
      const { room, name } = user;

      io.to(room).emit('message', {
        data: { user: { name: 'Admin' }, message: `${name} has left` },
      });

      io.to(room).emit('room', {
        data: { users: getRoomUsers(room) },
      });
    }
  });

  io.on('disconnect', () => {
    console.log('Disconnect');
  });
});

server.listen(5000, () => {
  console.log('==== Server is running ====');
});
