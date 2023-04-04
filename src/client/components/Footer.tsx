import React from "react";

import styles from "../styles/components/footer.module.scss";

const Footer = () => (
  <footer className={styles.footer}>
    <p>Footer</p>
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
  </footer>
);

export default Footer;
