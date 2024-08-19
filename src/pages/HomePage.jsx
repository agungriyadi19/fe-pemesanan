import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="w-full py-6 bg-red-600 text-white text-center">
        <h1 className="text-4xl font-bold">Warmindo</h1>
      </header>
      <main className="flex flex-col items-center text-center p-4">
        <section className="flex flex-col items-center py-8">
          <h2 className="text-5xl font-bold mb-6 text-green-700">
            Selamat Datang di Warmindo
          </h2>
          <p className="text-lg mb-8 text-gray-800 max-w-lg">
            Temukan menu terbaik dari makanan, minuman, dan camilan di Warmindo. Kepuasan Anda adalah prioritas kami.
          </p>
        </section>

        <section className="w-full py-8">
          <h3 className="text-3xl font-bold text-red-600 mb-4">
            Spesial Kami
          </h3>
          <div className="flex flex-wrap justify-center">
            <div className="m-4 p-4 w-60 bg-yellow-50 shadow-md rounded-lg">
              <h4 className="text-xl font-semibold text-green-700">Mie Goreng</h4>
              <p className="text-gray-800">Mie goreng lezat dengan campuran bumbu yang unik.</p>
            </div>
            <div className="m-4 p-4 w-60 bg-yellow-50 shadow-md rounded-lg">
              <h4 className="text-xl font-semibold text-green-700">Nasi Goreng</h4>
              <p className="text-gray-800">Nasi goreng penuh rasa dengan campuran sayuran dan protein.</p>
            </div>
            <div className="m-4 p-4 w-60 bg-yellow-50 shadow-md rounded-lg">
              <h4 className="text-xl font-semibold text-green-700">Es Teh</h4>
              <p className="text-gray-800">Es teh segar, sempurna untuk setiap hidangan.</p>
            </div>
          </div>
        </section>

        <section className="w-full bg-gray-50 py-8">
          <h3 className="text-3xl font-bold text-red-600 mb-4">
            Testimoni Pelanggan
          </h3>
          <div className="flex flex-wrap justify-center">
            <div className="m-4 p-4 w-60 bg-white shadow-md rounded-lg">
              <p className="text-gray-800 italic">
                "Tempat terbaik untuk menikmati cita rasa tradisional Indonesia!"
              </p>
              <p className="text-gray-800 font-semibold mt-2">- John Doe</p>
            </div>
            <div className="m-4 p-4 w-60 bg-white shadow-md rounded-lg">
              <p className="text-gray-800 italic">
                "Warmindo tidak pernah mengecewakan dengan hidangan lezat dan terjangkau."
              </p>
              <p className="text-gray-800 font-semibold mt-2">- Jane Smith</p>
            </div>
            <div className="m-4 p-4 w-60 bg-white shadow-md rounded-lg">
              <p className="text-gray-800 italic">
                "Wajib dikunjungi bagi pecinta masakan Indonesia."
              </p>
              <p className="text-gray-800 font-semibold mt-2">- Sarah Lee</p>
            </div>
          </div>
        </section>

        <section className="w-full py-8">
          <h3 className="text-3xl font-bold text-red-600 mb-4">Hubungi Kami</h3>
          <form className="w-full max-w-lg mx-auto">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nama
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Nama Anda"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email Anda"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Pesan
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="message"
                placeholder="Pesan Anda"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Kirim Pesan
              </button>
            </div>
          </form>
        </section>
      </main>
      <footer className="w-full py-4 bg-red-600 text-white text-center">
        <p className="text-sm">© 2024 Warmindo. Semua hak cipta dilindungi.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
