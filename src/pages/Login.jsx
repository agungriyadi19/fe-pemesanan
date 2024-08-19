import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Endpoints } from "../api";
import { createCookie } from "../utils";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Use navigate instead of history

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

      const { token, success, user, errors } = response.data;
      if (success) {
        createCookie("token", token, 0.5); // Save token to cookie
        createCookie("role", user.role_id, 0.5); // Save token to cookie
        if (user.role_id === 1) { // Admin role
          navigate("/order");
        } else if (user.role_id === 2) { // Cashier role
          navigate("/cashier");
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Role Tidak Terdaftar',
            text: 'Akun Anda tidak memiliki akses ke halaman ini.',
            confirmButtonColor: '#d33',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: errors.join(', '),
          confirmButtonColor: '#d33',
        });
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full sm:w-1/2 lg:w-1/3">
          <h1 className="text-2xl mb-4 text-center">Masuk</h1>

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
              Kata Sandi
            </label>
            <input
              id="password"
              className="input-field border-b-2 border-gray-400 py-2 px-3 w-full focus:outline-none focus:border-blue-500"
              type="password"
              placeholder="Kata Sandi"
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
            {isSubmitting ? "Sedang Masuk..." : "Masuk"}
          </button>

        </div>
      </div>
    </form>
  );
};

export default Login;
