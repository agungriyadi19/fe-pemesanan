import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import Notification from "../../components/Notification";
import { Endpoints } from "../../api";
import DetailOrder from "../../components/order/DetailOrder";
import { readCookie } from '../../utils'; // Import the readCookie function

const DataOrderPage = () => {
  const [orderData, setOrderData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [msg, setMsg] = useState(""); // Message for success or error
  const [isError, setIsError] = useState(false);
  const [filterOrderCode, setFilterOrderCode] = useState(""); // State for filtering by order code
  const [filterStatus, setFilterStatus] = useState(""); // State for filtering by status
  const [startDate, setStartDate] = useState(""); // State for start date filter
  const [endDate, setEndDate] = useState(""); // State for end date filter
  const [detailOrderId, setDetailOrderId] = useState(null); // State to manage detail visibility
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    getData();
    getStatuses();
  }, []);

  const getData = async () => {
    const token = readCookie('token'); // Retrieve the token from cookies
    try {
      const response = await axios.get(Endpoints.order, {
        headers: {
          Authorization: `Bearer ${token}` // Include token in headers
        }
      });
      if (response.data.orders && response.data.orders.length >= 0) {
        setOrderData(response.data.orders);
      }
    } catch (error) {
      setMsg("Error fetching data");
      setIsError(true);
    }
  };

  function getStatusColor(statusId) {
    switch (statusId) {
      case 5: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800'; // Menunggu Konfirmasi
      case 4: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800'; // Proses
      case 3: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800'; // Selesai
      case 2: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800'; // Batal
      case 6: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800'; // Dihidangkan
      default: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800';
    }
  }


  const getStatuses = async () => {
    try {
      const response = await axios.get(Endpoints.status);
      if (response.data.statuses && response.data.statuses.length >= 0) {
        const filteredStatuses = response.data.statuses.filter(status => status.name !== 'Prapesan');
        setStatuses(filteredStatuses);
      }
    } catch (error) {
      setMsg("Gagal mengambil status");
      setIsError(true);
    }
  };

  const getStatusName = (statusId) => {
    const status = statuses.find((status) => status.id === statusId);
    return status ? status.name : "Tidak Diketahui";
  };

  const handleDateFilter = () => {
    // Convert dates to suitable format for backend API
    const startDateFormatted = startDate ? new Date(startDate).toISOString() : "";
    const endDateFormatted = endDate ? new Date(endDate).toISOString() : "";

    // Filter orderData based on date range
    const filteredByDate = orderData.filter((order) => {
      const orderDate = new Date(order.order_date);
      return (
        (!startDateFormatted || orderDate >= new Date(startDateFormatted)) &&
        (!endDateFormatted || orderDate <= new Date(endDateFormatted))
      );
    });

    // Update filteredOrderData state with filtered results
    setOrderData(filteredByDate);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Filter orderData based on filterOrderCode and filterStatus
  const filteredOrderData = orderData.filter((order) => {
    const statusName = getStatusName(order.status_id);
    const orderCodeMatch = order.order_code.toLowerCase().includes(filterOrderCode.toLowerCase());
    const statusMatch = !filterStatus || (order.status_id === parseInt(filterStatus) && getStatusName(order.status_name) !== 'Prapesan');
    return orderCodeMatch && statusMatch && statusName !== "Tidak Diketahui";
  });

  const toggleDetail = (orderId) => {
    console.log(orderId);

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
    if (getStatusName(order.status_id) === 'Prapesan') {
      return acc;
    }
    if (!acc[key]) {
      acc[key] = {
        ...order,
        menus: []
      };
    }
    acc[key].menus.push({
      status_name: order.status_name,
      name: order.menu.name,
      price: order.menu.price,
      amount: order.amount
    });
    return acc;
  }, {});

  const groupedOrders = Object.values(groupedOrderData);

  // Calculate total for each order
  const ordersWithTotal = groupedOrders.map(order => {
    const total = order.menus.reduce((sum, menu) => sum + (menu.price * menu.amount), 0);
    return { ...order, total };
  });

  return (
    <Layout>
      <div className="z-999">
        <Notification message={msg} isError={isError} />
      </div>
      <div className="mt-5 container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-3 text-center">Data Order</h1>

        <div className="mt-4 mb-4 grid gap-4 md:grid-cols-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Filter Kode Order</label>
              <input
                className="border border-gray-300 p-2 w-full"
                type="text"
                placeholder="Kode Order"
                value={filterOrderCode}
                onChange={(e) => setFilterOrderCode(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Filter Status</label>
              <select
                className="border border-gray-300 p-2 w-full"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Pilih Status</option>
                {statuses.map((status) => (
                  status.name !== 'Prapesan' && (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  )
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
              <input
                className="border border-gray-300 p-2 w-full"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Akhir</label>
              <input
                className="border border-gray-300 p-2 w-full"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              onClick={handleDateFilter}
              className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg w-full"
            >
              Filter Tanggal
            </button>
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
                        Kode Order
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Order
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ordersWithTotal.length > 0 ? (
                      ordersWithTotal.map((order, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_code}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.order_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`${getStatusColor(order.status_id)}`}>
                                {getStatusName(order.status_id)}</span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => toggleDetail(order.id)}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded-lg"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          Data tidak ditemukan.
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
        order={ordersWithTotal.find((order) => order.id === detailOrderId)}
      />
    </Layout>
  );
};

export default DataOrderPage;
