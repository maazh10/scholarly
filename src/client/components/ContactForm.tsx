import React, { useState } from "react";
import styles from "../styles/components/contact-form.module.scss";
import { validate } from "../utils/validate";
import { toast } from "react-toastify";

interface ContactFormProps {
  onSubmit: (name: string, email: string, message: string) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setMessage("");
    const values = {
      name,
      email,
      message,
    };
    const errors = validate(values);
    if (errors && Object.keys(errors).length > 0) {
      toast.error("Wrong email format!");
      return;
    }
    onSubmit(name, email, message);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Message:
        <textarea
          value={message}
          required
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <button type="submit">Send</button>
    </form>
  );
};

export default ContactForm;
