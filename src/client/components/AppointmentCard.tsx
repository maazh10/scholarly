import React from "react";
import styles from "../styles/components/appointment-card.module.scss";

import { useRouter } from "next/router";

const AppointmentCard = ({
  id,
  subject,
  tutor,
  tutee,
  start,
  end,
  notes,
  past,
}) => {
  const router = useRouter();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Appointment ID: {id}</h3>
      </div>
      <div className={styles.body}>
        <p>
          <strong>Subject:</strong> {subject}
        </p>
        <p>
          <strong>Tutor:</strong> {tutor}
        </p>
        <p>
          <strong>Tutee:</strong> {tutee}
        </p>
        <p>
          <strong>Start Time:</strong> {start}
        </p>
        <p>
          <strong>End Time:</strong> {end}
        </p>
        <p>
          <strong>Meeting Notes:</strong> {notes}
        </p>
      </div>
      {!past && (
        <div className={styles.footer}>
          <button onClick={() => router.push(`meeting?appointmentId=${id}`)}>
            Join Session
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
