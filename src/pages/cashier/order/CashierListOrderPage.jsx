/* eslint-disable */
import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import Notification from "../../../components/Notification";
import { Endpoints } from "../../../api";
import DetailOrder from "../../../components/order/DetailOrder";
import Swal from 'sweetalert2';

const DataOrderPage = () => {
  const [orderData, setOrderData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [filterOrderCode, setFilterOrderCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [detailOrderId, setDetailOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getData();
    getStatuses();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(Endpoints.order);
      setOrderData(response.data.orders || []);
    } catch (error) {
      setMsg("Gagal mengambil data");
      setIsError(true);
    }
  };

  const getStatuses = async () => {
    try {
      const response = await axios.get(Endpoints.status);
      setStatuses(response.data.statuses.filter(status => status.name !== 'Prapesan') || []);
    } catch (error) {
      setMsg("Gagal mengambil status");
      setIsError(true);
    }
  };

  const confirmAction = (action, message, onConfirm) => {
    Swal.fire({
      title: 'Konfirmasi',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, lakukan',
      cancelButtonText: 'Tidak, batalkan',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  const updateOrderStatus = (orderCode, statusId) => {
    confirmAction(
      'update',
      'Apakah Anda yakin ingin mengubah status pesanan?',
      async () => {
        try {
          await axios.patch(`${Endpoints.order}/status`, {
            id: 0,
            order_code: orderCode,
            status_id: statusId
          });
          Swal.fire({
            title: "Update Pesanan!",
            text: "Status Pesanan Berhasil Diubah",
            icon: "success",
            button: false,
            timer: 1500
          });
          getData(); // Refresh data after update
        } catch (error) {
          console.log("Error yaa ", error);
          Swal.fire({
            title: "Update Pesanan!",
            text: "Gagal Mengubah Status Pesanan",
            icon: "error",
            button: false,
            timer: 1500
          });
        }
      }
    );
  };

  const deleteOrder = (orderCode) => {
    confirmAction(
      'delete',
      'Apakah Anda yakin ingin membatalkan pesanan?',
      async () => {
        try {
          await axios.patch(`${Endpoints.order}/status`, {
            id: 0,
            order_code: orderCode,
            status_id: 2 // Batal
          });
          Swal.fire({
            title: "Update Pesanan!",
            text: "Sukses Membatalkan Pesanan",
            icon: "success",
            button: false,
            timer: 1500
          });
          getData(); // Refresh data after deletion
        } catch (error) {
          console.log("Error yaa ", error);
          Swal.fire({
            title: "Update Pesanan!",
            text: "Gagal Membatalkan Pesanan",
            icon: "error",
            button: false,
            timer: 1500
          });
        }
      }
    );
  };

  const getStatusName = (statusId) => {
    const status = statuses.find((status) => status.id === statusId);
    return status ? status.name : "Tidak Diketahui";
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

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const filteredOrderData = orderData.filter((order) => {
    const orderCodeMatch = order.order_code.toLowerCase().includes(filterOrderCode.toLowerCase());
    const statusMatch = !filterStatus || (order.status_id === parseInt(filterStatus));
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

  // Separate orders based on their status
  const ordersInProgress = groupedOrders.filter(order => order.status_id === 5 || order.status_id === 4 || order.status_id === 6);
  const completedAndCanceledOrders = groupedOrders.filter(order => order.status_id === 3 || order.status_id === 2);

  return (
    <Layout>
      <div className="z-999">
        <Notification message={msg} isError={isError} />
      </div>
      <div className="mt-5 container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-3 text-center">Data Pesanan</h1>

        <div className="mt-4 mb-4 flex flex-col md:flex-row justify-between items-center">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Filter berdasarkan Kode Pesanan</label>
            <input
              className="border border-gray-300 p-2 mr-2"
              type="text"
              placeholder="Kode Pesanan"
              value={filterOrderCode}
              onChange={(e) => setFilterOrderCode(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Filter berdasarkan Status</label>
            <select
              className="border border-gray-300 p-2"
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

        <div className="flex flex-col mt-4">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nomor Meja
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kode Pesanan
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ordersInProgress.map((order) => (
                      <tr key={order.order_code}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.table_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={getStatusColor(order.status_id)}>{getStatusName(order.status_id)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {order.status_id === 5 && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.order_code, 4)} // Set to Proses
                                className="text-green-600 hover:text-green-900"
                              >
                                Proses
                              </button>
                              <button
                                onClick={() => deleteOrder(order.order_code)}
                                className="ml-4 text-red-600 hover:text-red-900"
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => toggleDetail(order.id)}
                                className="ml-4 text-blue-600 hover:text-blue-900"
                              >
                                Detail
                              </button>
                            </>
                          )}
                          {order.status_id === 4 && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.order_code, 6)} // Set to Dihidangkan
                                className="text-purple-600 hover:text-purple-900"
                              >
                                Dihidangkan
                              </button>
                              <button
                                onClick={() => toggleDetail(order.id)}
                                className="ml-4 text-blue-600 hover:text-blue-900"
                              >
                                Detail
                              </button>
                            </>
                          )}
                          {order.status_id === 6 && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.order_code, 3)} // Set to Selesai
                                className="text-green-600 hover:text-green-900"
                              >
                                Selesai
                              </button>
                              <button
                                onClick={() => toggleDetail(order.id)}
                                className="ml-4 text-blue-600 hover:text-blue-900"
                              >
                                Detail
                              </button>
                            </>
                          )}
                          {order.status_id === 3 || order.status_id === 2 && (
                            <button
                              onClick={() => toggleDetail(order.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Detail
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {completedAndCanceledOrders.map((order) => (
                      <tr key={order.order_code}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.table_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={getStatusColor(order.status_id)}>{getStatusName(order.status_id)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleDetail(order.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && detailOrderId && (
          <DetailOrder
            orderId={detailOrderId}
            closeModal={closeModal}
          />
        )}
      </div>
    </Layout>
  );
};

export default DataOrderPage;
