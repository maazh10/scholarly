import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import AddAppointmentModal from "./AddAppointmentModal";
import moment from "moment";
import apiService from "@/services/apiService";

import styles from "../styles/components/calendar.module.scss";

export default function Calendar() {
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await apiService.get("/users/me");
      const loggedInUser = (data as { user: any }).user;
      setUser(loggedInUser);
    };
    fetchUserData();
  }, []);

  async function handleEventAdd(data) {
    try {
      await apiService.post("/appointments", {
        startTime: data.event.start,
        endTime: data.event.extendedProps.extraData.end,
        tutorId: data.event.extendedProps.extraData.tutorId,
        studentId: data.event.extendedProps.extraData.studentId,
        subject: data.event.extendedProps.extraData.subject,
        notes: data.event.extendedProps.extraData.notes,
      });
      handleDatesSet({
        start: calendarRef.current.getApi().view.activeStart,
        end: calendarRef.current.getApi().view.activeEnd,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDatesSet(data) {
    try {
      const res = await apiService.get(
        `/appointments?start=${moment(data.start).toISOString()}&end=${moment(
          data.end
        ).toISOString()}`
      );
      const appts = (res as { appointments: any }).appointments;
      console.log(appts);
      const calendarApi = calendarRef.current.getApi();
      calendarApi.removeAllEvents();
      appts.forEach((appt) => {
        calendarApi.addEvent({
          title: `${appt.subject} with ${appt.Tutor.User.firstName}`,
          start: moment(appt.startTime).format(),
          end: moment(appt.endTime).format(),
          extraData: {
            tutorId: appt.tutorId,
            studentId: appt.studentId,
            subject: appt.subject,
            notes: appt.notes,
            end: moment(appt.endTime).format(),
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onApptAdded = (appt) => {
    console.log(appt);
    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent({
      title: `${appt.subject} with ${appt.tutor.User.firstName}}`,
      start: moment(appt.start).format(),
      end: moment(appt.end).format(),
      extraData: {
        tutorId: appt.tutor.id,
        studentId: user.studentId,
        subject: appt.subject,
        notes: appt.notes,
        end: moment(appt.end).format(),
      },
    });
  };

  return (
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
          eventAdd={(event) => handleEventAdd(event)}
          datesSet={(date) => handleDatesSet(date)}
        />
      </div>
      <AddAppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApptAdded={(appt) => onApptAdded(appt)}
      />
    </section>
  );
}
