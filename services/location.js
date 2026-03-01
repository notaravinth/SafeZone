import * as Location from 'expo-location';
import { LocationStorage } from './storage';
import { EmergencyAPI } from './api';

/**
 * Location Tracking Service
 * Handles real-time location updates during emergencies
 */

let trackingSubscription = null;
let currentEmergencyId = null;
let isTracking = false;

export const LocationService = {
  /**
   * Request location permissions
   */
  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return {
          success: false,
          message: 'Location permission denied',
        };
      }
      return { success: true };
    } catch (error) {
      console.error('Location permission error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  /**
   * Get current location once
   */
  async getCurrentLocation() {
    try {
      const permissionResult = await this.requestPermissions();
      if (!permissionResult.success) {
        return permissionResult;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp).toISOString(),
      };

      // Save to local storage
      await LocationStorage.saveLocation(locationData);

      return {
        success: true,
        data: locationData,
      };
    } catch (error) {
      console.error('Get location error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  /**
   * Start real-time location tracking for emergency
   */
  async startTracking(emergencyId, interval = 5000) {
    try {
      if (isTracking) {
        console.log('Already tracking location');
        return { success: true, message: 'Already tracking' };
      }

      const permissionResult = await this.requestPermissions();
      if (!permissionResult.success) {
        return permissionResult;
      }

      currentEmergencyId = emergencyId;
      isTracking = true;

      // Start location updates
      trackingSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: interval,
          distanceInterval: 10, // Update every 10 meters
        },
        async (location) => {
          const locationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            speed: location.coords.speed,
            heading: location.coords.heading,
            timestamp: new Date(location.timestamp).toISOString(),
          };

          // Save locally
          await LocationStorage.saveLocation(locationData);

          // Send to backend
          if (currentEmergencyId) {
            await EmergencyAPI.updateLocation(currentEmergencyId, locationData);
          }

          console.log('Location updated:', locationData);
        }
      );

      return {
        success: true,
        message: 'Location tracking started',
      };
    } catch (error) {
      console.error('Start tracking error:', error);
      isTracking = false;
      return {
        success: false,
        message: error.message,
      };
    }
  },

  /**
   * Stop location tracking
   */
  stopTracking() {
    if (trackingSubscription) {
      trackingSubscription.remove();
      trackingSubscription = null;
    }
    isTracking = false;
    currentEmergencyId = null;
    console.log('Location tracking stopped');
  },

  /**
   * Check if currently tracking
   */
  isCurrentlyTracking() {
    return isTracking;
  },

  /**
   * Get last known location from storage
   */
  async getLastKnownLocation() {
    return await LocationStorage.getLastLocation();
  },

  /**
   * Get location address (reverse geocoding)
   */
  async getAddress(latitude, longitude) {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        return {
          success: true,
          data: {
            street: address.street,
            city: address.city,
            region: address.region,
            country: address.country,
            postalCode: address.postalCode,
            formattedAddress: `${address.street}, ${address.city}, ${address.region}`,
          },
        };
      }

      return {
        success: false,
        message: 'Address not found',
      };
    } catch (error) {
      console.error('Get address error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
};
