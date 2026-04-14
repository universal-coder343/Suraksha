import { Accelerometer } from 'expo-sensors';

let subscription = null;
let lastTrigger = 0;

export const startShakeDetection = (callback) => {
  Accelerometer.setUpdateInterval(100);

  subscription = Accelerometer.addListener(accelerometerData => {
    const { x, y, z } = accelerometerData;
    // Calculate magnitude
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    // G-force threshold for shaking is usually around 2.5 - 3.0
    if (magnitude > 2.8) {
      const now = Date.now();
      if (now - lastTrigger > 2000) { // Debounce 2 seconds
        lastTrigger = now;
        callback();
      }
    }
  });
};

export const stopShakeDetection = () => {
  if (subscription) {
    subscription.remove();
    subscription = null;
  }
};
