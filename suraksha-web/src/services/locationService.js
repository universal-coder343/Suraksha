export const getCurrentLocation = () => {
  return new Promise((resolve) => {
    // Mocked to Jaipur Center for testing
    const JAIPUR_CENTER = { lat: 26.9124, lng: 75.7873 };
    console.log('Using Mocked Location (Jaipur)', JAIPUR_CENTER);
    resolve(JAIPUR_CENTER);
  });
};

export const watchLocation = (callback) => {
  if (!navigator.geolocation) return null;

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    (error) => console.error(error),
    { enableHighAccuracy: true }
  );
};
 
 export const getGeocode = async (address) => {
   try {
     const response = await fetch(
       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
         address + ', Jaipur'
       )}&limit=1`
     );
     const data = await response.json();
     if (data && data.length > 0) {
       return {
         lat: parseFloat(data[0].lat),
         lng: parseFloat(data[0].lon),
         displayName: data[0].display_name
       };
     }
     throw new Error('Location not found');
   } catch (error) {
     console.error('Geocoding error:', error);
     throw error;
   }
 };
