import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Smartphone, Monitor, X, Check, Loader2, Sparkles, ExternalLink, ArrowRight, Share } from "lucide-react";

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallSuccess: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose, onInstallSuccess }) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [platformInfo, setPlatformInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isInIframe: false,
  });

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isMobile = isIOS || isAndroid || /webos|blackberry|iemobile|opera mini/.test(ua);
    const isInIframe = window.self !== window.top;

    setPlatformInfo({ isIOS, isAndroid, isMobile, isInIframe });

    // If it's iOS or inside iframe, we naturally need guides or special buttons
    if (isIOS) {
      setShowManualGuide(true);
    }
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

    // 2. iOS Safari manual guide toggler
    if (platformInfo.isIOS) {
      setShowManualGuide(true);
      return;
    }

    // 3. Native install prompt execution
    const currentPrompt = (window as any).deferredPrompt || (window.parent as any)?.deferredPrompt;
    if (currentPrompt) {
      setIsInstalling(true);
      
      const safetyTimeout = setTimeout(() => {
        console.warn("[PWA Modal] Installation prompt choice timed out.");
        setIsInstalling(false);
        setStatusMessage("La solicitud tardó más de lo esperado. Si no viste el cuadro de diálogo, puedes instalar manualmente desde el menú de tu navegador.");
      }, 4000);

      try {
        console.log("[PWA Modal] Launching browser native prompt...");
        await currentPrompt.prompt();

        const choiceResult = await currentPrompt.userChoice;
        clearTimeout(safetyTimeout);

        console.log(`[PWA Modal] User installation choice: ${choiceResult.outcome}`);
        
        if (choiceResult.outcome === "accepted") {
          console.log("[PWA Modal] Native installation accepted.");
          onInstallSuccess();
        } else {
          console.log("[PWA Modal] Native installation dismissed.");
          setStatusMessage("Instalación cancelada. Puedes instalarla cuando desees desde el menú del navegador.");
          setTimeout(() => setStatusMessage(null), 4000);
        }
      } catch (err: any) {
        clearTimeout(safetyTimeout);
        console.error("[PWA Modal] Error displaying installation prompt:", err);
        setShowManualGuide(true);
      } finally {
        setIsInstalling(false);
        (window as any).deferredPrompt = null;
      }
    } else {
      console.warn("[PWA Modal] deferredPrompt is not available. Showing manual guide.");
      setShowManualGuide(true);
    }
  };

  const handleForceConfirmDownloaded = () => {
    // Let the user manually declare that they have already installed the app
    // or want to stop seeing the prompt.
    onInstallSuccess();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <motion.div
            id="pwa_install_modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-xl my-8 overflow-hidden bg-gradient-to-b from-[#0a172c] to-[#040c16] border border-cyan-400/30 rounded-3xl p-6 shadow-2xl text-left"
          >
            {/* Ambient visual background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start gap-4 relative z-10 border-b border-white/5 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-[#113a63]/80 border border-cyan-400/30 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
                  <Download className="w-6 h-6 text-[#7EF9FF] animate-pulse" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-[#7EF9FF] border border-[#7EF9FF]/20 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 text-[#7EF9FF]" />
                    <span>Experiencia Recomendada</span>
                  </div>
                  <h3 className="font-sans font-extrabold text-xl text-white leading-tight">
                    Descargar M.A.P.A.™ en tu Celular
                  </h3>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer border-none outline-none"
                title="Cerrar"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="mt-4 space-y-4 relative z-10">
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                Para garantizar que puedas realizar el **seguimiento diario de tus 7 días** de forma ininterrumpida, te sugerimos descargar el acceso directo en tu dispositivo. Es ligero, funciona de forma offline, y te permite ingresar a tu cuenta de inmediato.
              </p>

              {/* Conditional Layouts based on environment and platforms */}
              {platformInfo.isInIframe && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                  <p className="text-xs text-amber-200 font-sans leading-relaxed">
                    ⚠️ **Nota sobre el visor:** Te encuentras en el visor de pruebas. Para realizar la instalación nativa de la aplicación en tu celular o computadora, debes abrirla en una pestaña normal de tu navegador.
                  </p>
                  <button
                    onClick={() => {
                      window.open("https://mapa-dun.vercel.app", "_blank");
                    }}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border-none"
                  >
                    <span>Abrir en Pestaña Independiente</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* The installation triggers */}
              {!platformInfo.isInIframe && (
                <div className="space-y-4">
                  {/* Default Call to Action Button */}
                  {!showManualGuide && (
                    <div className="bg-[#113A63]/30 border border-cyan-400/20 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-left">
                        <p className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">Instalación Rápida</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">La aplicación se descargará de manera instantánea y nativa en tu dispositivo.</p>
                      </div>
                      
                      <button
                        onClick={handleInstallClick}
                        disabled={isInstalling}
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7EF9FF] to-[#00D4FF] hover:opacity-95 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-cyan-400/20"
                      >
                        {isInstalling ? (
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        ) : (
                          <Smartphone className="w-4 h-4" />
                        )}
                        <span>{isInstalling ? "PROCESANDO..." : "DESCARGAR AHORA"}</span>
                      </button>
                    </div>
                  )}

                  {/* Manual / iOS Safari / Generic Fallback Guides */}
                  {showManualGuide && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-slate-900/80 border border-cyan-400/20 rounded-2xl space-y-3.5"
                    >
                      <h4 className="text-xs font-extrabold text-[#7EF9FF] uppercase tracking-wider font-sans flex items-center space-x-2">
                        <span>Guía de Instalación para tu Dispositivo</span>
                      </h4>

                      {platformInfo.isIOS ? (
                        // iOS Safari manual visual steps
                        <div className="space-y-3 text-xs text-gray-300 font-sans">
                          <p className="text-[11px] text-cyan-300 font-medium">Sigue estos sencillos pasos desde Safari en tu iPhone o iPad:</p>
                          <div className="space-y-2.5">
                            <div className="flex items-start space-x-3 bg-white/5 p-2 rounded-xl">
                              <div className="w-5 h-5 rounded-full bg-[#113a63] border border-cyan-400/30 text-[11px] text-[#7EF9FF] font-mono flex items-center justify-center shrink-0 font-bold">1</div>
                              <p className="leading-relaxed">
                                Toca el icono de <strong>Compartir (Share)</strong> en Safari: Busca el botón con forma de caja y flecha hacia arriba <span className="inline-flex items-center px-1.5 py-0.5 bg-white/10 rounded text-white"><Share className="w-3 h-3 text-cyan-300" /></span> (abajo en iPhone o arriba en iPad).
                              </p>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/5 p-2 rounded-xl">
                              <div className="w-5 h-5 rounded-full bg-[#113a63] border border-cyan-400/30 text-[11px] text-[#7EF9FF] font-mono flex items-center justify-center shrink-0 font-bold">2</div>
                              <p className="leading-relaxed">
                                Desplázate hacia abajo en el menú de opciones y selecciona <strong>"Añadir a pantalla de inicio"</strong> <span className="inline-block font-bold text-cyan-300 text-sm">➕</span>.
                              </p>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/5 p-2 rounded-xl">
                              <div className="w-5 h-5 rounded-full bg-[#113a63] border border-cyan-400/30 text-[11px] text-[#7EF9FF] font-mono flex items-center justify-center shrink-0 font-bold">3</div>
                              <p className="leading-relaxed">
                                En la esquina superior derecha, toca <strong>"Añadir"</strong> para finalizar. ¡Y listo! Ya tendrás M.A.P.A.™ como app móvil.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Android Chrome / Standard manual steps
                        <div className="space-y-3 text-xs text-gray-300 font-sans">
                          <p className="text-[11px] text-cyan-300 font-medium">Sigue estos pasos rápidos en tu navegador:</p>
                          <div className="space-y-2.5">
                            <div className="flex items-start space-x-3 bg-white/5 p-2 rounded-xl">
                              <div className="w-5 h-5 rounded-full bg-[#113a63] border border-cyan-400/30 text-[11px] text-[#7EF9FF] font-mono flex items-center justify-center shrink-0 font-bold">1</div>
                              <p className="leading-relaxed">
                                Toca los <strong>tres puntos de opciones (⋮)</strong> en la esquina superior derecha de tu navegador actual.
                              </p>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/5 p-2 rounded-xl">
                              <div className="w-5 h-5 rounded-full bg-[#113a63] border border-cyan-400/30 text-[11px] text-[#7EF9FF] font-mono flex items-center justify-center shrink-0 font-bold">2</div>
                              <p className="leading-relaxed">
                                Selecciona la opción que dice <strong>"Instalar aplicación"</strong> o bien <strong>"Añadir a pantalla de inicio"</strong>.
                              </p>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/5 p-2 rounded-xl">
                              <div className="w-5 h-5 rounded-full bg-[#113a63] border border-cyan-400/30 text-[11px] text-[#7EF9FF] font-mono flex items-center justify-center shrink-0 font-bold">3</div>
                              <p className="leading-relaxed">
                                Confirma la acción para completar la descarga. Tendrás el icono directo en tu escritorio.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Status information messages */}
              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 rounded-xl text-xs leading-relaxed font-sans font-medium"
                  >
                    {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Control Options (Skip / Manual confirmation) */}
              <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  onClick={handleForceConfirmDownloaded}
                  className="w-full sm:w-auto text-[11px] text-[#7EF9FF] hover:underline bg-transparent border-none cursor-pointer outline-none font-mono py-1"
                >
                  Ya tengo descargada la App / No volver a mostrar
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs transition-colors cursor-pointer border-none outline-none text-center"
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
