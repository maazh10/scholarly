import React, { useRef, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const NavBar: React.FC = () => {
  const { user, isLoading } = useUser();
  const [showDropdown, setShowDropdown] = React.useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
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
            <a href="/call">Call</a>
            <a href="/csr">Client-side rendered page</a>
          </>
        )}
        <a href="/about">About Us</a>
        <a href="/contact">Contact Us</a>
      </div>
      {!isLoading && !user && (
        <a className="login-btn" href="/api/auth/login">
          Login
        </a>
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
