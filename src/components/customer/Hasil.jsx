import React, { Component } from 'react'
import { numberWithCommas } from '../../utils'
import ModalKeranjang from './ModalKeranjang'
import TotalBayar from './TotalBayar'
import axios from 'axios'
import { Endpoints } from "../../api";
import swal from 'sweetalert'
import Cookies from 'js-cookie';

export default class Hasil extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      keranjangDetail: null,
      amount: 0,
      totalHarga: 0,
    }
  }

  handleShow = (menuKeranjang) => {
    this.setState({
      showModal: true,
      keranjangDetail: menuKeranjang,
      amount: menuKeranjang.amount,
      totalHarga: menuKeranjang.total_price
    })
  }

  handleClose = () => {
    this.setState({
      showModal: false
    })
  }

  tambah = () => {
    this.setState({
      amount: this.state.amount + 1,
      totalHarga:
        this.state.keranjangDetail.menu.price * (this.state.amount + 1),
    });
  };

  kurang = () => {
    if (this.state.amount !== 1) {
      this.setState({
        amount: this.state.amount - 1,
        totalHarga:
          this.state.keranjangDetail.menu.price * (this.state.amount - 1),
      });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.handleClose();

    const table_number = Cookies.get('table_number');
    const order_code = Cookies.get('order_code');
    
    const data = {
      amount: this.state.amount,
      table_number: table_number,
      order_code: order_code, // Optional if you want to update order_code
      menu_id: this.state.keranjangDetail.menu_id // Optional if you want to update menu_id
  };


    axios
      .put(Endpoints.order +"/"+ this.state.keranjangDetail.id, data)
      .then((res) => {
        this.props.getListKeranjang();
        swal({
          title: "Update Pesanan!",
          text: "Sukses Update Pesanan",
          icon: "success",
          button: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.log("Error yaa ", error);
      });
  };

  hapusPesanan = (id) => {
    this.handleClose();

    axios
      .delete(Endpoints.order +"/" + id)
      .then((res) => {
        this.props.getListKeranjang()
        swal({
          title: "Hapus Pesanan!",
          text:
            "Sukses Hapus Pesanan " + this.state.keranjangDetail.menu.name,
          icon: "error",
          button: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.log("Error yaa ", error);
      });
  };

  render() {
    const { keranjangs } = this.props
    
    return (
      <div className="">
        <h4 className="font-bold">Hasil</h4>
        <hr className="my-2" />
        { keranjangs != null && (
          <div className="overflow-auto h-64 bg-white shadow-md rounded-md">
            <ul className="divide-y divide-gray-200">
              {keranjangs.map((menuKeranjang) => (
                <li
                  key={menuKeranjang.id}
                  onClick={() => this.handleShow(menuKeranjang)}
                  className="p-4 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span className="bg-green-200 text-green-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">{menuKeranjang.amount}</span>
                      <div className="ml-3">
                        <h5 className="text-lg font-medium">{menuKeranjang.menu.name}</h5>
                        <p className="text-sm text-gray-500">Rp. {numberWithCommas(menuKeranjang.menu.price)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="text-lg">Rp. {numberWithCommas(menuKeranjang.total_price)}</strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ModalKeranjang
          handleClose={this.handleClose}
          {...this.state}
          tambah={this.tambah}
          kurang={this.kurang}
          handleSubmit={this.handleSubmit}
          hapusPesanan={this.hapusPesanan}
        />
        <TotalBayar keranjangs={keranjangs} {...this.props} />

      </div>
    )
  }
}
