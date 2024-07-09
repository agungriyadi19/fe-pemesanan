import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import Notification from "../../components/Notification";
import { Endpoints, apiURl } from "../../api";

const DataMenuPage = () => {
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState(""); // Message for success or error
  const [isError, setIsError] = useState(false);
  const [filterName, setFilterName] = useState(""); // State for filtering by name
  const [filterCategory, setFilterCategory] = useState(""); // State for filtering by category
  const [viewMode, setViewMode] = useState("table"); // State for toggling between table and card view

  useEffect(() => {
    getData();
    getCategories();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(Endpoints.menu);
      if (response.data.menus && response.data.menus.length > 0) {
        setMenuData(response.data.menus);
      }
    } catch (error) {
      setMsg("Error fetching data");
      setIsError(true);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(Endpoints.category);
      if (response.data.categories && response.data.categories.length > 0) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      setMsg("Error fetching categories");
      setIsError(true);
    }
  };

  const deleteMenu = async (menuId) => {
    try {
      await axios.delete(`${Endpoints.menu}/${menuId}`);
      setMsg("Data successfully deleted");
      setIsError(false);
      getData(); // Refresh data after deletion
    } catch (error) {
      console.log(error);
      setMsg(error);
      setIsError(true);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Filter menuData based on filterName and filterCategory
  const filteredMenuData = menuData.filter((menu) => {
    const nameMatch = menu.name.toLowerCase().includes(filterName.toLowerCase());
    const categoryMatch = !filterCategory || menu.category_id === parseInt(filterCategory);
    return nameMatch && categoryMatch;
  });

  return (
    <Layout>
      <div className="z-999">
        <Notification message={msg} isError={isError} />
      </div>
      <div className="mt-5 container mx-auto">
        <h1 className="text-3xl font-semibold mb-3 text-center">Data Menu</h1>

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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Filter by Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <a
              className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg"
              href="/menu/add"
            >
              Tambah Data
            </a>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg"
              onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
            >
              {viewMode === "table" ? "Card View" : "Table View"}
            </button>
          </div>
        </div>

        {viewMode === "table" ? (
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
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMenuData.length > 0 ? (
                  filteredMenuData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <img
                          src={`${apiURl}/${item.image}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCategoryName(item.category_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <a
                            href={`/menu/edit/${item.id}`}
                            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this menu?"
                                )
                              ) {
                                deleteMenu(item.id);
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
        ) : (
          <div className="mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMenuData.length > 0 ? (
              filteredMenuData.map((item, index) => (
                <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img
                    src={`${apiURl}/${item.image}`}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-700 mb-2">{item.description}</p>
                    <p className="text-gray-700 mb-2">Price: {item.price}</p>
                    <p className="text-gray-700 mb-4">Category: {getCategoryName(item.category_id)}</p>
                    <div className="flex justify-between">
                      <a
                        href={`/menu/edit/${item.id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this menu?"
                            )
                          ) {
                            deleteMenu(item.id);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-700">No data found.</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DataMenuPage;
