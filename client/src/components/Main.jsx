import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/Main.module.css";

const FIELDS = {
  NAME: "name",
  LANG: "lang",
  ROOM: "room",
};

const Main = () => {
  const { NAME, ROOM, LANG } = FIELDS;
  const [values, setValues] = useState({ [NAME]: "", [ROOM]: "", [LANG]: "" });

  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value });
  };

  const handleClick = (e) => {
    const isDisabled = Object.values(values).some((value) => !value);
    if (isDisabled) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Join</h1>
        <form className={styles.form}>
          <div className={styles.group}>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="User Name"
              value={values[NAME]}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div className={styles.group}>
            <input
              className={styles.input}
              type="text"
              name="room"
              placeholder="Room"
              value={values[ROOM]}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div className={styles.group}>
            <input
              className={styles.input}
              type="text"
              name="lang"
              placeholder="Languege"
              value={values[LANG]}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <Link
            className={styles.group}
            onClick={handleClick}
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}&lang=${values[LANG]}`}
          >
            <button className={styles.button} type="submit">
              Sign In
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Main;
