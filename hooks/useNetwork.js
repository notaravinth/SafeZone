import { useState, useEffect } from 'react';
import { NetworkService } from '../services/network';
import { SyncManager } from '../services/sync';

/**
 * Custom hook for network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Initial check
    checkStatus();

    // Subscribe to network changes
    const unsubscribe = NetworkService.subscribe((status) => {
      setIsOnline(status);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkStatus = async () => {
    setIsChecking(true);
    const status = await NetworkService.checkConnection();
    setIsOnline(status);
    setIsChecking(false);
  };

  return {
    isOnline,
    isChecking,
    refresh: checkStatus,
  };
}

/**
 * Custom hook for sync status
 */
export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState({ isSyncing: false, lastSync: null });

  useEffect(() => {
    // Subscribe to sync events
    const unsubscribe = SyncManager.onSyncComplete((result) => {
      setSyncStatus({
        isSyncing: false,
        lastSync: result,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const triggerSync = async () => {
    setSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    const result = await SyncManager.forceSyncemergencies();
    setSyncStatus({
      isSyncing: false,
      lastSync: result,
    });
    return result;
  };

  return {
    ...syncStatus,
    triggerSync,
  };
}
