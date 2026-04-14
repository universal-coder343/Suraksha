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
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };
  } catch (e) {
    return null;
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
