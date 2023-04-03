import Head from "next/head";
import ContactForm from "../components/ContactForm";
import apiService from "@/services/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "../styles/contact.module.scss";

const onSubmit = async (name: string, email: string, message: string) => {
  try {
    const res = await apiService.post("/mail", {
      name,
      email,
      message,
    });
    console.log(res);
    toast.success("Message sent successfully! We will get back to you soon.");
  } catch (error) {
    toast.error("Message failed to send!");
    console.log(error);
  }
};

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      <div className={styles.page}>
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
        <h1 className={styles.title}>Contact Us</h1>
        <div className={styles.form__container}>
          <ContactForm onSubmit={onSubmit} />
        </div>
      </div>
    </>
  );
}
