import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import Notification from "../../components/Notification";
import { Endpoints } from "../../api";

const DataOrderPage = () => {
  const [orderData, setOrderData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [msg, setMsg] = useState(""); // Message for success or error
  const [isError, setIsError] = useState(false);
  const [filterOrderCode, setFilterOrderCode] = useState(""); // State for filtering by order code
  const [filterStatus, setFilterStatus] = useState(""); // State for filtering by status

  useEffect(() => {
    getData();
    getStatuses();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(Endpoints.order);
      if (response.data.orders && response.data.orders.length >= 0) {
        setOrderData(response.data.orders);
      }
    } catch (error) {
      setMsg("Error fetching data");
      setIsError(true);
    }
  };

  const getStatuses = async () => {
    try {
      const response = await axios.get(Endpoints.status);
      if (response.data.statuses && response.data.statuses.length >= 0) {
        setStatuses(response.data.statuses);
      }
    } catch (error) {
      setMsg("Error fetching statuses");
      setIsError(true);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${Endpoints.order}/${orderId}`);
      setMsg("Order successfully deleted");
      setIsError(false);
      getData(); // Refresh data after deletion
    } catch (error) {
      setMsg("Failed to delete order");
      setIsError(true);
    }
  };

  const getStatusName = (statusId) => {
    const status = statuses.find((status) => status.id === statusId);
    return status ? status.name : "Unknown";
  };

  // Filter orderData based on filterOrderCode and filterStatus
  const filteredOrderData = orderData.filter((order) => {
    const orderCodeMatch = order.order_code.toLowerCase().includes(filterOrderCode.toLowerCase());
    const statusMatch = !filterStatus || order.status_id === parseInt(filterStatus);
    return orderCodeMatch && statusMatch;
  });

  return (
    <Layout>
      <div className="z-999">
        <Notification message={msg} isError={isError} />
      </div>
      <div className="mt-5 container mx-auto">
        <h1 className="text-3xl font-semibold mb-3 text-center">Data Order</h1>

        <div className="mt-4 mb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <input
              className="border border-gray-300 p-2 mr-2"
              type="text"
              placeholder="Filter by Order Code"
              value={filterOrderCode}
              onChange={(e) => setFilterOrderCode(e.target.value)}
            />
            <select
              className="border border-gray-300 p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Filter by Status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <a
              className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg"
              href="/order/add"
            >
              Tambah Order
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
                  Order Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrderData.length > 0 ? (
                filteredOrderData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.order_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.table_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusName(item.status_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.order_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/order/edit/${item.id}`}
                          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this order?"
                              )
                            ) {
                              deleteOrder(item.id);
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

export default DataOrderPage;
