import { useState } from "react";
import apiService from "../services/apiService";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

import styles from "../styles/login.module.scss";

export default function Login() {
  const [selectedOption, setSelectedOption] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [pageHeight, setPageHeight] = useState(100);
  const [subjects, setSubjects] = useState([]);

  const router = useRouter();

  const handleItemSelection = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => (option as { value: any }).value
    );
    setSubjects(selectedOptions);
  };

  const handleToggle = (event) => {
    setPageHeight(150);
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (isSignUp) {
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        toast.warn("Password do not match.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      try {
        const data = await apiService.post("/users/signup", {
          email: formData.get("email") as string,
          password,
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
          phoneNumber: formData.get("phoneNumber") as string,
          bio: formData.get("bio") as string,
          school: formData.get("school") as string,
          specialities: subjects,
          rate: formData.get("rate") as string,
          userType: selectedOption.toLowerCase(),
        });
        const res = data as { success: boolean };
        res.success &&
          toast.success("Successfully registered.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }) &&
          router.push("/dashboard");
      } catch (err) {
        toast.error(err.response.data.error, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      try {
        const data = await apiService.post("/users/login", {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        });
        const res = data as { success: boolean };
        res.success && router.push("/dashboard");
      } catch (err) {
        toast.error(err.response.data.error, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  return (
    <div style={{ height: pageHeight + "vh" }} className={styles.page}>
      <Head>
        <title>Login</title>
      </Head>
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
      <div className={styles.container}>
        <img
          src="/logo-transparent-dark.png"
          alt="Logo"
          className={styles.logo}
        />
        <h1>{isSignUp ? "Sign Up" : "Log In"}</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="johnd@mail.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            title="Must be at least 6 characters; Use one or more uppercase and lowercase letters as well as one or more numbers or special characters."
            type="password"
            id="password"
            name="password"
            required
          />

          {isSignUp && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
              />
              <label>I am a:</label>
              <div className={styles.toggle}>
                <label>
                  <input
                    type="radio"
                    value="Student"
                    checked={selectedOption === "Student"}
                    onChange={handleToggle}
                  />
                  <span>Student</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="Tutor"
                    checked={selectedOption === "Tutor"}
                    onChange={handleToggle}
                  />
                  <span>Tutor</span>
                </label>
              </div>
              {selectedOption === "Tutor" && (
                <>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                  />
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                  />
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="123-456-7890"
                  />
                  <label htmlFor="bio">Bio</label>
                  <textarea id="bio" name="bio" />
                  <label htmlFor="items">Specialities:</label>
                  <select
                    multiple
                    id="items"
                    name="items"
                    className={styles.specialities}
                    onChange={handleItemSelection}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Math">Math</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>

                  <label htmlFor="rate">Rate (Hourly in CAD)</label>
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    step="0.01"
                    placeholder="20.00"
                    required
                  />
                </>
              )}
              {selectedOption === "Student" && (
                <>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                  />
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                  />
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="123-456-7890"
                  />
                  <label htmlFor="bio">Bio</label>
                  <textarea id="bio" name="bio" />
                  <label htmlFor="school">School</label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    placeholder="University of Toronto"
                  />
                </>
              )}
            </>
          )}
          <button type="submit">{isSignUp ? "Sign Up" : "Log In"}</button>
        </form>
        <p>
          {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
          <button type="button" onClick={() => setIsSignUp((prev) => !prev)}>
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
