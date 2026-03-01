import { NetworkService } from './network';
import { QueueService, EmergencyQueue, ComplaintQueue, LocationStorage } from './storage';

/**
 * API Service Layer
 * Handles all backend communication with offline queue support
 */

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://api.safezone.com', // Replace with actual backend URL
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

/**
 * Base API call with retry logic
 */
async function apiCall(endpoint, options = {}, retryCount = 0) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Retry logic
    if (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
      console.log(`Retrying... Attempt ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return apiCall(endpoint, options, retryCount + 1);
    }
    throw error;
  }
}

/**
 * Emergency API
 */
export const EmergencyAPI = {
  /**
   * Create Emergency SOS
   */
  async createEmergency(emergencyData) {
    const isOnline = await NetworkService.checkConnection();

    if (!isOnline) {
      // Save to offline queue
      const queued = await EmergencyQueue.savePendingSOS(emergencyData);
      return {
        success: true,
        offline: true,
        message: 'Emergency saved offline. Will sync when online.',
        data: queued,
      };
    }

    try {
      const response = await apiCall('/api/emergency', {
        method: 'POST',
        body: JSON.stringify(emergencyData),
      });

      // Save to history
      await EmergencyQueue.saveToHistory(response.data);

      return {
        success: true,
        offline: false,
        data: response.data,
      };
    } catch (error) {
      console.error('Create emergency error:', error);
      // Save to offline queue on error
      const queued = await EmergencyQueue.savePendingSOS(emergencyData);
      return {
        success: true,
        offline: true,
        error: error.message,
        data: queued,
      };
    }
  },

  /**
   * Update location during active emergency
   */
  async updateLocation(emergencyId, location) {
    const isOnline = await NetworkService.checkConnection();

    // Always save locally
    await LocationStorage.saveLocation(location);

    if (!isOnline) {
      // Queue for later sync
      await QueueService.addToQueue({
        type: 'location_update',
        emergencyId,
        location,
      });
      return { success: true, offline: true };
    }

    try {
      const response = await apiCall(`/api/emergency/${emergencyId}/location`, {
        method: 'PUT',
        body: JSON.stringify({ location }),
      });

      return {
        success: true,
        offline: false,
        data: response.data,
      };
    } catch (error) {
      console.error('Update location error:', error);
      // Queue for later sync
      await QueueService.addToQueue({
        type: 'location_update',
        emergencyId,
        location,
      });
      return { success: true, offline: true, error: error.message };
    }
  },

  /**
   * Mark emergency as resolved
   */
  async resolveEmergency(emergencyId) {
    const isOnline = await NetworkService.checkConnection();

    if (!isOnline) {
      await QueueService.addToQueue({
        type: 'resolve_emergency',
        emergencyId,
      });
      return { success: true, offline: true };
    }

    try {
      const response = await apiCall(`/api/emergency/${emergencyId}/resolve`, {
        method: 'PUT',
      });

      return {
        success: true,
        offline: false,
        data: response.data,
      };
    } catch (error) {
      console.error('Resolve emergency error:', error);
      await QueueService.addToQueue({
        type: 'resolve_emergency',
        emergencyId,
      });
      return { success: true, offline: true, error: error.message };
    }
  },

  /**
   * Get emergency history
   */
  async getHistory() {
    const isOnline = await NetworkService.checkConnection();

    if (!isOnline) {
      // Return local history
      const history = await EmergencyQueue.getHistory();
      return {
        success: true,
        offline: true,
        data: history,
      };
    }

    try {
      const response = await apiCall('/api/emergency/history');
      return {
        success: true,
        offline: false,
        data: response.data,
      };
    } catch (error) {
      console.error('Get history error:', error);
      // Fallback to local history
      const history = await EmergencyQueue.getHistory();
      return {
        success: true,
        offline: true,
        error: error.message,
        data: history,
      };
    }
  },
};

/**
 * Complaint API
 */
export const ComplaintAPI = {
  /**
   * Submit complaint
   */
  async submitComplaint(complaintData) {
    const isOnline = await NetworkService.checkConnection();

    if (!isOnline) {
      const queued = await ComplaintQueue.savePendingComplaint(complaintData);
      return {
        success: true,
        offline: true,
        message: 'Complaint saved offline. Will submit when online.',
        data: queued,
      };
    }

    try {
      const response = await apiCall('/api/complaint', {
        method: 'POST',
        body: JSON.stringify(complaintData),
      });

      return {
        success: true,
        offline: false,
        data: response.data,
      };
    } catch (error) {
      console.error('Submit complaint error:', error);
      const queued = await ComplaintQueue.savePendingComplaint(complaintData);
      return {
        success: true,
        offline: true,
        error: error.message,
        data: queued,
      };
    }
  },

  /**
   * Get complaint status
   */
  async getComplaintStatus(complaintId) {
    const isOnline = await NetworkService.checkConnection();

    if (!isOnline) {
      return {
        success: false,
        offline: true,
        message: 'Cannot check status offline',
      };
    }

    try {
      const response = await apiCall(`/api/complaint/${complaintId}`);
      return {
        success: true,
        offline: false,
        data: response.data,
      };
    } catch (error) {
      console.error('Get complaint status error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

/**
 * User Profile API
 */
export const ProfileAPI = {
  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    const isOnline = await NetworkService.checkConnection();

    if (!isOnline) {
      await QueueService.addToQueue({
        type: 'update_profile',
        data: profileData,
      });
      return {
        success: true,
        offline: true,
        message: 'Profile will sync when online',
      };
    }

    try {
      const response = await apiCall('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      return {
        success: true,
        offline: false,
        data: response.data,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      await QueueService.addToQueue({
        type: 'update_profile',
        data: profileData,
      });
      return {
        success: true,
        offline: true,
        error: error.message,
      };
    }
  },
};

/**
 * Services API (Find nearby help)
 */
export const ServicesAPI = {
  /**
   * Get nearby emergency services
   */
  async getNearbyServices(location, type = 'all') {
    const isOnline = await NetworkService.checkConnection();

    if (!isOnline) {
      return {
        success: false,
        offline: true,
        message: 'Cannot fetch services offline',
        data: [],
      };
    }

    try {
      const params = new URLSearchParams({
        lat: location.latitude,
        lng: location.longitude,
        type,
      });

      const response = await apiCall(`/api/services/nearby?${params}`);
      return {
        success: true,
        offline: false,
        data: response.data,
      };
    } catch (error) {
      console.error('Get nearby services error:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },
};
