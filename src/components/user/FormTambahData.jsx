import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Endpoints } from '../../api';
import swal from 'sweetalert';
import Modal from '../Modal';
import { readCookie } from '../../utils'; // Assuming you have a utility to read cookies

function FormTambahData({ isOpen, onClose, onDataChange }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [roleID, setRoleID] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(Endpoints.role);
        setRoles(response.data.roles);
      } catch (error) {
        console.error('Gagal mendapatkan data peran:', error);
      }
    };

    fetchRoles();
  }, []);

  const saveUser = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      swal('Error', 'Not authenticated', 'error');
      return;
    }

    const userData = {
      name,
      email,
      username,
      role_id: parseInt(roleID, 10),
      phone,
      password,
    };

    try {
      const token = readCookie('token'); // Get the token for authentication
      await axios.post(Endpoints.user, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      swal('Berhasil', 'Pengguna berhasil ditambahkan', 'success');
      onDataChange();
      onClose(); // Close the modal on success
    } catch (error) {
      if (error.response) {
        swal('Error', 'Gagal menambahkan pengguna', 'error');
      }
    }
  };

  // Check authentication on modal open
  useEffect(() => {
    if (isOpen) {
      const token = readCookie('token'); // Check if token is available
      setIsAuthenticated(!!token);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 lg:w-full">
        <h1 className="text-center font-bold">Tambah Staff</h1>
        <form onSubmit={saveUser} className="px-8 pt-6 pb-8 mb-4">
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Kata Sandi
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roleID">
              Peran
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="roleID"
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
              Tambah
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default FormTambahData;
