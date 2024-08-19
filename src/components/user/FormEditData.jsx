import React, { useEffect, useState } from "react";
import axios from "axios";
import { Endpoints } from "../../api";
import Modal from "../Modal";
import swal from 'sweetalert';
import { readCookie } from '../../utils'; // Assuming you have a utility to read cookies

const FormEditData = ({ isOpen, onClose, userId }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [roleID, setRoleID] = useState("");
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserAndRoles = async () => {
      try {
        const token = readCookie('token'); // Assuming you store the token in a cookie

        // Check if the user is authenticated
        if (token) {
          setIsAuthenticated(true);

          // Fetch user data by ID
          const userResponse = await axios.get(`${Endpoints.user}/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = userResponse.data.user;
          if (data) {
            setName(data.name);
            setEmail(data.email);
            setUsername(data.username);
            setRoleID(data.role_id);
            setPhone(data.phone);
          }

          // Fetch roles data
          const rolesResponse = await axios.get(Endpoints.role, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setRoles(rolesResponse.data.roles);
        } else {
          setIsAuthenticated(false);
          swal("Error", "Pengguna tidak terautentikasi", "error");
        }
      } catch (error) {
        setIsAuthenticated(false);
        swal("Error", "Gagal mendapatkan data", "error");
      }
    };

    if (userId) {
      fetchUserAndRoles();
    }
  }, [userId]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      swal("Error", "Tidak terautentikasi", "error");
      return;
    }

    try {
      const token = readCookie('token'); // Get the token for authentication
      const userData = {
        name,
        email,
        username,
        role_id: parseInt(roleID, 10),
        phone,
      };

      // Update user data
      await axios.put(`${Endpoints.user}/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      swal("Berhasil", "Pengguna berhasil diperbarui", "success");
      onClose(); // Close the modal on success
    } catch (error) {
      swal("Error", "Gagal memperbarui pengguna", "error");
    }
  };

  if (!isOpen || !isAuthenticated) {
    return null; // Return null if not authenticated or modal is not open
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 lg:w-full">
        <h1 className="text-center font-bold">Edit Staff</h1>
        <form onSubmit={handleFormSubmit} className="px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nama
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Nama Pengguna
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Nama Pengguna"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Telepon
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="text"
              placeholder="Telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role_id">
              Peran
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="role_id"
              value={roleID}
              onChange={(e) => setRoleID(e.target.value)}
            >
              <option value="">Pilih Peran</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FormEditData;
