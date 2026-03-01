import { NetworkService } from './network';
import { QueueService, EmergencyQueue, ComplaintQueue } from './storage';

/**
 * Sync Manager
 * Handles background synchronization of queued data when online
 */

let isSyncing = false;
let syncListeners = [];

export const SyncManager = {
  /**
   * Initialize sync manager
   */
  initialize() {
    // Start network monitoring
    NetworkService.startMonitoring();

    // Subscribe to network changes
    NetworkService.subscribe((isOnline) => {
      if (isOnline && !isSyncing) {
        console.log('Network available - starting sync...');
        this.syncAll();
      }
    });

    console.log('Sync Manager initialized');
  },

  /**
   * Subscribe to sync events
   */
  onSyncComplete(callback) {
    syncListeners.push(callback);
    return () => {
      syncListeners = syncListeners.filter(cb => cb !== callback);
    };
  },

  /**
   * Notify sync listeners
   */
  notifySyncComplete(result) {
    syncListeners.forEach(callback => callback(result));
  },

  /**
   * Sync all pending data
   */
  async syncAll() {
    if (isSyncing) {
      console.log('Sync already in progress');
      return { success: false, message: 'Sync in progress' };
    }

    const isOnline = await NetworkService.checkConnection();
    if (!isOnline) {
      console.log('Device offline - cannot sync');
      return { success: false, message: 'Device offline' };
    }

    isSyncing = true;
    const results = {
      emergency: { success: 0, failed: 0 },
      complaints: { success: 0, failed: 0 },
      queue: { success: 0, failed: 0 },
    };

    try {
      console.log('Starting full sync...');

      // Sync pending SOS
      const sosResult = await this.syncPendingEmergencies();
      results.emergency = sosResult;

      // Sync pending complaints
      const complaintResult = await this.syncPendingComplaints();
      results.complaints = complaintResult;

      // Sync general queue
      const queueResult = await this.syncGeneralQueue();
      results.queue = queueResult;

      // Clean old synced items
      await QueueService.cleanQueue();

      console.log('Sync completed:', results);

      const syncResult = {
        success: true,
        results,
        timestamp: new Date().toISOString(),
      };

      this.notifySyncComplete(syncResult);
      return syncResult;
    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        error: error.message,
        results,
      };
    } finally {
      isSyncing = false;
    }
  },

  /**
   * Sync pending emergencies
   */
  async syncPendingEmergencies() {
    const results = { success: 0, failed: 0, items: [] };

    try {
      const pending = await EmergencyQueue.getPendingSOS();
      console.log(`Syncing ${pending.length} pending emergencies...`);

      for (const sos of pending) {
        try {
          // In real implementation, call actual API
          console.log('Syncing SOS:', sos.id);

          // Simulate API call
          const response = await this.mockAPICall('/api/emergency', {
            method: 'POST',
            body: JSON.stringify(sos),
          });

          if (response.success) {
            // Remove from pending
            await EmergencyQueue.removePendingSOS(sos.id);
            // Save to history
            await EmergencyQueue.saveToHistory({
              ...sos,
              syncedAt: new Date().toISOString(),
            });
            results.success++;
            results.items.push({ id: sos.id, status: 'synced' });
          } else {
            results.failed++;
            results.items.push({ id: sos.id, status: 'failed', error: response.error });
          }
        } catch (error) {
          console.error(`Failed to sync SOS ${sos.id}:`, error);
          results.failed++;
          results.items.push({ id: sos.id, status: 'failed', error: error.message });
        }
      }
    } catch (error) {
      console.error('Sync pending emergencies error:', error);
    }

    return results;
  },

  /**
   * Sync pending complaints
   */
  async syncPendingComplaints() {
    const results = { success: 0, failed: 0, items: [] };

    try {
      const pending = await ComplaintQueue.getPendingComplaints();
      console.log(`Syncing ${pending.length} pending complaints...`);

      for (const complaint of pending) {
        try {
          console.log('Syncing complaint:', complaint.id);

          // Simulate API call
          const response = await this.mockAPICall('/api/complaint', {
            method: 'POST',
            body: JSON.stringify(complaint),
          });

          if (response.success) {
            await ComplaintQueue.removePendingComplaint(complaint.id);
            results.success++;
            results.items.push({ id: complaint.id, status: 'synced' });
          } else {
            results.failed++;
            results.items.push({ id: complaint.id, status: 'failed', error: response.error });
          }
        } catch (error) {
          console.error(`Failed to sync complaint ${complaint.id}:`, error);
          results.failed++;
          results.items.push({ id: complaint.id, status: 'failed', error: error.message });
        }
      }
    } catch (error) {
      console.error('Sync pending complaints error:', error);
    }

    return results;
  },

  /**
   * Sync general queue items
   */
  async syncGeneralQueue() {
    const results = { success: 0, failed: 0, items: [] };

    try {
      const pending = await QueueService.getPending();
      console.log(`Syncing ${pending.length} queued items...`);

      for (const item of pending) {
        try {
          console.log('Syncing queue item:', item.type);

          // Handle different types
          let response;
          switch (item.type) {
            case 'location_update':
              response = await this.mockAPICall(
                `/api/emergency/${item.emergencyId}/location`,
                {
                  method: 'PUT',
                  body: JSON.stringify({ location: item.location }),
                }
              );
              break;

            case 'resolve_emergency':
              response = await this.mockAPICall(
                `/api/emergency/${item.emergencyId}/resolve`,
                {
                  method: 'PUT',
                }
              );
              break;

            case 'update_profile':
              response = await this.mockAPICall('/api/profile', {
                method: 'PUT',
                body: JSON.stringify(item.data),
              });
              break;

            default:
              console.log('Unknown queue item type:', item.type);
              continue;
          }

          if (response && response.success) {
            await QueueService.markSynced(item.id);
            results.success++;
            results.items.push({ id: item.id, type: item.type, status: 'synced' });
          } else {
            results.failed++;
            results.items.push({ id: item.id, type: item.type, status: 'failed' });
          }
        } catch (error) {
          console.error(`Failed to sync queue item ${item.id}:`, error);
          results.failed++;
          results.items.push({ id: item.id, type: item.type, status: 'failed', error: error.message });
        }
      }
    } catch (error) {
      console.error('Sync general queue error:', error);
    }

    return results;
  },

  /**
   * Mock API call for demo (replace with actual API in production)
   */
  async mockAPICall(endpoint, options) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful response
        resolve({
          success: true,
          data: {
            id: Date.now(),
            endpoint,
            timestamp: new Date().toISOString(),
          },
        });
      }, 500);
    });
  },

  /**
   * Force immediate sync
   */
  async forceSyncemergencies() {
    console.log('Force sync triggered');
    return await this.syncAll();
  },

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isSyncing,
      isOnline: NetworkService.getStatus(),
    };
  },

  /**
   * Manual trigger for testing
   */
  async testSync() {
    console.log('=== Testing Sync Manager ===');
    const result = await this.syncAll();
    console.log('Test sync result:', result);
    return result;
  },
};
