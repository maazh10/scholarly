import { useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { validate } from "../utils/validate";
import Input from "./Input";
import TextArea from "./TextArea";
import apiService from "../services/apiService";

interface IValues {
  name: string;
  email: string;
  message: string;
}
interface IErrors extends Partial<IValues> {}
export const ContactForm = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<IErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [messageState, setMessageState] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(values);
    if (errors && Object.keys(errors).length > 0) {
      return setErrors(errors);
    }
    setErrors({});
    setLoading(true);
    apiService
      .post("/mail", {
        name: values.name,
        email: values.email,
        message: values.message,
      })
      .then((res) => {
        if ((res as { status: any, data: any }).status === 200) {
          setValues({ name: "", email: "", message: "" });
          setLoading(false);
          setSuccess(true);
          setMessageState((res as { status: any, data: any }).data.message);
        } else {
          setLoading(false);
          setMessageState((res as { status: any, data: any }).data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        setMessageState(String(err.message));
      });
    setLoading(false);
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValues((prevInput) => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={values.name}
        onChange={handleChange}
        id="name"
        name="name"
        label="Your Name"
        placeholder="John Doe"
        error={!!errors.name}
        errorMessage={!!errors.name ? errors.name : ""}
      />
      <Input
        value={values.email}
        onChange={handleChange}
        id="email"
        name="email"
        label="Your Email"
        placeholder="you@example.com"
        error={!!errors.email}
        errorMessage={!!errors.email ? errors.email : ""}
      />
      <TextArea
        value={values.message}
        onChange={handleChange}
        id="message"
        name="message"
        label="Your Message"
        placeholder="Your message here..."
        error={!!errors.message}
        errorMessage={!!errors.message ? errors.message : ""}
      />
      <button
        className="mt-4 w-full rounded-md bg-blue-600 py-3 px-5 text-lg text-white outline-none hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading !== true ? (
          "SUBMIT"
        ) : (
          <div className="flex h-full w-full items-center justify-center ">
            <RiLoader5Fill className="h-8 w-8 animate-spin" />
          </div>
        )}
      </button>
      <p className="mt-5 text-green-500 dark:text-green-500">
        {success !== false ? (
          messageState
        ) : (
          <span className="text-red-500 dark:text-red-500">{messageState}</span>
        )}
      </p>
    </form>
  );
};