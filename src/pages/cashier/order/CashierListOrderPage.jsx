import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import Notification from "../../../components/Notification";
import { Endpoints } from "../../../api";
import DetailOrder from "../../../components/order/DetailOrder";

const DataOrderPage = () => {
  const [orderData, setOrderData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [msg, setMsg] = useState(""); // Message for success or error
  const [isError, setIsError] = useState(false);
  const [filterOrderCode, setFilterOrderCode] = useState(""); // State for filtering by order code
  const [filterStatus, setFilterStatus] = useState(""); // State for filtering by status
  const [detailOrderId, setDetailOrderId] = useState(null); // State to manage detail visibility
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

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

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Filter orderData based on filterOrderCode and filterStatus
  const filteredOrderData = orderData.filter((order) => {
    const orderCodeMatch = order.order_code.toLowerCase().includes(filterOrderCode.toLowerCase());
    const statusMatch = !filterStatus || order.status_id === parseInt(filterStatus);
    return orderCodeMatch && statusMatch;
  });

  const toggleDetail = (orderId) => {
    setDetailOrderId(orderId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetailOrderId(null);
  };

  // Group order data by table number and order code
  const groupedOrderData = filteredOrderData.reduce((acc, order) => {
    const key = `${order.table_number}-${order.order_code}`;
    if (!acc[key]) {
      acc[key] = {
        ...order,
        menus: []
      };
    }
    acc[key].menus.push({
      name: order.menu.name,
      price: order.menu.price,
      amount: order.amount
    });
    return acc;
  }, {});

  const groupedOrders = Object.values(groupedOrderData);

  return (
    <Layout>
      <div className="z-999">
        <Notification message={msg} isError={isError} />
      </div>
      <div className="mt-5 container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-3 text-center">Data Order</h1>

        <div className="mt-4 mb-4 flex flex-col md:flex-row justify-between items-center">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Filter by Order Code</label>
            <input
              className="border border-gray-300 p-2 mr-2"
              type="text"
              placeholder="Order Code"
              value={filterOrderCode}
              onChange={(e) => setFilterOrderCode(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Filter by Status</label>
            <select
              className="border border-gray-300 p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Code
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedOrders.length > 0 ? (
                      groupedOrders.map((order, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.table_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_code}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusName(order.status_id)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.order_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <a
                                  href={`/order/edit/${order.id}`}
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
                                      deleteOrder(order.id);
                                    }
                                  }}
                                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => toggleDetail(order.id)}
                                  className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded-lg"
                                >
                                  Detail
                                </button>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          No data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DetailOrder
        isOpen={isModalOpen}
        onClose={closeModal}
        order={groupedOrders.find((order) => order.id === detailOrderId)}
      />
    </Layout>
  );
};

export default DataOrderPage;
