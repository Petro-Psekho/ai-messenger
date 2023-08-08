import React, { useEffect, useState } from 'react';
import styles from '../styles/Messages.module.css';

const Messages = ({ messages, name, lang }) => {
  // Состояние для хранения переведенных сообщений
  const [translatedMessages, setTranslatedMessages] = useState([]);

  console.log('translatedMessages', translatedMessages);
  // Язык пользователя
  const langUser = lang;

  useEffect(() => {
    // Функция для перевода сообщения
    async function translateMessage(message, lang) {
      try {
        // Отправляем запрос на сервер для перевода
        const response = await fetch('http://localhost:5000/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, lang }),
        });

        // Получаем ответ от сервера и извлекаем переведенное сообщение
        const data = await response.json();
        return data.translatedMessage;
      } catch (error) {
        console.error('Ошибка при переводе сообщения:', error.message);
        return 'Translation Error';
      }
    }

    // Преобразуем массив объектов сообщений в строку для перевода
    const messagesToString = JSON.stringify(messages);

    // Переводим строку сообщений
    const translateMessages = async () => {
      try {
        // Получаем переведенную строку от сервера
        const translatedString = await translateMessage(messagesToString, langUser);
        // Преобразуем переведенную строку обратно в массив объектов
        const translatedArray = JSON.parse(translatedString);

        // Устанавливаем переведенные сообщения в состояние
        setTranslatedMessages(translatedArray);
      } catch (error) {
        console.error('Ошибка при переводе сообщений:', error.message);
        // Если возникла ошибка при переводе, заменяем непереведенные сообщения текстом об ошибке
        const errorMessages = messages.map(() => 'Translation Error');
        setTranslatedMessages(errorMessages);
      }
    };

    // Вызываем функцию перевода при изменении массива сообщений, имени пользователя или языка
    translateMessages();
  }, [messages, name, langUser]);

  // Отображение компонента
  return (
    <div className={styles.messages}>
      {/* Маппинг и отображение переведенных сообщений */}
      {translatedMessages.map(({ user }, i) => {
        // Проверяем, отправлено ли сообщение мной
        const itsMe = user.name.trim().toLowerCase() === name.trim().toLowerCase();
        // Выбираем класс стиля в зависимости от того, мое ли это сообщение
        const className = itsMe ? styles.me : styles.user;

        // Отображаем сообщение и его автора
        return (
          <div key={i} className={`${styles.message} ${className}`}>
            <span className={styles.user}>{user.name}</span>
            <div className={styles.text}>{translatedMessages[i].message}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
