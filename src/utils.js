
export const createCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

// Function to get a cookie value
export const readCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (const element of ca) {
    let c = element;
    while (c.startsWith(' ')) c = c.substring(1, c.length);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Function to erase a cookie
export const eraseCookie = (name) => {
  document.cookie = name + '=; Max-Age=-99999999;';
};

export const numberWithCommas = (x) => {
  if (x === undefined || x === null) {
    return "";
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// src/utils.js

export const getLocalIP = async () => {
  // Implementasi fungsi untuk mendapatkan IP lokal
  return new Promise((resolve, reject) => {
    // WebRTC method to get local IP addresses
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));

    pc.onicecandidate = (event) => {
      if (!event || !event.candidate || !event.candidate.candidate) return;
      const candidate = event.candidate.candidate;
      const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
      const match = candidate.match(ipRegex);
      if (match) resolve(match[1]);
    };

    setTimeout(() => {
      reject('Failed to get local IP');
    }, 1000);
  });
};

export const getCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, error => {
        reject(error);
      });
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};
