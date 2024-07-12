import React, { Component } from 'react';
import { Endpoints } from '../../api';
import axios from 'axios';
import swal from 'sweetalert';
import { Hasil, Menus, ListCategories, NavComponents } from '../../components/customer';

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
        axios
            .get(Endpoints.order)
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
        const keranjang = {
            id: value
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

    render() {
        const { menus, dipilih, keranjangs } = this.state;
        return (
            <div className="bg-gray-100 min-h-screen">
                {/* Navigation Component */}
                <NavComponents />
                <div className="container mx-auto py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* ListCategories Component */}
                        <div className="col-span-1">
                            <ListCategories changeCategory={this.changeCategory} dipilih={dipilih} />
                        </div>

                        {/* Menus List */}
                        <div className="col-span-2">
                            <h2 className="text-2xl font-bold mb-4">Daftar Produk</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {menus.map(menu => (
                                    <Menus key={menu.id} menu={menu} masukKeranjang={this.masukKeranjang} />
                                ))}
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <Hasil keranjangs={keranjangs} {...this.props} getListKeranjang={this.getListKeranjang} />
                        </div>
                    </div>

                    {/* Hasil Component */}
                </div>
            </div>
        );
    }
}
