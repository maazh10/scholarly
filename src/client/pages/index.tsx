import React from "react";

import styles from "../styles/home.module.scss";

export default function Index() {
  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.top__left}>
          <h3 className={styles.top__welcome}>Welcome to</h3>
          <h1 className={styles.top__title}>Scholarly.</h1>
        </div>
        <div className={styles.top__right}>
          <a href="/login">
            <button className={styles.started}>Get Started</button>
          </a>
        </div>
      </div>
    </div>
  );
}
