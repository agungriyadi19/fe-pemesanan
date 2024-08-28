import React from 'react';
import { numberWithCommas } from '../../utils'

const DetailOrder = ({ isOpen, onClose, order }) => {

  if (!isOpen || !order) return null;

  const calculateTotal = () => {
    return order.menus.reduce((acc, menu) => acc + menu.price * menu.amount, 0);
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
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-xl md:max-w-2xl m-auto flex-col flex rounded-lg shadow-lg">

        <span
          className="absolute top-0 right-0 p-4 cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            className="h-6 w-6 fill-current text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.7l-2.651 2.652a1.2 1.2 0 1 1-1.697-1.697L8.3 10 5.648 7.348a1.2 1.2 0 1 1 1.697-1.697L10 8.3l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697L11.7 10l2.652 2.651a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
        <div>
          <h3 className="font-semibold text-lg mb-2">Order Details:</h3>
          {/* Table for larger screens */}
          <div className="hidden md:block">
            <table className="w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.menus.map((menu, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{menu.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{numberWithCommas(menu.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{numberWithCommas(menu.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{numberWithCommas(menu.amount * menu.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className={`${getStatusColor(order.status_id)}`}>
                        {menu.status_name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Cards for smaller screens */}
          <div className="block md:hidden">
            {order.menus.map((menu, idx) => (
              <div key={idx} className="border rounded-lg mb-4 p-4 shadow-sm">
                <div className="mb-2">
                  <span className="font-medium">Menu: </span>{menu.name}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Harga: </span>{numberWithCommas(menu.price)}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Jumlah: </span>{numberWithCommas(menu.amount)}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Total: </span>{numberWithCommas(menu.amount * menu.price)}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Status: </span>{menu.status_name}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <span className="font-medium">Total Price: </span>
            {numberWithCommas(calculateTotal())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
