import React from "react";
import NavBar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => (
  <>
    <NavBar />
    <div>{children}</div>
    <Footer />
  </>
);

export default Layout;
