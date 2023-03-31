import React, { useEffect } from "react";
import Modal from "react-modal";
import Calendar from "@/components/Calendar";
import { useRouter } from "next/router";
import apiService from "../services/apiService";
import Loading from "@/components/Loading";

import styles from "../styles/schedule.module.scss";

if (typeof window !== "undefined") {
  Modal.setAppElement(document.body);
}

export default function Schedule() {
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
      {user ? (
        <div className={styles.page}>
          <Calendar />
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
