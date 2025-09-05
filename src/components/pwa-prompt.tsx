"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                            (window.navigator as any).standalone ||
                            document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not already installed
      if (!isStandaloneMode) {
        setTimeout(() => {
          const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen');
          if (!hasSeenPrompt) {
            setShowPrompt(true);
          }
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
      localStorage.setItem('pwa-prompt-seen', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-seen', 'true');
  };

  // Don't show if already installed or running as PWA
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Install Goatius Notes</h3>
            <p className="text-sm text-gray-600">Get the full app experience</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="p-1 h-auto"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span>Works offline</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span>Faster loading</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span>Native app feel</span>
        </div>
      </div>

      {isIOS ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            To install: Tap <Share className="inline w-4 h-4" /> then "Add to Home Screen"
          </p>
          <Button
            onClick={handleDismiss}
            className="w-full"
            variant="outline"
          >
            Got it
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="flex-1"
          >
            Not now
          </Button>
          <Button
            onClick={handleInstallClick}
            className="flex-1"
          >
            Install
          </Button>
        </div>
      )}
    </div>
  );
}