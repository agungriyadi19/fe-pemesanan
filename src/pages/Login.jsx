import React, { useState } from "react";
import axios from "axios";
import { Endpoints } from "../api";
import Errors from "../components/Errors";
import { createCookie } from "../utils";

const LoginPage = ({ history }) => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  const { email, password } = login;

  const handleChange = (e) =>
    setLogin({ ...login, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await axios.post(Endpoints.login, {
        email,
        password,
      });

      const { token, success, errors = [], user } = response.data;
      if (success) {
        // creating a cookie expire in 30 minutes (same time as the token is invalidated on the backend)
        createCookie("token", token, 0.5);
        history.push({ pathname: "/session", state: user });
      } else {
        setErrors(errors);
      }
    } catch (e) {
      setErrors([e.toString()]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="wrapper">
        <h1>Login</h1>

        <input
          className="input"
          type="email"
          placeholder="email"
          value={email}
          name="email"
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="password"
          placeholder="password"
          value={password}
          name="password"
          onChange={handleChange}
          required
        />

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "....." : "login"}
        </button>
        <br />
        <a href="/register">{"create account"}</a>
        <br />
        <Errors errors={errors} />
      </div>
    </form>
  );
};

export default LoginPage;