import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import Notification from "../../components/Notification";
import { Endpoints } from "../../api";

const DataUserPage = () => {
  const [userData, setUserData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [msg, setMsg] = useState(""); // Message for success or error
  const [isError, setIsError] = useState(false);
  const [filterName, setFilterName] = useState(""); // State for filtering by name
  const [filterRole, setFilterRole] = useState(""); // State for filtering by role

  useEffect(() => {
    getData();
    getRoles();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(Endpoints.user);
      if (response.data.users && response.data.users.length >= 0) {
        setUserData(response.data.users);
      }
    } catch (error) {
      setMsg("Error fetching data");
      setIsError(true);
    }
  };

  const getRoles = async () => {
    try {
      const response = await axios.get(Endpoints.role);
      if (response.data.roles && response.data.roles.length >= 0) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      setMsg("Error fetching roles");
      setIsError(true);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${Endpoints.user}/${userId}`);
      setMsg("User successfully deleted");
      setIsError(false);
      getData(); // Refresh data after deletion
    } catch (error) {
      console.log(error);
      setMsg("Failed to delete user");
      setIsError(true);
    }
  };

  const getRoleName = (roleId) => {
    console.log(roles);
    console.log(roleId);
    const getRole = roles.find((role) => role.id === roleId);
    console.log(getRole);
    return getRole ? getRole.name : "Unknown";
  };

  // Filter userData based on filterName and filterRole
  const filteredUserData = userData.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(filterName.toLowerCase());
    const roleMatch = !filterRole || user.role_id === parseInt(filterRole);
    return nameMatch && roleMatch;
  });

  return (
    <Layout>
      <div className="z-999">
        <Notification message={msg} isError={isError} />
      </div>
      <div className="mt-5 container mx-auto">
        <h1 className="text-3xl font-semibold mb-3 text-center">Data User</h1>

        <div className="mt-4 mb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <input
              className="border border-gray-300 p-2 mr-2"
              type="text"
              placeholder="Filter by Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <select
              className="border border-gray-300 p-2"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Filter by Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <a
              className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg"
              href="/user/add"
            >
              Add User
            </a>
          </div>
        </div>

        <div className="mt-4 mb-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
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
                        <a
                          href={`/user/edit/${user.id}`}
                          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this user?"
                              )
                            ) {
                              deleteUser(user.id);
                            }
                          }}
                          className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default DataUserPage;
