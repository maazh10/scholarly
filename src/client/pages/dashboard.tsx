import React from "react";
import apiService from "@/services/apiService";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

export default function Dashboard() {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

  React.useEffect(() => {
    checkAuth();
    apiService.get("appointments").then((data) => {
      setBookings((data as { appointments: any[] }).appointments);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <h2>Appointment ID: {booking.id}</h2>
              <p>
                Tutor: {booking.TutorId}, Student: {booking.StudentId}
              </p>
              <p>Subject: {booking.subject}</p>
              <p>
                {booking.startTime} - {booking.endTime}
              </p>
              <button
                onClick={() =>
                  router.push(`meeting?appointmentId=${booking.id}`)
                }
              >
                Join Session
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
