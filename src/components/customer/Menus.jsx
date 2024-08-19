import React from 'react'
import { numberWithCommas } from '../../utils'

const Menus = ({ menu, masukKeranjang }) => {
    return (
        <div className="">
            <div className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer" onClick={() => masukKeranjang(menu.id)}>
                <img src={`data:image/png;base64,${menu.image}`} alt={menu.name} className="w-full h-56 object-cover" />
                <div className="p-4">
                    <h5 className="text-lg font-bold">{menu.name}</h5>
                    <p className="text-gray-700">{menu.description}</p>
                    <p className="text-gray-700">Rp. {numberWithCommas(menu.price)}</p>
                </div>
            </div>
        </div>
    )
}

export default Menus
