import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Fallback: store on window just in case
      (window as any).deferredPrompt = e;
    };

    // If it was captured early in index.html head
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also listen to the custom event from index.html
    const handleCustomPrompt = (e: any) => {
      setDeferredPrompt(e.detail);
    };
    window.addEventListener('pwa-prompt-available', handleCustomPrompt);

    // Detect Platform
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);
    
    // Detect Iframe
    const isInsideIframe = window.self !== window.top;
    setIsInIframe(isInsideIframe);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-available', handleCustomPrompt);
    };
  }, []);

  const triggerInstall = async (): Promise<boolean> => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt || (window.parent as any)?.deferredPrompt;
    
    if (promptEvent && typeof promptEvent.prompt === 'function') {
      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted the install prompt');
          return true;
        } else {
          console.log('[PWA] User dismissed the install prompt');
          return false;
        }
      } catch (error) {
        console.error('[PWA] Error triggering install prompt:', error);
        return false;
      } finally {
        setDeferredPrompt(null);
        (window as any).deferredPrompt = null;
      }
    }
    return false;
  };

  return {
    deferredPrompt,
    isIOS,
    isInIframe,
    triggerInstall,
  };
};
