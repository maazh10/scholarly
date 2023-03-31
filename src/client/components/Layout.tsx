import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  const hideNav =
    router.pathname === "/login" || router.pathname === "/meeting";
  const hideFooter =
    router.pathname === "/login" || router.pathname === "/meeting";

  return (
    <>
      {!hideNav && <NavBar />}
      <div>{children}</div>
      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;
