import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

/**
 * Custom hook to detect shake gestures using the device accelerometer
 * @param {function} onShake - Callback function to execute when shake is detected
 * @param {number} threshold - Shake sensitivity threshold (default: 3)
 * @param {number} timeout - Minimum time between shake detections in ms (default: 1000)
 */
export const useShake = (onShake, threshold = 3, timeout = 1000) => {
  const lastShake = useRef(0);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    // Set accelerometer update interval (in milliseconds)
    Accelerometer.setUpdateInterval(100);

    // Subscribe to accelerometer updates
    subscriptionRef.current = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      
      // Calculate total acceleration
      const acceleration = Math.hypot(x, y, z);
      
      // Check if acceleration exceeds threshold
      if (acceleration > threshold) {
        const currentTime = Date.now();
        
        // Prevent multiple rapid shake detections
        if (currentTime - lastShake.current > timeout) {
          lastShake.current = currentTime;
          
          // Trigger the shake callback
          if (onShake) {
            onShake();
          }
        }
      }
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, [onShake, threshold, timeout]);
};
