/* eslint-disable */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Endpoints } from "../../api";
import Cookies from 'js-cookie';
import { NavComponents } from '../../components/customer';
import { numberWithCommas } from '../../utils';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons for status
import { useNavigate } from 'react-router-dom';

const Riwayat = () => {
    const navigate = useNavigate();
    const [keranjangs, setKeranjangs] = useState([]);
    const [total, setTotal] = useState(0);

    // Use useCallback to memoize the function
    const getListKeranjang = useCallback(() => {
        const orderCode = Cookies.get('order_code');
        axios
            .get(`${Endpoints.order}/${orderCode}`)
            .then(res => {
                const keranjangs = res.data.orders || [];

                // Filter orders based on status
                const filteredKeranjangs = keranjangs.filter(order => order.status_id !== 1);

                setKeranjangs(filteredKeranjangs);
                calculateTotal(filteredKeranjangs);
            })
            .catch(error => {
                console.log("API Error:", error);
            });
    }, []);

    useEffect(() => {
        getListKeranjang();
        checkCodeOrder();
    }, [getListKeranjang]);

    const calculateTotal = (keranjangs) => {
        const total = keranjangs.reduce((acc, order) =>
            acc + (order.menu.price * order.amount), 0
        );
        setTotal(total);
    };

    const checkCodeOrder = useCallback(() => {
        // Retrieve data from cookies
        const tableNumber = Number(Cookies.get('table_number')); // Replace with actual cookie name if different
        const orderCode = Cookies.get('order_code'); // Replace with actual cookie name if different

        if (!tableNumber || !orderCode) {
            // Handle missing cookie data, if necessary
            navigate("/")
        }

        axios
            .post(Endpoints.checkActive, { table_number: tableNumber, order_code: orderCode })
            .then(res => {
                const { active } = res.data;
                if (!active) {
                    // Remove cookies
                    Cookies.remove('table_number');
                    Cookies.remove('order_code');

                    // Redirect to homepage if order is not active
                    navigate("/")
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

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
        <div className="bg-gray-50 min-h-screen">
            <NavComponents />
            <div className="container mx-auto p-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Daftar Pesanan</h3>

                {keranjangs.length > 0 && (
                    <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
                        <p className="text-gray-600"><span className="font-semibold">Order Code:</span> {keranjangs[0].order_code}</p>
                        <p className="text-gray-600"><span className="font-semibold">Table Number:</span> {keranjangs[0].table_number}</p>
                    </div>
                )}

                <div className="hidden md:block">
                    <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Menu</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Harga</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Jumlah</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {keranjangs.map((order, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.menu.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{numberWithCommas(order.menu.price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{numberWithCommas(order.amount * order.menu.price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        <span className={`${getStatusColor(order.status_id)}`}>
                                            {order.status_name}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="block md:hidden">
                    {keranjangs.map((order, idx) => (
                        <div key={idx} className="border rounded-lg mb-4 p-4 bg-white shadow-md">
                            <div className="mb-2">
                                <span className="font-semibold text-gray-800">Menu:</span> {order.menu.name}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-800">Harga:</span> {numberWithCommas(order.menu.price)}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-800">Jumlah:</span> {order.amount}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-800">Total:</span> {numberWithCommas(order.amount * order.menu.price)}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-800">Status:</span>
                                <span className={`${getStatusColor(order.status_id)}`}>
                                    {order.status_name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg shadow-md text-right">
                    <span className="text-lg font-bold text-gray-800">Total Price: </span>
                    <span className="text-lg font-semibold text-indigo-600">{numberWithCommas(total)}</span>
                </div>
            </div>
        </div>
    );
}

export default Riwayat;
