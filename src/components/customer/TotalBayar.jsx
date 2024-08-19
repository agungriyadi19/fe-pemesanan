import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { numberWithCommas } from '../../utils';

export default class TotalBayar extends Component {
    submitTotalBayar = (totalBayar) => {
        this.props.history.push('/sukses');
    };

    render() {
        let totalBayar
        if (this.props.keranjangs && this.props.keranjangs.length > 0) {
            totalBayar = this.props.keranjangs.reduce((result, item) => {
                return result + item.total_price;
            }, 0);
            console.log("Total Bayar:", totalBayar);
        } else {
            totalBayar = 0
            console.log("Keranjangs is null or empty");
        }

        return (
            <>
                {/* WEB */}
                <div className='fixed bottom-0 left-0 right-0 hidden md:block bg-white p-4 shadow-md'>
                    <div className="container mx-auto flex justify-end">
                        <div className="w-full md:w-1/4">
                            <h4 className="text-lg font-semibold">
                                Total Harga:
                                <strong className="float-right ml-2">
                                    Rp. {numberWithCommas(totalBayar)}
                                </strong>
                            </h4>
                            <div className="mt-4 mb-3">
                                <button
                                    className="w-full bg-blue-500 text-white text-lg py-2 rounded-md flex items-center justify-center"
                                    onClick={() => this.submitTotalBayar(totalBayar)}
                                >
                                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                                    <strong>Bayar</strong>
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
                                    onClick={() => this.submitTotalBayar(totalBayar)}
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
