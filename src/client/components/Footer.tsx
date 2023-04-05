import React from "react";

import styles from "../styles/components/footer.module.scss";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.left}>
      <img src="/logo.png" alt="logo" />
      <div className={styles.logoText}>
        <h1>Scholarly.</h1>
        <p>© 2023 Scholarly. All rights reserved.</p>
      </div>
    </div>
    <div className={styles.right}>
      <h3>Credits</h3>
      <a href="https://www.flaticon.com/free-icons/user" title="user icons">
        User icons created by Flat Icons - Flaticon
      </a>
      <a
        target="_blank"
        href="https://icons8.com/icon/CNS2xX2b_Fe1/call-disconnected"
      >
        Call Disconnected
      </a>{" "}
      icon by{" "}
      <a target="_blank" href="https://icons8.com">
        Icons8
      </a>
    </div>
  </footer>
);

export default Footer;
