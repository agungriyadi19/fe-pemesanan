import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import Swal from 'sweetalert2';
import { Endpoints } from "../../api";
import { readCookie } from '../../utils';
import FormTambahData from "../../components/user/FormTambahData";
import FormEditData from "../../components/user/FormEditData";

const DataUserPage = () => {
  const [userData, setUserData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (userId) => {
    setEditUserId(userId);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditUserId(null);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    getData();
    getRoles();
  }, []);

  const getData = async () => {
    const token = readCookie('token');
    try {
      const response = await axios.get(Endpoints.user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.users && response.data.users.length >= 0) {
        setUserData(response.data.users);
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan saat mengambil data", "error");
    }
  };

  const getRoles = async () => {
    const token = readCookie('token');
    try {
      const response = await axios.get(Endpoints.role, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.roles && response.data.roles.length >= 0) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan saat mengambil peran", "error");
    }
  };

  const deleteUser = async (userId) => {
    const token = readCookie('token');
    try {
      await axios.delete(`${Endpoints.user}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Swal.fire("Success", "Pengguna berhasil dihapus", "success");
      getData();
    } catch (error) {
      Swal.fire("Error", "Gagal menghapus pengguna", "error");
    }
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data pengguna ini akan dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!'
    });

    if (result.isConfirmed) {
      deleteUser(userId);
      Swal.fire(
        'Terhapus!',
        'Pengguna telah dihapus.',
        'success'
      );
    }
  };

  const getRoleName = (roleId) => {
    const getRole = roles.find((role) => role.id === roleId);
    return getRole ? getRole.name : "Tidak Dikenal";
  };

  const filteredUserData = userData.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(filterName.toLowerCase());
    const roleMatch = !filterRole || user.role_id === parseInt(filterRole);
    return nameMatch && roleMatch;
  });

  const handleDataChange = async () => {
    await getData(); // Refresh data
  };

  return (
    <Layout>
      <div className="mt-5 container mx-auto">
        <h1 className="text-3xl font-semibold mb-3 text-center">Data Staff</h1>

        <div className="mt-4 mb-4 grid gap-4 md:grid-cols-3 items-center">
          <div className="grid gap-2 md:col-span-2">
            <input
              className="border border-gray-300 p-2"
              type="text"
              placeholder="Filter berdasarkan Nama"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <select
              className="border border-gray-300 p-2"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Filter berdasarkan Peran</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="md:text-right"> */}
            <button
              className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg w-full md:w-auto"
              onClick={openAddModal}
            >
              Tambah Staff
            </button>
          {/* </div> */}
        </div>


        <div className="mt-4 mb-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telepon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peran
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUserData.length > 0 ? (
                filteredUserData.map((user, index) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRoleName(user.role_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(user.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FormTambahData isOpen={isAddModalOpen} onClose={closeAddModal} onDataChange={handleDataChange} />
      {isEditModalOpen && (
        <FormEditData isOpen={isEditModalOpen} onClose={closeEditModal} userId={editUserId} onDataChange={handleDataChange} />
      )}
    </Layout>

  );
};

export default DataUserPage;
