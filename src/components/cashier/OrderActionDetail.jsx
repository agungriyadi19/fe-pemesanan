import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Endpoints } from '../../api';

const OrderActionDetail = ({ id, status }) => {
  console.log(id, status);
  
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

  const updateOrderStatus = async (id, statusId) => {
    confirmAction('Apakah Anda yakin ingin mengubah status pesanan?', async () => {
      try {
        await axios.patch(`${Endpoints.order}/status`, {
          id: id,
          order_code: "",
          status_id: statusId
        });
        Swal.fire({
          title: "Update Pesanan!",
          text: "Status Pesanan Berhasil Diubah",
          icon: "success",
          button: false,
          timer: 1500
        });
        window.location.reload();
        
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

  const cancelOrder = async (id) => {
    confirmAction('Apakah Anda yakin ingin membatalkan pesanan?', async () => {
      try {
        await axios.patch(`${Endpoints.order}/status`, {
          id: id,
          order_code: "",
          status_id: 2 // Batal
        });
        Swal.fire({
          title: "Update Pesanan!",
          text: "Sukses Membatalkan Pesanan",
          icon: "success",
          button: false,
          timer: 1500
        });
        window.location.reload();
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
      {status === 5 && (
        <>
          <button
            onClick={() => updateOrderStatus(id, 4)} // Set to Proses
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Proses
          </button>
          <button
            onClick={() => cancelOrder(id)}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Batal
          </button>
        </>
      )}
      {status === 4 && (
        <button
          onClick={() => updateOrderStatus(id, 6)} // Set to Dihidangkan
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Dihidangkan
        </button>
      )}
      {status === 6 && (
        <button
          onClick={() => updateOrderStatus(id, 3)} // Set to Selesai
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Selesai
        </button>
      )}
    </div>
  );
};

export default OrderActionDetail;
