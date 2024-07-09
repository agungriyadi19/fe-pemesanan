import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../Notification";
import { Endpoints } from "../../api";

function FormTambahData() {
  const [orderCode, setOrderCode] = useState("");
  const [amount, setAmount] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [statusID, setStatusID] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [menuID, setMenuID] = useState("");
  const [menus, setMenus] = useState([]);
  const [msg, setMsg] = useState(""); // For storing success or error messages
  const [isError, setIsError] = useState(false);

  // Fetch menus when the component mounts
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(Endpoints.menu);
        setMenus(response.data.menus);
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    };
    fetchMenus();
  }, []);

  // Handle form submission
  const saveOrder = async (e) => {
    e.preventDefault();
    const orderData = {
      order_code: orderCode,
      amount: amount,
      table_number: tableNumber,
      status_id: parseInt(statusID),
      order_date: orderDate,
      menu_id: parseInt(menuID),
    };

    try {
      await axios.post(Endpoints.order, orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMsg("Order Berhasil Ditambah");
      setIsError(false);
    } catch (error) {
      setMsg("Order Gagal Ditambah");
      setIsError(true);
    }
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="z-999">
        <Notification message={msg} isError={isError} />
      </div>
      <div className="p-4 lg:w-1/2">
        <form
          onSubmit={saveOrder}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="orderCode"
            >
              Order Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="orderCode"
              type="text"
              placeholder="Order Code"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tableNumber"
            >
              Table Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tableNumber"
              type="text"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="statusID"
            >
              Status ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="statusID"
              type="number"
              placeholder="Status ID"
              value={statusID}
              onChange={(e) => setStatusID(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="orderDate"
            >
              Order Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="orderDate"
              type="date"
              placeholder="Order Date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="menuID"
            >
              Menu
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="menuID"
              value={menuID}
              onChange={(e) => setMenuID(e.target.value)}
              required
            >
              <option value="">Select Menu</option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Tambah Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormTambahData;
