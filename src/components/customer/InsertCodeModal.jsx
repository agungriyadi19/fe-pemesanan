import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { Endpoints } from "../../api";

// Ensure Modal styles are applied correctly
Modal.setAppElement('#root'); // Adjust this if your root element is different

const InsertCodeModal = ({ isOpen, onRequestClose }) => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const table = Cookies.get('table_number');

    const handleInsertCode = async () => {
        try {
            console.log(code);
            console.log(table);
            
            // Ensure code and table are valid
            if (!code || !table) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Kode order atau nomor meja tidak valid.',
                });
                return;
            }

            await axios.post(Endpoints.checkCode, {
                order_code: code,
                table_number: Number(table),
            });

            Swal.fire({
                icon: 'success',
                title: 'Sukses',
                text: 'Order Kode berhasil disimpan',
            });
            Cookies.set('order_code', code);
            navigate('/customer');
            onRequestClose(); // Close the modal after successful submission
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Terjadi kesalahan',
                confirmButtonColor: '#d33',
        });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    padding: '30px',
                    width: '90%',
                    maxWidth: '400px',
                    borderRadius: '10px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                    transition: 'opacity 0.3s ease-in-out',
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    transition: 'opacity 0.3s ease-in-out',
                },
            }}
        >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center', color: '#333' }}>Masukkan Kode Order</h2>
            <input
                type="text"
                placeholder="Kode Order"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
            />
            <button
                onClick={handleInsertCode}
                style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
                Simpan
            </button>
        </Modal>
    );
};

export default InsertCodeModal;
