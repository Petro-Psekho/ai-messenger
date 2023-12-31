import { useEffect, useState } from 'react';
import styles from '../styles/Messages.module.css';

const Messages = ({ messages, name, lang }) => {
  const [translatedMessages, setTranslatedMessages] = useState([]);

  useEffect(() => {
    async function translateMessage(message, lang) {
      try {
        const response = await fetch('http://localhost:5000/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, lang }),
        });

        const data = await response.json();
        return data.translatedMessage;
      } catch (error) {
        console.error('Error while translating a message:', error.message);
        return 'Translation Error';
      }
    }

    const translateMessages = async () => {
      try {
        const translated = await Promise.all(
          messages.map(({ user, message }) => {
            if (user.name === 'Admin') {
              return message;
            }
            return user.name.trim().toLowerCase() === name.trim().toLowerCase()
              ? message
              : translateMessage(message, lang);
          })
        );
        setTranslatedMessages(translated);
      } catch (error) {
        console.error('Error while translating a message:', error.message);

        const errorMessages = messages.map(() => 'Translation Error');
        setTranslatedMessages(errorMessages);
      }
    };

    translateMessages();
  }, [messages, name, lang]);

  return (
    <div className={styles.messages}>
      {messages.map(({ user }, i) => {
        const itsMe = user.name.trim().toLowerCase() === name.trim().toLowerCase();
        const className = itsMe ? styles.me : styles.user;

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
