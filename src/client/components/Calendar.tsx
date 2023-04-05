import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import AddAppointmentModal from "./AddAppointmentModal";
import moment from "moment";
import apiService from "@/services/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "../styles/components/calendar.module.scss";

export default function Calendar() {
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await apiService.get("/users/me");
      const loggedInUser = (data as { user: any }).user;
      setUser(loggedInUser);
    };
    fetchUserData();
  }, []);

  async function handleDatesSet(data) {
    try {
      const res = await apiService.get(
        `/appointments?start=${moment(data.start).toISOString()}&end=${moment(
          data.end
        ).toISOString()}`
      );
      const appts = (res as { appointments: any }).appointments;
      const calendarApi = calendarRef.current.getApi();
      calendarApi.removeAllEvents();
      appts.forEach((appt) => {
        calendarApi.addEvent({
          title: `${appt.subject} with ${appt.Tutor.User.firstName}`,
          start: moment(appt.startTime).format(),
          end: moment(appt.endTime).format(),
          extraData: {
            id: appt.id,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onApptAdded = async (appt) => {
    try {
      toast.warn(
        `A confirmation text has been sent to your phone number: ${user.phoneNumber}`
      );
      await apiService.post("/appointments", {
        startTime: moment(appt.start).format(),
        endTime: moment(appt.end).format(),
        tutorId: appt.tutor.id,
        studentId: user.studentId,
        subject: appt.subject,
        notes: appt.notes,
      });
      let calendarApi = calendarRef.current.getApi();
      calendarApi.addEvent({
        title: `${appt.subject} with ${appt.tutor.User.firstName}}`,
        start: moment(appt.start).format(),
        end: moment(appt.end).format(),
      });
      handleDatesSet({
        start: calendarRef.current.getApi().view.activeStart,
        end: calendarRef.current.getApi().view.activeEnd,
      });
      toast.success("Appointment confirmed!");
    } catch (error) {
      toast.error("Appointment was not confirmed.");
    }
  };

  const handleEventDelete = async (id) => {
    try {
      await apiService.delete(`/appointments/${id}`);
      toast.success("Appointment deleted!");
      handleDatesSet({
        start: calendarRef.current.getApi().view.activeStart,
        end: calendarRef.current.getApi().view.activeEnd,
      });
    } catch (error) {
      toast.error("An error occured while deleting the appointment.");
    }
  };

  const eventContent = (eventInfo) => {
    return (
      <div className={styles.event}>
        <b className={styles.b}>{eventInfo.timeText}</b>
        <i className={styles.info}>{eventInfo.event.title}</i>
        <button
          className={styles.deleteBtn}
          onClick={() =>
            handleEventDelete(eventInfo.event.extendedProps.extraData.id)
          }
        ></button>
      </div>
    );
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <section className={styles.calendar}>
        <button className={styles.addEvent} onClick={() => setModalOpen(true)}>
          Schedule Appointment
        </button>
        <div style={{ position: "relative", zIndex: 0 }}>
          <FullCalendar
            viewClassNames={styles.fc}
            dayHeaderClassNames={styles.dhFC}
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            height={800}
            datesSet={(date) => handleDatesSet(date)}
            eventContent={eventContent}
          />
        </div>
        <AddAppointmentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onApptAdded={(appt) => onApptAdded(appt)}
        />
      </section>
    </>
  );
}
