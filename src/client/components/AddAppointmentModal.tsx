import React, { useState } from "react";
import Modal from "react-modal";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import classNames from "classnames";
import apiService from "@/services/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/components/add-appt.module.scss";

import Image from "next/image";

export default function AddAppointmentModal({ isOpen, onClose, onApptAdded }) {
  const [subject, setSubject] = useState("");
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [notes, setNotes] = useState("");

  const selectedTutorClass = classNames(styles.tutorCard, {
    [styles.selected]: true,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!subject || !start || !end) {
      toast.error("Please fill out all required fields");
      return;
    }
    if (!selectedTutor) {
      toast.error("Please select a tutor");
      return;
    }
    if (start.isAfter(end)) {
      toast.error("Start date must be before end date");
      return;
    }
    setSubject("");
    onApptAdded({ tutor: selectedTutor, subject, start, end, notes });
    onClose();
  };

  const handleSelect = async (e) => {
    const res = await apiService.get(`/users/tutors?subject=${e.target.value}`);
    setSelectedTutor(null);
    setTutors((res as { tutors: any }).tutors);
    setSubject(e.target.value);
  };

  const handleTutorSelect = (e, tutorId) => {
    const tutor = tutors.find((tutor) => tutor.id === tutorId);
    setSelectedTutor(tutor);
  };

  return (
    <Modal className={styles.modal} isOpen={isOpen} onRequestClose={onClose}>
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
      <div className={styles.header}>
        <h1>Schedule Appointment</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div className={styles.subject}>
          <label htmlFor="subject">Subject Area*</label>
          <select className={styles.subjects} onChange={handleSelect}>
            <option value="">Select a subject</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Math">Math</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="English">English</option>
            <option value="History">History</option>
          </select>
        </div>
        {subject && (
          <>
            <div className={styles.tutors}>
              {tutors.length > 0 ? (
                tutors.map((tutor) => (
                  <div
                    className={
                      selectedTutor?.id === tutor.id
                        ? selectedTutorClass
                        : styles.tutorCard
                    }
                    onClick={(e) => handleTutorSelect(e, tutor.id)}
                    key={tutor.id}
                  >
                    <div className={styles.tutorInfo}>
                      <div className={styles.tutorTitle}>
                        <Image
                          className={styles.tutorImg}
                          src="user.png"
                          alt="tutor"
                        />
                        <h3 className={styles.tutorName}>
                          {tutor.User.firstName + " " + tutor.User.lastName}
                        </h3>
                      </div>
                      <p className={styles.tutorBio}>{tutor.User.bio}</p>
                      <p>
                        Specialities:{" "}
                        {tutor.specialities.map((s) => s).join(", ")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tutors found for this subject as yet. Check back soon!</p>
              )}
            </div>
            <div className={styles.dates}>
              <div className={styles.date}>
                <Datetime
                  className={styles.dateTime}
                  value={start}
                  onChange={(date) => setStart(date)}
                />
                <label className={styles.label} htmlFor="start">
                  Start Time*
                </label>
              </div>
              <div className={styles.date}>
                <Datetime
                  className={styles.dateTime}
                  value={end}
                  onChange={(date) => setEnd(date)}
                />
                <label className={styles.label} htmlFor="end">
                  End Time*
                </label>
              </div>
            </div>
            <div className={styles.notesContainer}>
              <label>Meeting Notes</label>
              <textarea
                className={styles.notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </>
        )}

        <button className={styles.addBtn} type="submit">
          Add Appointment
        </button>
      </form>
    </Modal>
  );
}
