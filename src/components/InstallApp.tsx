import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

export const InstallApp: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReady(true);
      console.log('[PWA InstallApp] beforeinstallprompt event captured.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Grab early prompt if saved globally on window
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
      setIsReady(true);
    }

    // Custom event dispatch callback from index.html
    const handleCustomPrompt = (e: any) => {
      setDeferredPrompt(e.detail);
      setIsReady(true);
    };
    window.addEventListener('pwa-prompt-available', handleCustomPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-available', handleCustomPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.warn('[PWA InstallApp] No prompt available.');
      return;
    }
    
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log(`[PWA InstallApp] Choice outcome: ${choiceResult.outcome}`);
    } catch (err) {
      console.error('[PWA InstallApp] Prompt execution failed:', err);
    } finally {
      setDeferredPrompt(null);
      setIsReady(false);
    }
  };

  if (!isReady || !deferredPrompt) {
    return null;
  }

  return (
    <button
      id="pwa-install-button"
      onClick={handleInstallClick}
      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-95 hover:scale-102 transition-all duration-200 cursor-pointer border-none"
    >
      <Smartphone className="w-4.5 h-4.5 animate-bounce" />
      <span>Descargar PWA</span>
    </button>
  );
};
