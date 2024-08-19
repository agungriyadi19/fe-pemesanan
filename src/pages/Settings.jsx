import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Layout from './Layout';
import 'leaflet/dist/leaflet.css';
import Swal from 'sweetalert2';
import { Endpoints } from "../api";
import { readCookie } from '../utils'; // Import the readCookie function

const Settings = () => {
  const [totalTable, setTotalTable] = useState('');
  const [latitude, setLatitude] = useState(-6.1754);
  const [longitude, setLongitude] = useState(106.8272);
  const [radius, setRadius] = useState(1000);

  useEffect(() => {
    // Fetch settings from the server
    const token = readCookie('token'); // Retrieve the token from cookies
    axios.get(Endpoints.setting, {
      headers: {
        Authorization: `Bearer ${token}` // Include token in headers
      }
    })
      .then(response => {
        const settings = response.data.settings;
        setTotalTable(settings.total_table);
        setLatitude(settings.latitude || -6.1754);
        setLongitude(settings.longitude || 106.8272);
        setRadius(settings.radius || 1000);
      })
      .catch(error => {
        console.error('There was an error fetching the settings!', error);
      });

    // Fetch the user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  const handleSaveSettings = () => {
    const token = readCookie('token'); // Retrieve the token from cookies
    const settings = {
      total_table: parseInt(totalTable, 10),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius),
    };

    axios.put(Endpoints.setting, settings, {
      headers: {
        Authorization: `Bearer ${token}` // Include token in headers
      }
    })
      .then(response => {
        if (response.data.success) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Pengaturan berhasil disimpan!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Gagal menyimpan pengaturan.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      })
      .catch(error => {
        console.error('There was an error saving the settings!', error);
        Swal.fire({
          title: 'Error!',
          text: 'Terjadi kesalahan saat menyimpan pengaturan.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  };

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
    const tableCount = parseInt(totalTable, 10);
    for (let i = 1; i <= tableCount; i++) {
      const card = document.getElementById(`card-content-${i}`);
      const canvas = await html2canvas(card, { backgroundColor: '#fff' });
      const pngUrl = canvas.toDataURL('image/png');
      zip.file(`qrcode-${i}.png`, pngUrl.split(',')[1], { base64: true });
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'qrcodes.zip');
  };

  const renderQRCodes = () => {
    const tableCount = parseInt(totalTable, 10);
    if (isNaN(tableCount) || tableCount <= 0) return null;

    const qrCodes = [];
    for (let i = 1; i <= tableCount; i++) {
      qrCodes.push(
        <div key={i} id={`card-${i}`} className="border p-4 rounded-lg shadow-lg m-4 text-center flex flex-col items-center bg-white">
          <div id={`card-content-${i}`} className="w-full bg-white flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Warmindo</h2>
            <h3 className="text-xl mb-2">4 Sekawan</h3>
            <h4 className="text-lg mb-2">Meja {i}</h4>
            <QRCode
              value={`https://warmindo.netlify.app/scan/${i}`}
              size={128}
              level="H"
              includeMargin={true}
            />
            <p className="mt-2 mb-5">https://warmindo.netlify.app/scan/{i}</p>
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

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });

    return (
      <Marker position={[latitude, longitude]} icon={new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconAnchor: [13, 40],      
      })}>
        <Circle center={[latitude, longitude]} radius={radius} />
      </Marker>
    );
  };

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Terjadi kesalahan saat mendapatkan lokasi Anda.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Geolocation tidak didukung oleh browser ini.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Layout>
      <div className="mt-5 container mx-auto">
        <h1 className="text-3xl font-semibold mb-3 text-center">Pengaturan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-96 mb-4" id="map">
            <MapContainer center={[latitude, longitude]} zoom={10} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalTable">
                Jumlah Meja
              </label>
              <input
                id="totalTable"
                className="border border-gray-300 p-2 w-full"
                type="number"
                placeholder="Jumlah Meja"
                value={totalTable}
                onChange={(e) => setTotalTable(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="radius">
                Radius (meter)
              </label>
              <input
                id="radius"
                className="border border-gray-300 p-2 w-full"
                type="number"
                placeholder="Radius dalam meter"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleGetUserLocation}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2"
              >
                Lokasi Terkini
              </button>
              <button
                onClick={handleSaveSettings}
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>

        <hr />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">QR Codes untuk Meja</h2>
          <div className="mt-4 text-center">
            <button
              onClick={handleDownloadAll}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Download Semua QR Codes
            </button>
          </div>
          <div className="flex flex-wrap justify-center">
            {renderQRCodes()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
