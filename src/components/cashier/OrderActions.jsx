import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Endpoints } from '../../api';

const OrderActions = ({ order, getData, toggleDetail }) => {
  const confirmAction = (message, onConfirm) => {
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

  const updateOrderStatus = async (orderCode, statusId) => {
    confirmAction('Apakah Anda yakin ingin mengubah status pesanan?', async () => {
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
        getData();
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
    });
  };

  const cancelOrder = async (orderCode) => {
    confirmAction('Apakah Anda yakin ingin membatalkan pesanan?', async () => {
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
        getData();
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
    });
  };

  return (
    <div className="actions">
      {order.status_id === 5 && (
        <>
          <button
            onClick={() => updateOrderStatus(order.order_code, 4)} // Set to Proses
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Proses
          </button>
          <button
            onClick={() => cancelOrder(order.order_code)}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Batal
          </button>
        </>
      )}
      {order.status_id === 4 && (
        <button
          onClick={() => updateOrderStatus(order.order_code, 6)} // Set to Dihidangkan
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Dihidangkan
        </button>
      )}
      {order.status_id === 6 && (
        <button
          onClick={() => updateOrderStatus(order.order_code, 3)} // Set to Selesai
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Selesai
        </button>
      )}
      <button
        onClick={() => toggleDetail(order.id)}
        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Detail
      </button>
    </div>
  );
};

export default OrderActions;
