import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Smartphone, Monitor, Plus, Share2, X, Check } from "lucide-react";

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platformInfo, setPlatformInfo] = useState({
    isIOS: false,
    isMac: false,
    isSafari: false,
    isFirefox: false,
    isMobile: false,
  });

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed & opened as app)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia("(display-mode: standalone)").matches || 
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://");
      
      setIsStandalone(isStandaloneMode);
      return isStandaloneMode;
    };

    const standalone = checkStandalone();

    // 2. Capture platform information for custom step-by-step instructions
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isMac = /macintosh|mac os x/.test(ua) && !isIOS;
    const isSafari = /safari/.test(ua) && !/chrome|crios|crmo|firefox|fxios/.test(ua);
    const isFirefox = /firefox|fxios/.test(ua);
    const isMobile = /iphone|ipad|ipod|android|webos|blackberry|iemobile|opera mini/.test(ua);

    setPlatformInfo({ isIOS, isMac, isSafari, isFirefox, isMobile });

    // 3. Listen for Chromium's native PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // If we are not in standalone and haven't dismissed in this session, show
      const isDismissedThisSession = sessionStorage.getItem("MAPA_PWA_BANNER_DISMISSED") === "true";
      if (!standalone && !isDismissedThisSession) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Fallback show for non-Chromium browsers (Safari iOS/macOS, Firefox etc)
    // Since beforeinstallprompt is NOT fired on iOS Safari, we trigger the banner manually
    const isDismissedThisSession = sessionStorage.getItem("MAPA_PWA_BANNER_DISMISSED") === "true";
    if (!standalone && !isDismissedThisSession) {
      // Show banner after 3 seconds for a smooth user entrance experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isStandalone]);

  // Listen to successful installations to hide banner permanently
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log("[PWA] App successfully installed!");
      setIsStandalone(true);
      setIsVisible(false);
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native installation dialog
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Installation prompt user decision: ${outcome}`);
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    } else {
      // Show manual step-by-step instructions for Safari/Firefox
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    // Hide for this visit/session only as per requirement:
    // "Si el usuario no instala la aplicación, el sistema deberá volver a mostrar la invitación en cada nueva visita."
    sessionStorage.setItem("MAPA_PWA_BANNER_DISMISSED", "true");
    setIsVisible(false);
  };

  // Do not render anything if already installed/standalone
  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="pwa_install_banner"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl bg-gradient-to-r from-[#07111F] via-[#0D1F38] to-[#07111F] border border-[#7EF9FF]/30 rounded-3xl p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl"
        >
          {!showInstructions ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5 text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#113A63]/70 border border-[#7EF9FF]/30 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
                  <Download className="w-6 h-6 text-[#7EF9FF] animate-bounce" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                    Instalar M.A.P.A.™ en tu Dispositivo
                    <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider">
                      Recomendado
                    </span>
                  </h4>
                  <p className="text-gray-300 text-xs mt-0.5 leading-relaxed max-w-md">
                    Descarga la aplicación oficial gratis para acceder sin límites, guardar tu progreso sin Internet y recibir notificaciones instantáneas de tus retos diarios.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end shrink-0">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 md:flex-initial py-2.5 px-5 bg-gradient-to-r from-[#7EF9FF] to-[#00D4FF] hover:opacity-95 text-slate-900 font-display font-bold text-xs rounded-xl tracking-wider hover:scale-103 active:scale-97 transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-cyan-400/20"
                >
                  {platformInfo.isMobile ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  <span>INSTALAR AHORA</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all cursor-pointer"
                  title="Recordar en la siguiente visita"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-display font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#7EF9FF]" />
                  Instrucciones de Instalación
                </h4>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-1 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="text-xs space-y-3 leading-relaxed text-gray-200">
                {platformInfo.isIOS && platformInfo.isSafari && (
                  <div className="space-y-2">
                    <p className="font-semibold text-[#7EF9FF]">Para instalar en tu iPhone o iPad (Safari):</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Presiona el botón de <span className="font-bold text-white flex inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded">Compartir <Share2 className="w-3.5 h-3.5 text-sky-400 inline" /></span> en la barra inferior del navegador.</li>
                      <li>Desplázate hacia abajo y selecciona <span className="font-bold text-[#7EF9FF] flex inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded">Agregar a la pantalla de inicio <Plus className="w-3.5 h-3.5 text-sky-400 inline" /></span>.</li>
                      <li>Presiona <span className="font-bold text-emerald-400">Agregar</span> en la esquina superior derecha y ¡listo!</li>
                    </ol>
                  </div>
                )}

                {platformInfo.isMac && platformInfo.isSafari && (
                  <div className="space-y-2">
                    <p className="font-semibold text-[#7EF9FF]">Para instalar en tu Mac (Safari):</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Haz clic en <span className="font-bold text-white">Archivo</span> en la barra superior o presiona el botón de <span className="font-bold text-white flex inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded">Compartir <Share2 className="w-3.5 h-3.5 text-sky-400 inline" /></span>.</li>
                      <li>Selecciona <span className="font-bold text-[#7EF9FF] bg-white/10 px-1.5 py-0.5 rounded">Agregar al Dock...</span> en la lista.</li>
                      <li>Confirma haciendo clic en <span className="font-bold text-emerald-400">Agregar</span> para anclar M.A.P.A.™ junto a tus aplicaciones de escritorio.</li>
                    </ol>
                  </div>
                )}

                {/* General default instructions for other cases where prompt didn't fire */}
                {!(platformInfo.isSafari && (platformInfo.isIOS || platformInfo.isMac)) && (
                  <div className="space-y-2">
                    <p className="font-semibold text-[#7EF9FF]">Guía de descarga e instalación rápida:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Busca el ícono de <span className="font-bold text-white">Instalar Aplicación</span> (una pantalla con una flecha hacia abajo o un signo <span className="font-bold">+</span>) en la barra de direcciones de tu navegador (Chrome, Edge, Firefox u Opera).</li>
                      <li>Alternativamente, haz clic en el menú secundario <span className="font-bold text-white">⋮</span> (tres puntos) en la esquina superior derecha de tu navegador.</li>
                      <li>Selecciona <span className="font-bold text-[#7EF9FF] bg-white/10 px-1.5 py-0.5 rounded">Instalar M.A.P.A.™</span> o <span className="font-bold text-[#7EF9FF] bg-white/10 px-1.5 py-0.5 rounded">Guardar en Pantalla de Inicio</span>.</li>
                    </ol>
                  </div>
                )}

                <div className="bg-[#113A63]/30 border border-[#7EF9FF]/20 p-3 rounded-2xl flex items-start gap-2.5 mt-2 text-[11px] text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    Una vez completada la instalación, podrás iniciar M.A.P.A.™ directamente desde el ícono de tu pantalla de inicio o Dock como una aplicación nativa segura.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="py-2 px-4 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-xl transition-all cursor-pointer"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
