/* eslint-disable @next/next/no-img-element */
import React, { useRef, useEffect } from "react";
import apiService from "../services/apiService";
import { useRouter } from "next/router";
import styles from "../styles/components/navbar.module.scss";

import Link from "next/link";

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
        <Link href="/">
          <img src="/logo-transparent.png" alt="Logo" />
        </Link>
      </div>
      <div className={styles.navbarLinks}>
        {user && <Link href="/dashboard">Dashboard</Link>}
        {user && user.userType === "student" && (
          <Link href="/schedule">Schedule</Link>
        )}
        {user && <Link href="/pdf">PDF Viewer</Link>}
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact Us</Link>
      </div>
      {!user && (
        <Link className={styles.loginBtn} href="/login">
          Login
        </Link>
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
                <Link href="/profile">
                  <li>Profile</li>
                </Link>
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
