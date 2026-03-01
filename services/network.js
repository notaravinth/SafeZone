/**
 * Network Detection Service
 * For React Native - uses fetch to check connectivity
 */

let isOnline = true;
let listeners = [];
let checkInProgress = false;

export const NetworkService = {
  // Check if device is online
  async checkConnection() {
    if (checkInProgress) {
      return isOnline;
    }

    checkInProgress = true;
    try {
      // Try to fetch a small resource with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      isOnline = response.ok;
      this.notifyListeners(isOnline);
      return isOnline;
    } catch (error) {
      // Silently fail - assume offline
      isOnline = false;
      this.notifyListeners(false);
      return false;
    } finally {
      checkInProgress = false;
    }
  },

  // Get current status
  getStatus() {
    return isOnline;
  },

  // Subscribe to network changes
  subscribe(callback) {
    listeners.push(callback);
    // Return unsubscribe function
    return () => {
      listeners = listeners.filter(cb => cb !== callback);
    };
  },

  // Notify all listeners
  notifyListeners(status) {
    listeners.forEach(callback => callback(status));
  },

  // Start monitoring (check every 10 seconds)
  startMonitoring() {
    this.checkConnection();
    this.monitoringInterval = setInterval(() => {
      this.checkConnection();
    }, 10000);
  },

  // Stop monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  },
};
