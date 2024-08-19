import React, { Component } from 'react';
import { Endpoints } from '../../api';
import axios from 'axios';
import swal from 'sweetalert';
import { Hasil, Menus, ListCategories, NavComponents } from '../../components/customer';
import Cookies from 'js-cookie';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menus: [],
            dipilih: '',
            keranjangs: []
        };
    }

    componentDidMount() {
        this.fetchMenus();
        this.getListKeranjang();
    }

    fetchMenus = () => {
        axios
            .get(Endpoints.menu + '?id=' + this.state.dipilih)
            .then(res => {
                const menus = res.data.menus;
                console.log(menus);
                this.setState({ menus });
            })
            .catch(error => {
                console.log(error);
            });
    };

    getListKeranjang = () => {
        const orderCode = Cookies.get('order_code');
        axios
            .get(Endpoints.order+"/"+orderCode)
            .then(res => {
                const keranjangs = res.data.orders;
                console.log(keranjangs);
                this.setState({ keranjangs });
            })
            .catch(error => {
                console.log(error);
            });
    };

    changeCategory = value => {
        this.setState(
            {
                dipilih: value,
                menu: []
            },
            () => {
                this.fetchMenus();
            }
        );
    };

    masukKeranjang = value => {
        const table_number = Cookies.get('table_number');
        const order_code = Cookies.get('order_code');
        if (!table_number || !order_code) {
            swal({
                title: 'Error',
                text: 'Table number or order code not found',
                icon: 'error',
                button: false,
                timer: 1000
            });
            window.location.href = '/';
        }
        const keranjang = {
            table_number: table_number,
            order_code: order_code,
            menu_id: value,
            amount: 1, // Assuming a default amount of 1, adjust as needed
        };
        axios
            .post(Endpoints.order, keranjang)
            .then(res => {
                this.getListKeranjang();
                swal({
                    title: 'Success',
                    text: 'Berhasil Masuk Keranjang',
                    icon: 'success',
                    button: false,
                    timer: 1000
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    checkActiveOrder = () => {
        // Retrieve data from cookies
        const tableNumber = Cookies.get('table_number'); // Replace with actual cookie name if different
        const orderCode = Cookies.get('order_code'); // Replace with actual cookie name if different

        if (!tableNumber || !orderCode) {
            // Handle missing cookie data, if necessary
            return;
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
                    this.props.history.push('/');
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { menus, dipilih, keranjangs } = this.state;
        return (
            <div className="bg-gray-100 min-h-screen">
                {/* Navigation Component */}
                <NavComponents />
                <div className="container mx-auto py-8">
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                        {/* ListCategories Component */}
                        <div className="col-span-1">
                            <ListCategories changeCategory={this.changeCategory} dipilih={dipilih} />
                        </div>

                        {/* Menus List */}
                        <div className="col-span-5">
                            <h2 className="text-2xl font-bold mb-4">Daftar Produk</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {menus.map(menu => (
                                    <Menus key={menu.id} menu={menu} masukKeranjang={this.masukKeranjang} />
                                ))}
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <Hasil keranjangs={keranjangs} {...this.props} getListKeranjang={this.getListKeranjang} />
                        </div>
                    </div>

                    {/* Hasil Component */}
                </div>
            </div>
        );
    }
}
