import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Modal from '../Modal';
import { Endpoints } from '../../api';
import { readCookie } from '../../utils'; // Mengimpor fungsi readCookie

const FormTambahData = ({ isOpen, onClose, menuData, refreshData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(Endpoints.category);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Gagal mendapatkan data kategori:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset form ketika modal dibuka
      setName(menuData ? menuData.name : '');
      setDescription(menuData ? menuData.description : '');
      setPrice(menuData ? menuData.price : '');
      setCategory(menuData ? menuData.category_id : '');
      setImage(null);
      setImagePreview(menuData ? menuData.image_url : '');
    }
  }, [isOpen, menuData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category_id', category);
    if (image) {
      formData.append('image', image);
    }

    const token = readCookie('token'); // Mengambil token dari cookie
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Menambahkan header Authorization
        'Content-Type': 'multipart/form-data', // Untuk mengirim form data
      },
    };

    try {
      if (menuData) {
        await axios.put(`${Endpoints.menu}/${menuData.id}`, formData, config);
      } else {
        await axios.post(Endpoints.menu, formData, config);
      }
      swal('Berhasil', 'Menu berhasil disimpan', 'success');
      refreshData();
      onClose();
    } catch (error) {
      swal('Error', 'Gagal menyimpan menu', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 lg:w-full max-h-[90vh] overflow-auto">
        <h1 className="text-center font-bold text-xl mb-4">
          {menuData ? 'Ubah Menu' : 'Tambah Menu'}
        </h1>
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nama Menu
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Nama Menu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Deskripsi
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Deskripsi Menu"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Harga
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              placeholder="Harga Menu"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Kategori
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Gambar Menu
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-md" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {menuData ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FormTambahData;
