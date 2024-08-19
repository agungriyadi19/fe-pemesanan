import React, { useEffect, useState } from "react";
import axios from "axios";
import { Endpoints, apiURl } from "../../api";
import Modal from "../Modal";
import swal from 'sweetalert';
import { readCookie } from '../../utils'; // Assuming you have a utility to read cookies

const FormEditData = ({ isOpen, onClose, menuId, refreshData }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchMenuAndCategories = async () => {
      try {
        const token = readCookie('token'); // Assuming you store the token in a cookie

        // Check if the user is authenticated
        if (token) {
          setIsAuthenticated(true);

          // Fetch menu data by ID
          const menuResponse = await axios.get(`${Endpoints.menu}/${menuId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = menuResponse.data.menu;
          if (data) {
            setName(data.name);
            setImageUrl(`${apiURl}/${data.image}`); // Set URL for image preview
            setDescription(data.description);
            setPrice(data.price.toString());
            setCategoryId(data.category_id.toString());
          }

          // Fetch categories data
          const categoriesResponse = await axios.get(Endpoints.category, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setCategories(categoriesResponse.data.categories);
        } else {
          setIsAuthenticated(false);
          swal("Error", "User not authenticated", "error");
        }
      } catch (error) {
        setIsAuthenticated(false);
        swal("Error", "Error fetching data", "error");
      }
    };

    if (menuId) {
      fetchMenuAndCategories();
    }
  }, [menuId]);

  // Function to convert file to base64 string
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to handle file input change
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const base64 = await fileToBase64(selectedFile);
      setImage(selectedFile);
      setImageUrl(base64); // Update imageUrl for preview
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      swal("Error", "Not authenticated", "error");
      return;
    }

    try {
      const token = readCookie('token'); // Get the token for authentication

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category_id", category_id);
      
      // Check if user selected a new image
      if (image) {
        formData.append("image", image);
      } else {
        // Use previous image if no new image selected
        formData.append("image", imageUrl.replace(`${apiURl}/`, ""));
      }

      // Update menu data
      await axios.put(`${Endpoints.menu}/${menuId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });

      swal("Success", "Menu successfully updated", "success");
      refreshData();
      onClose(); // Close the modal on success
    } catch (error) {
      swal("Error", "Failed to update menu", "error");
    }
  };

  if (!isOpen || !isAuthenticated) {
    return null; // Return null if not authenticated or modal is not open
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 lg:w-full max-h-[90vh] overflow-auto">
        <h1 className="text-center font-bold">Edit Menu</h1>
        <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            {imageUrl && (
              <div className="mb-2">
                <img src={imageUrl} alt="Image Preview" className="max-h-40 mb-2" />
              </div>
            )}
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">
              Category
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category_id"
              value={category_id}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
