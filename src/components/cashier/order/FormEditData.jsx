/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Endpoints } from "../../api";
import Notification from "../../components/Notification";

const FormEditData = () => {
  const [amount, setAmount] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [statusId] = useState(1); // Default status ID
  const [orderDate, setOrderDate] = useState("");
  const [menuId, setMenuId] = useState("");
  const [menus, setMenus] = useState([]);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(Endpoints.menu);
        setMenus(response.data.menus);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    fetchMenus();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(Endpoints.order, {
        amount,
        table_number: tableNumber,
        status_id: statusId,
        order_date: orderDate,
        menu_id: menuId,
      });
      setMsg("Order successfully created");
      setIsError(false);
    } catch (error) {
      setMsg("Failed to create order");
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
          onSubmit={handleFormSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tableNumber">
              Table Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tableNumber"
              type="text"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderDate">
              Order Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="orderDate"
              type="date"
              placeholder="Order Date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="menuId">
              Menu
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="menuId"
              value={menuId}
              onChange={(e) => setMenuId(e.target.value)}
            >
              <option value="">Select a menu</option>
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
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditData;
