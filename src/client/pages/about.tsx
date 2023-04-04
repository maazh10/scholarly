import React from "react";
import Head from "next/head";

import styles from "../styles/about.module.scss";

export default function About() {
  return (
    <div className={styles.page}>
      <Head>
        <title>About</title>
      </Head>
      <h2 className={styles.primaryheading}>About</h2>
      <h3 className={styles.primarysubheading}>
        Welcome to Scholarly! We are a tutoring app designed to provide students
        with a personalized and engaging learning experience. Our team of three
        developers created Scholarly with the goal of making education more
        accessible and enjoyable for everyone.
      </h3>
      <p className={styles.primarytext}>
        With Scholarly, you can connect with expert tutors in any subject,
        anywhere and anytime. Our video chat feature allows you to have
        one-on-one sessions with your tutor, where you can ask questions,
        receive personalized feedback and guidance, and work through difficult
        concepts. Our meeting scheduling ability ensures that you can easily
        schedule and manage tutoring sessions according to your own
        availability.
      </p>
      <p className={styles.primarytext}>
        At Scholarly, we understand that every student has unique learning needs
        and styles. Our tutors are highly qualified and experienced in their
        respective fields, ensuring that you receive the best possible guidance
        and support.
      </p>
      <p className={styles.primarytext}>
        Our mission at Scholarly is to empower students to achieve their
        academic goals and succeed in their studies. We believe that education
        should be accessible to everyone, and we are committed to providing
        high-quality tutoring services at affordable prices.
      </p>
      <p className={styles.primarytext}>
        Thank you for choosing Scholarly as your go-to tutoring app. We are
        dedicated to providing you with the best possible learning experience,
        and we look forward to helping you achieve your full potential.
      </p>
    </div>
  );
}
