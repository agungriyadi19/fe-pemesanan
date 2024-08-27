import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Endpoints } from "../../api";
import Cookies from 'js-cookie';
import { NavComponents } from '../../components/customer';
import { numberWithCommas } from '../../utils';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons for status

const Riwayat = () => {
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
    }, [getListKeranjang]);

    const calculateTotal = (keranjangs) => {
        const total = keranjangs.reduce((acc, order) =>
            acc + (order.menu.price * order.amount), 0
        );
        setTotal(total);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <NavComponents />
            <div className="container mx-auto p-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h3>
                
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
                                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
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
                                        {order.status_name === 'menunggu konfirmasi' ? (
                                            <span className="text-yellow-500 flex items-center">
                                                <FaCheckCircle className="mr-2" /> {order.status_name}
                                            </span>
                                        ) : (
                                            <span className="text-red-500 flex items-center">
                                                <FaTimesCircle className="mr-2" /> {order.status_name}
                                            </span>
                                        )}
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
                                <span className="font-semibold text-gray-800">Price:</span> {numberWithCommas(order.menu.price)}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-800">Amount:</span> {order.amount}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-800">Total:</span> {numberWithCommas(order.amount * order.menu.price)}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-800">Status:</span> 
                                {order.status_name === 'menunggu konfirmasi' ? (
                                    <span className="text-yellow-500 flex items-center">
                                        <FaCheckCircle className="mr-2" /> {order.status_name}
                                    </span>
                                ) : (
                                    <span className="text-red-500 flex items-center">
                                        <FaTimesCircle className="mr-2" /> {order.status_name}
                                    </span>
                                )}
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
