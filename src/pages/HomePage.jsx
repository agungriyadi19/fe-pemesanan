import React from "react";
import Layout from "./Layout";

const HomePage = () => {
  return (
    <Layout>
      <div className="flex w-full justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-3xl font-semibold">
            <p>Warmindo</p>
          </div>
          <div className="text-lg mt-2">
            <a
              href="/menu"
              className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              Go to Data Menu Page
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
