import React, { useRef, useEffect } from "react";
import apiService from "../services/apiService";
import { useRouter } from "next/router";
import styles from "../styles/components/navbar.module.scss";

const NavBar: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [showDropdown, setShowDropdown] = React.useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const data = await apiService.get("/users/me");
      const loggedInUser = (data as { user: any }).user;
      setUser(loggedInUser);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    await apiService.get("/users/logout");
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    checkAuth();
  }, [router.pathname]);

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
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/">
          <img src="/logo-transparent.png" alt="Logo" />
        </a>
      </div>
      <div className={styles.navbarLinks}>
        {user && <a href="/dashboard">Dashboard</a>}
        {user && user.userType === "student" && (
          <a href="/schedule">Schedule</a>
        )}
        <a href="/about">About Us</a>
        <a href="/contact">Contact Us</a>
        {user && <a href="/pdf">PDF Viewer</a>}
      </div>
      {!user && (
        <a className={styles.loginBtn} href="/login">
          Login
        </a>
      )}
      {user && (
        <>
          <button
            className={styles.donateBtn}
            onClick={() =>
              (window.location.href = process.env.NEXT_PUBLIC_STRIPE_DONATE_URL)
            }
          >
            Donate
          </button>
          <div ref={ref} className={styles.profileDropdown}>
            <img
              src={user.picture != null ? user.picture : "/user.png"}
              alt="Profile"
              className={styles.profilePic}
              onMouseOver={() => setShowDropdown(true)}
              onClick={() => setShowDropdown(true)}
            />
            {showDropdown && (
              <ul
                className={styles.pfpDropdownMenu}
                onMouseEnter={() => setShowDropdown(true)}
              >
                <a href="/profile">
                  <li>Profile</li>
                </a>
                <a onClick={handleLogout}>
                  <li>Logout</li>
                </a>
              </ul>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
