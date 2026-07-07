import React, { useState, useEffect } from 'react';
import { Smartphone, Share, X, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InstallApp: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showiOSGuide, setShowiOSGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Detect if running in standalone mode (already installed PWA)
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isStandaloneNavigator = (window.navigator as any).standalone === true;
      return isStandaloneMedia || isStandaloneNavigator;
    };
    
    const standaloneActive = checkStandalone();
    setIsStandalone(standaloneActive);

    // 2. Detect if the user is on iOS (Safari)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isMacIPad = navigator.maxTouchPoints > 0 && /macintosh/.test(ua);
    const detectIOS = isIosDevice || isMacIPad;
    
    setIsIOS(detectIOS);

    // 3. Event listeners for native beforeinstallprompt (Android / Chrome / PC)
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
    if (isIOS) {
      // For iOS, show the interactive visual installation guide
      setShowiOSGuide(true);
      return;
    }

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

  // If already running in standalone mode (as an installed PWA), hide the button permanently.
  if (isStandalone) {
    return null;
  }

  // The button should be shown if we detected iOS (always available as a helper)
  // OR if the native installation prompt is ready on other platforms.
  const showButton = isIOS || (isReady && deferredPrompt);

  if (!showButton) {
    return null;
  }

  return (
    <>
      <button
        id="pwa-install-button"
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-95 hover:scale-102 transition-all duration-200 cursor-pointer border-none"
      >
        <Smartphone className="w-4.5 h-4.5 animate-bounce" />
        <span>{isIOS ? 'Cómo instalar en iPhone' : 'Descargar PWA'}</span>
      </button>

      {/* Elegant iOS Safari Installation Guide Modal */}
      <AnimatePresence>
        {showiOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowiOSGuide(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#0e1726] to-[#040c16] border border-pink-500/20 rounded-3xl p-6 shadow-2xl overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />

              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-sans font-extrabold text-lg text-white leading-tight">
                      Instalar en tu iPhone
                    </h3>
                    <p className="text-xs text-pink-300/80 font-medium">Instalación rápida en 3 pasos</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowiOSGuide(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer border-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Instructions List */}
              <div className="mt-6 space-y-4 font-sans text-sm text-gray-300">
                {/* Step 1 */}
                <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-pink-500/10 transition-all">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/40 text-xs text-pink-300 flex items-center justify-center shrink-0 font-bold font-mono">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="leading-relaxed text-white font-medium">
                      Abre M.A.P.A.™ en <span className="text-pink-400 font-semibold">Safari</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Toca el botón de <span className="font-semibold text-white">Compartir</span> <Share className="inline-block w-4 h-4 text-pink-400 mx-0.5" /> en la barra inferior (o superior en iPad).
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-pink-500/10 transition-all">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/40 text-xs text-pink-300 flex items-center justify-center shrink-0 font-bold font-mono">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="leading-relaxed text-white font-medium">
                      Agregar a Inicio
                    </p>
                    <p className="text-xs text-gray-400">
                      Desplázate hacia abajo en el menú de opciones y selecciona <span className="font-semibold text-white">"Agregar a Inicio"</span> (o <span className="font-semibold text-white">"Añadir a pantalla de inicio"</span>) <span className="text-pink-400 font-bold">➕</span>.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-pink-500/10 transition-all">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/40 text-xs text-pink-300 flex items-center justify-center shrink-0 font-bold font-mono">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="leading-relaxed text-white font-medium">
                      Confirmar
                    </p>
                    <p className="text-xs text-gray-400">
                      Toca <span className="font-semibold text-white">"Agregar"</span> (o <span className="font-semibold text-white">"Añadir"</span>) en la esquina superior derecha para finalizar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowiOSGuide(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm tracking-wide shadow-lg transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Entendido, listo</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
