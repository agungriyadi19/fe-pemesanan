import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Notification from "../Notification";
import { Endpoints, apiURl } from "../../api";

const FormEditData = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch menu data by ID
        const response = await axios.get(`${Endpoints.menu}/${id}`);
        const data = response.data.menu;
        if (data) {
          setName(data.name);
          setImageUrl(`${apiURl}/${data.image}`); // Set URL for image preview
          setDescription(data.description);
          setPrice(data.price.toString());
          setCategoryId(data.category_id.toString());
        }
      } catch (error) {
        setMsg("Error fetching data");
        setIsError(true);
      }
    };

    const fetchCategories = async () => {
      try {
        // Fetch categories data
        const response = await axios.get(Endpoints.category);
        const categoriesData = response.data.categories;
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
    fetchCategories();
  }, [id]);

  // Function to handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile)); // Update imageUrl for preview
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseGet = await axios.get(`${Endpoints.menu}/${id}`);
      const data = responseGet.data.menu;

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
        formData.append("image", imageUrl.replace(`${apiURl}/${data.image}`, ""));
      }

      // Update menu data
      await axios.put(`${Endpoints.menu}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("Data successfully updated");
      setIsError(false);
    } catch (error) {
      setMsg("Failed to update data");
      setIsError(true);
    }
  };

/* eslint-disable */
  return (
    <div className="flex w-full justify-center items-center">
      <div className="z-999">
        <Notification message={msg} isError={isError} />
      </div>
      <div className="p-4 lg:w-1/2">
        <form
          onSubmit={handleFormSubmit}
          encType="multipart/form-data"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
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
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              Edit Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditData;
