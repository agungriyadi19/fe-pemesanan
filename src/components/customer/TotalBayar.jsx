import React, { Component } from 'react';
import { numberWithCommas } from '../../utils';
import axios from 'axios'
import { Endpoints } from "../../api";
import swal from 'sweetalert'

export default class TotalBayar extends Component {
    submitTotalBayar = (orderID) => {
        // status id 5 = menunggu konfirmasi
        for (let index = 0; index < orderID.length; index++) {
            let element = orderID[index];
            
            let data = {
                id: element,
                order_code: "",
                status_id: 5,
            };
        
            axios
            .patch(Endpoints.order +"/status", data)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log("Error yaa ", error);
                swal({
                    title: "Update Pesanan!",
                    text: "Gagal Membuat Pesanan",
                    icon: "error",
                    button: false,
                    timer: 1500,
                });
            });
        }
        swal({
            title: "Update Pesanan!",
            text: "Sukses Membuat Pesanan",
            icon: "success",
            button: false,
            timer: 1500,
        });
    };

    render() {
        let totalBayar
        let orderID
        
        if (this.props.keranjangs && this.props.keranjangs.length > 0) {
            totalBayar = this.props.keranjangs.reduce((result, item) => {
                return result + item.total_price;
            }, 0);
            orderID = this.props.keranjangs.map(item => item.id)

        } else {
            totalBayar = 0
            orderID = []
            // console.log("Keranjangs is null or empty");
        }

        return (
            <>
                {/* WEB */}
                <div className=' fixed bottom-0  right-20 hidden md:block bg-white p-4 shadow-md'>
                    <div className="container mx-auto flex justify-end">
                        <div className="w-full">
                            <h4 className="text-lg font-semibold">
                                Total Harga:
                                <strong className="float-right ml-2">
                                    Rp. {numberWithCommas(totalBayar)}
                                </strong>
                            </h4>
                            <div className="mt-4 mb-3">
                                <button
                                    className="w-full bg-blue-500 text-white text-lg py-2 rounded-md flex items-center justify-center"
                                    onClick={() => this.submitTotalBayar(orderID)}
                                >
                                    {/* <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> */}
                                    <strong>Pesan</strong>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MOBILE */}
                <div className='block md:hidden bg-white p-4 shadow-md'>
                    <div className="container mx-auto flex justify-end">
                        <div className="w-full">
                            <h4 className="text-lg font-semibold">
                                Total Harga:
                                <strong className="float-right ml-2">
                                    Rp. {numberWithCommas(totalBayar)}
                                </strong>
                            </h4>
                            <div className="mt-4 mb-3">
                                <button
                                    className="w-full bg-blue-500 text-white text-lg py-2 rounded-md flex items-center justify-center"
                                    onClick={() => this.submitTotalBayar(orderID)}
                                >
                                    {/* <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> */}
                                    <strong>Pesan</strong>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
