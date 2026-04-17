import * as Location from 'expo-location';

export const requestPermissions = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }
  return true;
};

export const getCurrentLocation = async () => {
  try {
    await requestPermissions();
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    // Strict timeout for Android emulators
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('GPS Timeout')), 5000)
    );
    
    const location = await Promise.race([locationPromise, timeoutPromise]);
    
    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };
  } catch (e) {
    console.warn('GPS failed, using mock location for emulator', e);
    // Fallback to Bhopal center for emulator testing
    return {
      lat: 23.2599,
      lng: 77.4126
    };
  }
};

export const watchLocation = async (callback) => {
  try {
    await requestPermissions();
    return await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10
      },
      (loc) => {
        callback({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude
        });
      }
    );
  } catch (e) {
    return null;
  }
};
