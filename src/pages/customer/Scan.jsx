import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import InsertCodeModal from '../../components/customer/InsertCodeModal';
import { Endpoints } from "../../api"; 

const Scan = () => {
    const { table_number } = useParams(); 
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Check cookies on component mount
    useEffect(() => {
        const existingOrderCode = Cookies.get('order_code');
        const existingTableNumber = Cookies.get('table_number');

        if (existingOrderCode && existingTableNumber) {
            navigate('/customer');
        }
    }, [navigate]);
    
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.',
                    });
                    navigate('/');
                }
            );
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Geolocation tidak didukung oleh browser Anda.',
            });
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const handleCheckRadius = async () => {
            try {
                const response = await axios.post(Endpoints.scan, {
                    latitude: latitude,
                    longitude: longitude,
                    table_number: Number(table_number)
                });
                
                // Check if the response indicates an active order
                if (response.data.status === "Meja sudah memiliki kode pesanan aktif") {
                    setErrorMessage(response.data.error);
                    setIsModalOpen(true);
                } else {
                    Cookies.set('order_code', response.data.order_code);
                    Cookies.set('table_number', table_number);
                    navigate('/customer');
                    // Handle successful response if needed
                }
            } catch (error) {
                console.log(error.response);
                
                if (error.response.data.error === "Meja sudah memiliki kode pesanan aktif") {
                    setErrorMessage(error.response.data.error);
                    setIsModalOpen(true);
                } else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response?.data?.error || 'Terjadi kesalahan',
                        confirmButtonColor: '#d33',
                    });
                    navigate('/');
                }
            }
        };

        if (latitude !== null && longitude !== null) {
            handleCheckRadius();
        }
    }, [latitude, longitude, navigate, table_number]);

    return (
        <div>
            <h2>Memeriksa Lokasi...</h2>
            <InsertCodeModal 
                isOpen={isModalOpen} 
                onRequestClose={() => setIsModalOpen(false)} 
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default Scan;
