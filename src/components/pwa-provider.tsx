"use client";

import { useEffect, useState } from 'react';
import { registerServiceWorker, addNetworkListeners, isOnline } from '@/lib/pwa';
import PWAPrompt from './pwa-prompt';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Set initial online status
    setIsOffline(!isOnline());

    // Add network listeners
    const removeListeners = addNetworkListeners(
      () => {
        setIsOffline(false);
        setShowOfflineBanner(false);
        console.log('App is online');
      },
      () => {
        setIsOffline(true);
        setShowOfflineBanner(true);
        console.log('App is offline');
        
        // Hide offline banner after 5 seconds
        setTimeout(() => {
          setShowOfflineBanner(false);
        }, 5000);
      }
    );

    return removeListeners;
  }, []);

  return (
    <>
      {children}
      
      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 px-4 z-50">
          <p className="text-sm font-medium">
            You're offline. Your changes will be saved locally and synced when you're back online.
          </p>
        </div>
      )}
      
      {/* PWA Install Prompt */}
      <PWAPrompt />
      
      {/* Network Status Indicator */}
      {isOffline && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs z-40">
          Offline
        </div>
      )}
    </>
  );
}