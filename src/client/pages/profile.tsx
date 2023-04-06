/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import apiService from "../services/apiService";
import { useRouter } from "next/router";
import Head from "next/head";

import styles from "../styles/profile.module.scss";

export default function Profile() {
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();
  const [isEditable, setIsEditable] = useState(false);
  const [profile, setProfile] = useState({
    phone: "+1 123-456-7890",
    email: "john.doe@example.com",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  });

  const handleEditProfile = () => {
    setIsEditable(true);
  };

  const handleSaveProfile = async () => {
    try {
      await apiService.put("/users/me", {
        phoneNumber: profile.phone,
        email: profile.email,
        bio: profile.bio,
      });
    } catch (err) {
      console.log(err);
    }
    setIsEditable(false);
  };

  const checkAuth = async () => {
    try {
      const data = await apiService.get("/users/me");
      const loggedInUser = (data as { user: any }).user;
      setUser(loggedInUser);
      setProfile({
        phone: loggedInUser.phoneNumber,
        email: loggedInUser.email,
        bio: loggedInUser.bio,
      });
    } catch (err) {
      router.push("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      {!user && <Loading />}
      {user && (
        <>
          <div className={styles.profile}>
            <div className={styles.header}>
              <img
                className={styles.profilePic}
                src="/user.png"
                alt="Profile Picture"
              />
              <div className={styles.name}>
                {user.firstName + " " + user.lastName}
              </div>
            </div>
            <div className={styles.fields}>
              <div className={styles.field}>
                <div className={styles.label}>Phone Number:</div>
                {isEditable ? (
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                ) : (
                  <div className={styles.value}>{profile.phone}</div>
                )}
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Email Address:</div>
                {isEditable ? (
                  <input
                    type="text"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                ) : (
                  <div className={styles.value}>{profile.email}</div>
                )}
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Bio:</div>
                {isEditable ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                  />
                ) : (
                  <div className={styles.value}>{profile.bio}</div>
                )}
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Role:</div>
                <div className={styles.value}>{user.userType}</div>
              </div>
              <div className={styles.actions}>
                {isEditable ? (
                  <button onClick={handleSaveProfile}>Save</button>
                ) : (
                  <button onClick={handleEditProfile}>Edit</button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
