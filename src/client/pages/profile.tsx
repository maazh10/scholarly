import React, { useEffect } from "react";
import Loading from "../components/Loading";
import apiService from "../services/apiService";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Profile() {
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const data = await apiService.get("/users/me");
      const loggedInUser = (data as { user: any }).user;
      setUser(loggedInUser);
    } catch (err) {
      router.push("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <h1>Profile</h1>
      {!user && <Loading />}
      {user && user.userType === "tutor" && (
        <div>
          <h2>{user.firstName + " " + user.lastName}</h2>
          <h2>{user.email}</h2>
          <h2>{user.phoneNumber}</h2>
          <h2>{user.bio}</h2>
          <h2>{user.school}</h2>
          <h2>{user.specialities}</h2>
          <h2>{user.rate}</h2>
        </div>
      )}
      {user && user.userType === "student" && (
        <div>
          <h2>{user.firstName + " " + user.lastName}</h2>
          <h2>{user.email}</h2>
          <h2>{user.phoneNumber}</h2>
          <h2>{user.bio}</h2>
        </div>
      )}
    </>
  );
}
