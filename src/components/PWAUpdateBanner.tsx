import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Sparkles, X } from "lucide-react";

interface PWAUpdateBannerProps {
  isVisible: boolean;
  onApplyUpdate: () => void;
  onDismiss: () => void;
}

export const PWAUpdateBanner: React.FC<PWAUpdateBannerProps> = ({
  isVisible,
  onApplyUpdate,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="pwa_update_banner"
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-lg bg-gradient-to-r from-[#07111F]/90 via-[#0D1F38]/95 to-[#07111F]/90 border-2 border-[#36C4D8]/45 rounded-3xl p-5 shadow-2xl shadow-[#36C4D8]/20 backdrop-blur-xl text-left"
        >
          {/* Top glowing bar */}
          <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[#36C4D8] to-transparent opacity-75" />

          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E36DB4] to-[#6E488A] flex items-center justify-center shrink-0 shadow-lg shadow-[#E36DB4]/20 overflow-hidden">
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
                <RefreshCw className="w-6 h-6 text-white animate-spin" style={{ animationDuration: "4s" }} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#36C4D8] font-mono">
                    Nueva Versión Disponible
                  </span>
                  <Sparkles className="w-3 h-3 text-[#E36DB4]" />
                </div>
                <h4 className="font-display font-black text-sm text-white">
                  Actualización de M.A.P.A.™ Mujer
                </h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Hay una actualización disponible para M.A.P.A. ¿Deseas actualizar la aplicación ahora?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
              <button
                id="pwa_update_apply_btn"
                onClick={onApplyUpdate}
                className="flex-1 sm:flex-initial py-2.5 px-5 bg-[#36C4D8] hover:bg-[#2DB3C7] text-white font-display font-black text-xs rounded-xl tracking-wider hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer shadow-md shadow-[#36C4D8]/20 border-none outline-none"
              >
                ACTUALIZAR
              </button>
              <button
                id="pwa_update_dismiss_btn"
                onClick={onDismiss}
                className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Descartar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
