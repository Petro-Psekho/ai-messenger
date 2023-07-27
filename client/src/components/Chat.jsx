import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/Chat.module.css";

import io from "socket.io-client";
const socket = io.connect("http://localhost:5000");

const Chat = () => {
  const { search } = useLocation();

  const [params, setParams] = useState(null);
  const [state, setState] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit("join", searchParams);
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      setState((_state) => [..._state, data]);
    });
  }, []);

  console.log("state", state);

  const leftRoom = () => {};
  const handleChange = () => {};

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>{params.room}</div>
        <div className={styles.users}> 0 users in this room</div>
        <button className={styles.left} onClick={leftRoom}>
          Left the room
        </button>
      </div>
      <div className={styles.messages}>
        {state.map(({ message }) => (
          <span>{message}</span>
        ))}
      </div>
      <form className={styles.form}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            placeholder="What do you wont to say? "
            value={message}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default Chat;
