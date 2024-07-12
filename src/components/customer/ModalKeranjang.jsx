import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { numberWithCommas } from '../../utils'

const ModalKeranjang = ({
    showModal,
    handleClose,
    keranjangDetail,
    jumlah,
    keterangan,
    tambah,
    kurang,
    changeHandler,
    handleSubmit,
    totalHarga,
    hapusPesanan
}) => {
    console.log(keranjangDetail);
    if (keranjangDetail) {
        return (
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <form onSubmit={handleSubmit}>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            {keranjangDetail.menu.name}{" "}
                                            <strong>(Rp. {numberWithCommas(keranjangDetail.menu.price)})</strong>
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Total Harga:
                                                </label>
                                                <p className="text-gray-700">
                                                    <strong>Rp. {numberWithCommas(totalHarga)}</strong>
                                                </p>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Jumlah:
                                                </label>
                                                <div className="flex items-center">
                                                    <button type="button" className="bg-blue-500 text-white px-2 py-1 rounded-md" onClick={() => kurang()}>
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </button>
                                                    <strong className="mx-4">{jumlah}</strong>
                                                    <button type="button" className="bg-blue-500 text-white px-2 py-1 rounded-md" onClick={() => tambah()}>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Keterangan:
                                                </label>
                                                <textarea
                                                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                                    rows="3"
                                                    name="keterangan"
                                                    placeholder="Contoh : Pedes, Nasi Setengah"
                                                    value={keterangan}
                                                    onChange={(event) => changeHandler(event)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-between">
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                                onClick={() => hapusPesanan(keranjangDetail.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} /> Hapus Pesanan
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                            >
                                                Simpan
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    }
    return null;
};

export default ModalKeranjang;
