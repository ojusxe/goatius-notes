"use client";

export const registerServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully:', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              showUpdateNotification();
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated');
        }
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('Service Worker unregistered');
      }
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
    }
  }
};

const showUpdateNotification = () => {
  // Create a simple notification for app updates
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Goatius Notes Updated', {
      body: 'A new version is available. Refresh to update.',
      icon: '/icon.png',
      badge: '/icon.png',
    });
  } else {
    // Fallback to console or custom UI notification
    console.log('App update available');
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return false;
    }
  }
  return Notification.permission === 'granted';
};

export const addToHomeScreen = () => {
  // This will be handled by the PWAPrompt component
  console.log('Add to home screen triggered');
};

// Offline storage utilities
export const saveNoteOffline = (note: any) => {
  try {
    const pendingNotes = JSON.parse(localStorage.getItem('pending_notes') || '[]');
    const existingIndex = pendingNotes.findIndex((n: any) => n.id === note.id);
    
    if (existingIndex >= 0) {
      pendingNotes[existingIndex] = { ...note, timestamp: Date.now() };
    } else {
      pendingNotes.push({ ...note, timestamp: Date.now() });
    }
    
    localStorage.setItem('pending_notes', JSON.stringify(pendingNotes));
    
    // Register for background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register('background-sync-notes');
      });
    }
  } catch (error) {
    console.error('Failed to save note offline:', error);
  }
};

export const getPendingNotes = () => {
  try {
    return JSON.parse(localStorage.getItem('pending_notes') || '[]');
  } catch (error) {
    console.error('Failed to get pending notes:', error);
    return [];
  }
};

export const clearPendingNotes = () => {
  try {
    localStorage.removeItem('pending_notes');
  } catch (error) {
    console.error('Failed to clear pending notes:', error);
  }
};

// Network status detection
export const isOnline = () => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

export const addNetworkListeners = (onOnline: () => void, onOffline: () => void) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }
  return () => {};
};