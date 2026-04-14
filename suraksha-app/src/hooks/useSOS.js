import { useState } from 'react';
import { triggerSOS, cancelSOSAlert } from '../services/sosService';
import { Alert } from 'react-native';

export const useSOS = () => {
  const [activeSOS, setActiveSOS] = useState(null);
  const [loading, setLoading] = useState(false);

  const activate = async (method = 'manual') => {
    setLoading(true);
    try {
      const sosData = await triggerSOS(method);
      setActiveSOS(sosData);
      return true;
    } catch (e) {
      Alert.alert("SOS Failed", e.message || "Could not trigger SOS.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!activeSOS) return;
    setLoading(true);
    try {
      await cancelSOSAlert(activeSOS._id);
      setActiveSOS(null);
      return true;
    } catch (e) {
      Alert.alert("Cancel Failed", "Could not cancel SOS.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { activeSOS, loading, activate, cancel };
};
