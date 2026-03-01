import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Offline Storage Service
 * Handles all local data persistence with queue management
 */

// Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  PENDING_SOS: 'pendingSOS',
  PENDING_COMPLAINTS: 'pendingComplaints',
  CACHED_NEWS: 'cachedNews',
  EMERGENCY_HISTORY: 'emergencyHistory',
  OFFLINE_QUEUE: 'offlineQueue',
  LAST_LOCATION: 'lastLocation',
  APP_SETTINGS: 'appSettings',
};

/**
 * Generic storage operations
 */
export const StorageService = {
  // Save data
  async save(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      return true;
    } catch (error) {
      console.error(`Storage save error for ${key}:`, error);
      return false;
    }
  },

  // Get data
  async get(key) {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error(`Storage get error for ${key}:`, error);
      return null;
    }
  },

  // Remove data
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Storage remove error for ${key}:`, error);
      return false;
    }
  },

  // Clear all app data
  async clearAll() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
};

/**
 * Queue Management for Offline Operations
 */
export const QueueService = {
  // Add item to queue
  async addToQueue(item) {
    try {
      const queue = await this.getQueue();
      const newItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        synced: false,
      };
      queue.push(newItem);
      await StorageService.save(STORAGE_KEYS.OFFLINE_QUEUE, queue);
      return newItem;
    } catch (error) {
      console.error('Queue add error:', error);
      return null;
    }
  },

  // Get entire queue
  async getQueue() {
    const queue = await StorageService.get(STORAGE_KEYS.OFFLINE_QUEUE);
    return queue || [];
  },

  // Get pending (unsynced) items
  async getPending() {
    const queue = await this.getQueue();
    return queue.filter(item => !item.synced);
  },

  // Mark item as synced
  async markSynced(itemId) {
    try {
      const queue = await this.getQueue();
      const updatedQueue = queue.map(item =>
        item.id === itemId ? { ...item, synced: true, syncedAt: new Date().toISOString() } : item
      );
      await StorageService.save(STORAGE_KEYS.OFFLINE_QUEUE, updatedQueue);
      return true;
    } catch (error) {
      console.error('Queue mark synced error:', error);
      return false;
    }
  },

  // Remove synced items older than 7 days
  async cleanQueue() {
    try {
      const queue = await this.getQueue();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const cleanedQueue = queue.filter(item => {
        if (!item.synced) return true;
        const syncedDate = new Date(item.syncedAt);
        return syncedDate > sevenDaysAgo;
      });

      await StorageService.save(STORAGE_KEYS.OFFLINE_QUEUE, cleanedQueue);
      return true;
    } catch (error) {
      console.error('Queue clean error:', error);
      return false;
    }
  },

  // Clear entire queue
  async clearQueue() {
    return await StorageService.save(STORAGE_KEYS.OFFLINE_QUEUE, []);
  },
};

/**
 * Emergency SOS Queue Management
 */
export const EmergencyQueue = {
  // Save pending SOS
  async savePendingSOS(sosData) {
    try {
      const pending = await this.getPendingSOS();
      const newSOS = {
        ...sosData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      pending.push(newSOS);
      await StorageService.save(STORAGE_KEYS.PENDING_SOS, pending);
      return newSOS;
    } catch (error) {
      console.error('Save pending SOS error:', error);
      return null;
    }
  },

  // Get all pending SOS
  async getPendingSOS() {
    const pending = await StorageService.get(STORAGE_KEYS.PENDING_SOS);
    return pending || [];
  },

  // Remove SOS from pending after successful sync
  async removePendingSOS(sosId) {
    try {
      const pending = await this.getPendingSOS();
      const filtered = pending.filter(sos => sos.id !== sosId);
      await StorageService.save(STORAGE_KEYS.PENDING_SOS, filtered);
      return true;
    } catch (error) {
      console.error('Remove pending SOS error:', error);
      return false;
    }
  },

  // Save to emergency history
  async saveToHistory(sosData) {
    try {
      const history = await this.getHistory();
      history.unshift(sosData);
      // Keep only last 50 emergencies
      if (history.length > 50) {
        history.splice(50);
      }
      await StorageService.save(STORAGE_KEYS.EMERGENCY_HISTORY, history);
      return true;
    } catch (error) {
      console.error('Save to history error:', error);
      return false;
    }
  },

  // Get emergency history
  async getHistory() {
    const history = await StorageService.get(STORAGE_KEYS.EMERGENCY_HISTORY);
    return history || [];
  },
};

/**
 * Complaint Queue Management
 */
export const ComplaintQueue = {
  // Save pending complaint
  async savePendingComplaint(complaintData) {
    try {
      const pending = await this.getPendingComplaints();
      const newComplaint = {
        ...complaintData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      pending.push(newComplaint);
      await StorageService.save(STORAGE_KEYS.PENDING_COMPLAINTS, pending);
      return newComplaint;
    } catch (error) {
      console.error('Save pending complaint error:', error);
      return null;
    }
  },

  // Get all pending complaints
  async getPendingComplaints() {
    const pending = await StorageService.get(STORAGE_KEYS.PENDING_COMPLAINTS);
    return pending || [];
  },

  // Remove complaint from pending
  async removePendingComplaint(complaintId) {
    try {
      const pending = await this.getPendingComplaints();
      const filtered = pending.filter(c => c.id !== complaintId);
      await StorageService.save(STORAGE_KEYS.PENDING_COMPLAINTS, filtered);
      return true;
    } catch (error) {
      console.error('Remove pending complaint error:', error);
      return false;
    }
  },
};

/**
 * Location Storage
 */
export const LocationStorage = {
  // Save last known location
  async saveLocation(location) {
    return await StorageService.save(STORAGE_KEYS.LAST_LOCATION, {
      ...location,
      timestamp: new Date().toISOString(),
    });
  },

  // Get last known location
  async getLastLocation() {
    return await StorageService.get(STORAGE_KEYS.LAST_LOCATION);
  },
};
