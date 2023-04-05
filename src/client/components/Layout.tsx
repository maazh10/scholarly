import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useRouter } from "next/router";

import styles from "../styles/components/layout.module.scss";

const Layout = ({ children }) => {
  const router = useRouter();
  const hideNav =
    router.pathname === "/login" || router.pathname === "/meeting";
  const hideFooter =
    router.pathname === "/login" || router.pathname === "/meeting";

  return (
    <div className={styles.page}>
      {!hideNav && <NavBar />}
      <div>{children}</div>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
