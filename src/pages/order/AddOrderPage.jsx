import React from "react";
import FormTambahData from "../../components/order/FormTambahData";
import Layout from "../Layout";

const AddMenuPage = ({message, Error}) => {
  return (
    <Layout>
     
      <div className="flex w-full justify-center items-center">
        <h1 className="text-3xl font-semibold mt-5">Tambah Data Order</h1>
      </div>
      <div className="flex mt-10 justify-center">
        <FormTambahData />
      </div>
    </Layout>
  );
};

export default AddMenuPage;
