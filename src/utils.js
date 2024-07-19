export const createCookie = (cookieName, cookieValue, hourToExpire,) => {
  const date = new Date()
  date.setTime(date.getTime() + hourToExpire * 60 * 60 * 1000,)
  document.cookie = `${cookieName} = ${cookieValue}; expires = ${date.toGMTString()}`
}

export const deleteCookie = (name,) =>
  (document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;')

export const numberWithCommas = (x) => {
  console.log(x);
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
