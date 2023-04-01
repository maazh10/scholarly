import React from "react";
import styles from "../styles/home.module.scss";
import HomePage from "../components/HomePage";
 
export default function Index() {
  return (
    <div className={styles.page}>
      <HomePage/>
    </div>
  );
}
