import React, { useState } from "react";
import axios from "axios";
import { Endpoints } from "../api";
import { createCookie } from "../utils";

const Login = ({ history }) => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const { token, success, user } = response.data;
      if (success) {
        // creating a cookie expire in 30 minutes (same time as the token is invalidated on the backend)
        createCookie("token", token, 0.5);
        history.push({ pathname: "/session", state: user });
      } else {
        // setErrors(errors);
      }
    } catch (e) {
      // setErrors([e.toString()]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full sm:w-1/2 lg:w-1/3">
          <h1 className="text-2xl mb-4 text-center">Login</h1>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              className="input-field border-b-2 border-gray-400 py-2 px-3 w-full focus:outline-none focus:border-blue-500"
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              className="input-field border-b-2 border-gray-400 py-2 px-3 w-full focus:outline-none focus:border-blue-500"
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

        </div>
      </div>
    </form>
  );
};

export default Login;
