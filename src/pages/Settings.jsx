// src/components/admin/Settings.jsx
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Layout from './Layout';

const Settings = () => {
  const [name, setName] = useState('');
  const [seats, setSeats] = useState('');

  const handleDownload = async (index) => {
    const card = document.getElementById(`card-content-${index}`);
    const canvas = await html2canvas(card, { backgroundColor: '#fff' });
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${index}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const seatCount = parseInt(seats, 10);
    for (let i = 1; i <= seatCount; i++) {
      const card = document.getElementById(`card-content-${i}`);
      const canvas = await html2canvas(card, { backgroundColor: '#fff' });
      const pngUrl = canvas.toDataURL('image/png');
      zip.file(`qrcode-${i}.png`, pngUrl.split(',')[1], { base64: true });
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'qrcodes.zip');
  };

  const renderQRCodes = () => {
    const seatCount = parseInt(seats, 10);
    if (isNaN(seatCount) || seatCount <= 0) return null;

    const qrCodes = [];
    for (let i = 1; i <= seatCount; i++) {
      qrCodes.push(
        <div key={i} id={`card-${i}`} className="border p-4 rounded-lg shadow-lg mb-4 text-center flex flex-col items-center bg-white">
          <div id={`card-content-${i}`} className="w-full bg-white flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Warmindo</h2>
            <h3 className="text-xl mb-2">{name}</h3>
            <h4 className="text-lg mb-2">Meja {i}</h4>
            <QRCode
              value={`http://localhost/order/${i}`}
              size={128}
              level="H"
              includeMargin={true}
            />
            <p className="mt-2 mb-5">http://localhost/order/{i}</p>
          </div>
          <button
            onClick={() => handleDownload(i)}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Download QR Code
          </button>
        </div>
      );
    }
    return qrCodes;
  };

  return (
    <Layout>
      <div className="mt-5 container mx-auto">
        <h1 className="text-3xl font-semibold mb-3 text-center">Settings</h1>

        <div className="mt-4 mb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <input
              className="border border-gray-300 p-2 mr-2"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border border-gray-300 p-2"
              type="number"
              placeholder="Jumlah Kursi"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={handleDownloadAll}
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Download All QR Codes
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl mb-5">QR Codes:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderQRCodes()}
          </div>
        </div>
      </div>
      </Layout>
    );
};

export default Settings;
