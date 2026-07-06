import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Smartphone, Monitor, X, Check, Loader2, Sparkles, ExternalLink } from "lucide-react";

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallSuccess: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose, onInstallSuccess }) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [platformInfo, setPlatformInfo] = useState({
    isIOS: false,
    isMobile: false,
    isInIframe: false,
  });

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isMobile = /iphone|ipad|ipod|android|webos|blackberry|iemobile|opera mini/.test(ua);
    const isInIframe = window.self !== window.top;

    setPlatformInfo({ isIOS, isMobile, isInIframe });
  }, []);

  // Listen to the successful installation event to automatically hide and complete
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log("[PWA Modal] App successfully installed natively!");
      setIsInstalling(false);
      onInstallSuccess();
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [onInstallSuccess]);

  const handleInstallClick = async () => {
    setStatusMessage(null);

    // 1. Check if running inside an iframe
    if (platformInfo.isInIframe) {
      setStatusMessage("Abriendo la aplicación en una pestaña nueva para iniciar la instalación nativa fuera del visor...");
      setTimeout(() => {
        window.open(window.location.href, "_blank");
        setStatusMessage(null);
      }, 2000);
      return;
    }

    // 2. iOS Safari manual guide
    if (platformInfo.isIOS) {
      setStatusMessage("Para instalar en tu iPhone o iPad: Pulsa el botón de Compartir en Safari 📤 y selecciona 'Añadir a pantalla de inicio' ➕.");
      return;
    }

    // 3. Native install prompt execution with a robust timeout check
    const currentPrompt = (window as any).deferredPrompt;
    if (currentPrompt) {
      setIsInstalling(true);
      
      // Safety timeout: 4 seconds to clear the loading spinner to prevent the UI from freezing permanently
      const safetyTimeout = setTimeout(() => {
        console.warn("[PWA Modal] Installation prompt choice timed out (safety trigger).");
        setIsInstalling(false);
        setStatusMessage("La solicitud de instalación tomó más tiempo de lo esperado. Si no apareció la ventana nativa, puedes intentar desde el menú de tu navegador.");
        setTimeout(() => setStatusMessage(null), 6000);
      }, 4000);

      try {
        console.log("[PWA Modal] Launching browser native prompt...");
        await currentPrompt.prompt();

        // Race between user choice and an additional timeout
        const choicePromise = currentPrompt.userChoice;
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("TIMEOUT")), 15000)
        );

        const choiceResult = await Promise.race([choicePromise, timeoutPromise]);
        clearTimeout(safetyTimeout);

        console.log(`[PWA Modal] User installation choice: ${choiceResult.outcome}`);
        
        if (choiceResult.outcome === "accepted") {
          console.log("[PWA Modal] Native installation accepted.");
          onInstallSuccess();
        } else {
          console.log("[PWA Modal] Native installation dismissed.");
          setStatusMessage("Instalación cancelada. Puedes intentarlo de nuevo cuando desees.");
          setTimeout(() => setStatusMessage(null), 4000);
        }
      } catch (err: any) {
        clearTimeout(safetyTimeout);
        if (err && err.message === "TIMEOUT") {
          console.warn("[PWA Modal] User choice promise timed out.");
          setStatusMessage("La confirmación tardó demasiado. Si se instaló correctamente, tu progreso está a salvo.");
        } else {
          console.error("[PWA Modal] Error displaying installation prompt:", err);
          setStatusMessage("Error al iniciar el diálogo de instalación. Intenta desde el menú de tu navegador.");
        }
        setTimeout(() => setStatusMessage(null), 4000);
      } finally {
        // Safe state cleanup
        setIsInstalling(false);
        // Explicitly clear deferredPrompt to prevent stale triggers
        (window as any).deferredPrompt = null;
      }
    } else {
      console.warn("[PWA Modal] beforeinstallprompt is not active or available.");
      setIsInstalling(true);
      setStatusMessage("Solicitando instalador al navegador... Si no se inicia automáticamente, abre el menú de configuración de tu navegador y selecciona 'Instalar aplicación' o 'Agregar a la pantalla de inicio'.");
      
      // Release installation lock after 3 seconds if beforeinstallprompt is absent
      setTimeout(() => {
        setIsInstalling(false);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            id="pwa_install_modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg overflow-hidden bg-gradient-to-b from-[#091526] to-[#040b14] border border-cyan-400/30 rounded-3xl p-6 shadow-2xl text-left"
          >
            {/* Soft Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-start gap-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#113A63]/70 border border-cyan-400/30 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
                  <Download className="w-6 h-6 text-[#7EF9FF] animate-bounce" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-[#7EF9FF] border border-[#7EF9FF]/20 text-[9px] font-mono font-bold uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3 h-3 text-[#7EF9FF]" />
                    <span>Instalación Recomendada</span>
                  </div>
                  <h3 className="font-sans font-bold text-lg text-white leading-tight">Instalar M.A.P.A.™ en tu Dispositivo</h3>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer border-none outline-none"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 relative z-10">
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                Para disfrutar de una experiencia óptima y fluida en tu proceso de 7 días, te recomendamos descargar la aplicación. Al instalarla en tu pantalla de inicio, podrás acceder de manera instantánea, sin barras de navegación del navegador y con un rendimiento superior.
              </p>

              <div className="bg-[#113A63]/30 border border-cyan-400/20 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-left">
                  <p className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider">Acción rápida</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Compatible con celulares, tablets y computadoras.</p>
                </div>
                
                <button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-[#7EF9FF] to-[#00D4FF] hover:opacity-95 active:scale-98 text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-400/15 select-none border-none outline-none disabled:opacity-50"
                >
                  {isInstalling ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  ) : platformInfo.isInIframe ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : platformInfo.isMobile ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Monitor className="w-4 h-4" />
                  )}
                  <span>
                    {isInstalling ? "PROCESANDO..." : platformInfo.isInIframe ? "ABRIR EN NUEVA PESTAÑA" : "INSTALAR AHORA"}
                  </span>
                </button>
              </div>

              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 rounded-xl text-xs leading-relaxed font-sans"
                  >
                    {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white font-mono text-xs hover:underline bg-transparent border-none cursor-pointer outline-none"
                >
                  Continuar en la web por ahora
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
