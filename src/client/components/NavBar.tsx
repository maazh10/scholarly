import React, { useRef, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const NavBar = () => {
  const { user, isLoading } = useUser();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/">
          <img src="/logo-transparent-png.png" alt="Logo" />
        </a>
      </div>
      <div className="navbar-links">
        <a href="/">Home</a>
        {user && (
          <>
            <a href="/csr">Client-side rendered page</a>
            <a href="/ssr">Server-side rendered page</a>
          </>
        )}
        <a href="/about">About Us</a>
        <a href="/contact">Contact Us</a>
      </div>
      {!isLoading && !user && (
        <button className="login-btn">
          <a href="/api/auth/login">Login</a>
        </button>
      )}
      {!isLoading && user && (
        <div ref={ref} className="profile-dropdown">
          <img
            src={user.picture != null ? user.picture : ""}
            alt="Circle"
            className="profile-image"
            onMouseOver={() => setShowDropdown(true)}
            onClick={() => setShowDropdown(true)}
          />
          {showDropdown && (
            <ul
              className="pfp-dropdown-menu"
              onMouseEnter={() => setShowDropdown(true)}
            >
              <a href="/profile">
                <li>Profile</li>
              </a>
              <a href="/api/auth/logout">
                <li>Logout</li>
              </a>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
