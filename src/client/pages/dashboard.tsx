import React from "react";
import apiService from "@/services/apiService";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import moment from "moment";
import AppointmentCard from "@/components/AppointmentCard";
import Head from "next/head";

import styles from "../styles/dashboard.module.scss";

export default function Dashboard() {
  const [loading, setLoading] = React.useState(true);
  const [upcomingAppts, setUpcomingAppts] = React.useState([]);
  const [pastAppts, setPastAppts] = React.useState([]);
  const [user, setUser] = React.useState(null);

  const router = useRouter();

  const checkAuth = async () => {
    try {
      const data = await apiService.get("/users/me");
      const loggedInUser = (data as { user: any }).user;
      setUser(loggedInUser);
      setLoading(false);
    } catch (err) {
      router.push("/login");
    }
  };

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const parseTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const time = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes} ${time}`;
  };

  React.useEffect(() => {
    checkAuth();
    apiService
      .get(
        `appointments?start=${moment().toISOString()}&end=3099-03-30T00:00:00.000Z`
      )
      .then((data) => {
        setUpcomingAppts((data as { appointments: any[] }).appointments);
      });
    apiService
      .get(
        `appointments?start=1970-03-30T00:00:00.000Z&end=${moment().toISOString()}`
      )
      .then((data) => {
        setPastAppts((data as { appointments: any[] }).appointments);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <div className={styles.page}>
            <div className={styles.welcome}>
              <h1>Welcome, {user.firstName}!</h1>
            </div>
            <div className={styles.apptContainer}>
              <h1>Upcoming Appointments</h1>
              <div className={styles.appt}>
                {upcomingAppts.length > 0 ? (
                  upcomingAppts.map((booking) => (
                    <AppointmentCard
                      key={booking.id}
                      id={booking.id}
                      tutor={booking.Tutor.User.firstName}
                      tutee={booking.Student.User.firstName}
                      subject={booking.subject}
                      date={parseDate(booking.startTime)}
                      start={parseTime(booking.startTime)}
                      end={parseTime(booking.endTime)}
                      notes={booking.notes}
                      past={false}
                    />
                  ))
                ) : (
                  <p>You have no upcoming appointments.</p>
                )}
              </div>
            </div>
            <div className={styles.apptContainer}>
              <h1>Past Appointments</h1>
              <div className={styles.appt}>
                {pastAppts.length > 0 ? (
                  pastAppts.map((booking) => (
                    <AppointmentCard
                      key={booking.id}
                      id={booking.id}
                      tutor={booking.Tutor.User.firstName}
                      tutee={booking.Student.User.firstName}
                      subject={booking.subject}
                      date={parseDate(booking.startTime)}
                      start={parseTime(booking.startTime)}
                      end={parseTime(booking.endTime)}
                      notes={booking.notes}
                      past={true}
                    />
                  ))
                ) : (
                  <p>You have no past appointments.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
