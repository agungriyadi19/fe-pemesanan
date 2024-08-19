import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import Swal from 'sweetalert2';
import { Endpoints } from "../../api";
import { numberWithCommas, readCookie } from '../../utils'; 
import FormTambahData from "../../components/menu/FormTambahData"; 
import FormEditData from "../../components/menu/FormEditData"; 

const ListMenuPage = () => {
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFormTambahDataOpen, setIsFormTambahDataOpen] = useState(false); 
  const [isFormEditDataOpen, setIsFormEditDataOpen] = useState(false); 
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const token = readCookie('token');
      const response = await axios.get(Endpoints.menu, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMenuData(response.data.menus);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = readCookie('token');
      const response = await axios.get(Endpoints.category, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (menuId) => {
    try {
      const token = readCookie('token');
      await axios.delete(`${Endpoints.menu}/${menuId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMenuData((prevMenuData) => prevMenuData.filter((menu) => menu.id !== menuId));
      Swal.fire("Sukses", "Menu berhasil dihapus", "success");
    } catch (error) {
      console.error("Error deleting menu:", error);
      Swal.fire("Error", "Gagal menghapus menu", "error");
    }
  };

  const handleEditClick = (menuId) => {
    setSelectedMenuId(menuId);
    setIsFormEditDataOpen(true);
  };

  const filteredMenuData = menuData?.filter(
    (menu) =>
      menu.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (selectedCategory === "" || menu.category_id.toString() === selectedCategory)
  );

  return (
    <Layout>
      <div className="mt-5 container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-3 text-center">Daftar Menu</h1>
        <div className="flex justify-between mb-4 items-center">
          <div className="flex space-x-2">
            <input
              className="border border-gray-300 p-2 rounded"
              type="text"
              placeholder="Cari berdasarkan nama"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <select
              className="border border-gray-300 p-2 rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsFormTambahDataOpen(true)}
          >
            Tambah Menu
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMenuData?.map((menu) => (
                <tr key={menu.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={`data:image/png;base64,${menu.image}`} alt={menu.name} className="w-24 h-24 object-cover rounded-md shadow-sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{menu.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{menu.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{numberWithCommas(menu.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categories.find(cat => cat.id === menu.category_id)?.name || "Tidak Diketahui"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                        onClick={() => handleEditClick(menu.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                        onClick={() => handleDelete(menu.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <FormTambahData 
          isOpen={isFormTambahDataOpen} 
          onClose={() => setIsFormTambahDataOpen(false)} 
          refreshData={fetchData}
        />

        <FormEditData 
          isOpen={isFormEditDataOpen} 
          onClose={() => setIsFormEditDataOpen(false)} 
          menuId={selectedMenuId}
          refreshData={fetchData}
        />
      </div>
    </Layout>
  );
};

export default ListMenuPage;
