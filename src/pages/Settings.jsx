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

const Settings = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [seats, setSeats] = useState('');
  const [latitude, setLatitude] = useState(-6.1754); // Default to Jakarta, Indonesia
  const [longitude, setLongitude] = useState(106.8272); // Default to Jakarta, Indonesia
  const [radius, setRadius] = useState(1000);

  useEffect(() => {
    // Fetch settings from the server
    axios.get(Endpoints.setting)
      .then(response => {
        const settings = response.data.settings;
        setTitle(settings.title);
        setSubtitle(settings.subtitle);
        setSeats(settings.seats);
        setLatitude(settings.latitude || -6.1754); // Default if settings do not provide value
        setLongitude(settings.longitude || 106.8272); // Default if settings do not provide value
        setRadius(settings.radius || 1000); // Default if settings do not provide value
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
    const settings = {
      title,
      subtitle,
      seats: parseInt(seats, 10),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius),
    };

    axios.post(Endpoints.setting, settings)
      .then(response => {
        if (response.data.success) {
          Swal.fire({
            title: 'Success!',
            text: 'Settings saved successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Error saving settings.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      })
      .catch(error => {
        console.error('There was an error saving the settings!', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error saving the settings.',
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
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <h3 className="text-xl mb-2">{subtitle}</h3>
            <h4 className="text-lg mb-2">Table {i}</h4>
            <QRCode
              value={`https://warmindo.netlify.app/order/${i}`}
              size={128}
              level="H"
              includeMargin={true}
            />
            <p className="mt-2 mb-5">https://warmindo.netlify.app/order/{i}</p>
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
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
        shadowSize: [50, 64],
        shadowAnchor: [4, 62],
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
            text: 'There was an error getting your location.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Geolocation is not supported by this browser.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Layout>
      <div className="mt-5 container mx-auto">
        <h1 className="text-3xl font-semibold mb-3 text-center">Settings</h1>

        <div className="mt-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  className="border border-gray-300 p-2 w-full"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subtitle">
                  Subtitle
                </label>
                <input
                  id="subtitle"
                  className="border border-gray-300 p-2 w-full"
                  type="text"
                  placeholder="Subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seats">
                  Number of Seats
                </label>
                <input
                  id="seats"
                  className="border border-gray-300 p-2 w-full"
                  type="number"
                  placeholder="Number of Seats"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                />
              </div>
              <button
                onClick={handleGetUserLocation}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Get My Location
              </button>
            </div>

            <div>
              <div className="h-96 mb-4" id="map">
                <MapContainer center={[latitude, longitude]} zoom={15} style={{ width: '100%', height: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="radius">
                  Radius (meters)
                </label>
                <input
                  id="radius"
                  className="border border-gray-300 p-2 w-full"
                  type="number"
                  placeholder="Radius in meters"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleSaveSettings}
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Save Settings
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">QR Codes for Seats</h2>
          <div className="flex flex-wrap justify-center">
            {renderQRCodes()}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleDownloadAll}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Download All QR Codes
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
