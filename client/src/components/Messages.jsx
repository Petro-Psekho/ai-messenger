import React, { useEffect, useState } from "react";
import styles from "../styles/Messages.module.css";

const Messages = ({ messages, name, lang }) => {
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const langUser = lang;

  // console.log("langUser", langUser);
  // console.log("name", name);
  // console.log("messages", messages);

  useEffect(() => {
    // Функция для перевода сообщения
    async function translateMessage(message, lang) {
      console.log(lang);
      try {
        const response = await fetch("http://localhost:5000/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, lang }),
        });

        const data = await response.json();
        return data.translatedMessage;
      } catch (error) {
        console.error("Ошибка при переводе сообщения:", error.message);
        return "Translation Error";
      }
    }

    // При каждом обновлении сообщений, переводим каждое сообщение на язык комнаты
    const translateMessages = async () => {
      try {
        const translated = await Promise.all(
          messages.map(({ user, message }) => {
            console.log("user", user);
            console.log("message", message);

            if (user.name === "Admin") {
              return message;
            }
            return user.name.trim().toLowerCase() === name.trim().toLowerCase()
              ? message
              : translateMessage(message, langUser); // Вместо user.lang используем langUser
          })
        );
        setTranslatedMessages(translated);
      } catch (error) {
        console.error("Ошибка при переводе сообщения:", error.message);
        // Если возникла ошибка при переводе, заменяем непереведенные сообщения текстом об ошибке
        const errorMessages = messages.map(() => "Translation Error");
        setTranslatedMessages(errorMessages);
      }
    };

    translateMessages();
  }, [messages, name, langUser]);

  return (
    <div className={styles.messages}>
      {messages.map(({ user }, i) => {
        const itsMe =
          user.name.trim().toLowerCase() === name.trim().toLowerCase();
        const className = itsMe ? styles.me : styles.user;

        console.log("messages ====>", messages);

        return (
          <div key={i} className={`${styles.message} ${className}`}>
            <span className={styles.user}>{user.name}</span>

            <div className={styles.text}>{translatedMessages[i]}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
