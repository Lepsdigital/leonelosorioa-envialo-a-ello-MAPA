import React from "react";
import { X, ShieldAlert, FileText, Scale } from "lucide-react";

interface TermsAndPrivacyProps {
  isOpen: boolean;
  activeTab: "privacy" | "terms";
  onClose: () => void;
  onSetTab: (tab: "privacy" | "terms") => void;
}

export const TermsAndPrivacy: React.FC<TermsAndPrivacyProps> = ({
  isOpen,
  activeTab,
  onClose,
  onSetTab
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" id="terms_privacy_overlay">
      <div className="bg-[#0A2540] border border-white/10 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative text-left">
        
        {/* UPPER TITLE BAR */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-900 border border-[#7EF9FF]/20 rounded-xl text-cyan-400">
              {activeTab === "privacy" ? <FileText className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {activeTab === "privacy" ? "Política de Privacidad" : "Términos de la Experiencia"}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-semibold">M.A.P.A.™ • By Tu Poder Mental Mujer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TABS SELECTORBAR */}
        <div className="flex bg-[#07111F]/50 border-b border-white/5 p-1 px-3">
          <button
            onClick={() => onSetTab("privacy")}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all cursor-pointer ${
              activeTab === "privacy" ? "bg-[#113A63] text-[#7EF9FF] font-black" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Política de Privacidad
          </button>
          <button
            onClick={() => onSetTab("terms")}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all cursor-pointer ${
              activeTab === "terms" ? "bg-[#113A63] text-[#7EF9FF] font-black" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Términos de la Experiencia M.A.P.A.™
          </button>
        </div>

        {/* INNER SCROLLABLE CONTENT AREA */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-gray-300 font-sans leading-relaxed">
          
          {/* HIGH-CONTRAST LEGAL DISCLAIMER BANNER */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-[#FFD166] shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200 leading-normal font-medium">
              <strong>DESCARGO DE RESPONSABILIDAD MÉDICA CRÍTICO:</strong> Esta aplicación (M.A.P.A.™) NO es, ni simula ser, un diagnóstico de salud mental, informe, concepto, evaluación psiquiátrica o concepto clínico. Sus resultados son de índole puramente educativa, informativa y de autodescubrimiento lúdico. Siempre se le aconseja y recomienda a la usuaria visitar a un profesional médico calificado, terapeuta especialista o psiquiatra idóneo para cualquier consulta de salud médica o psicológica. Leps Digital no asume ninguna responsabilidad derivada del uso de este sistema.
            </p>
          </div>

          {activeTab === "privacy" ? (
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-white">1. Tratamiento y Resguardo de Datos Personales</h4>
              <p>
                En M.A.P.A.™ (parte del ecosistema By Tu Poder Mental Mujer) nos tomamos muy en serio la seguridad y el resguardo de tu privacidad. Al ingresar tu Nombre, Correo Electrónico y opcionalmente WhatsApp en el formulario de acceso, autorizas su almacenamiento temporal y el uso exclusivo para enviarte tus reportes personalizados diarios de 7 días, facilitarte recordatorios sintonizados y permitirte descargar el reporte final en PDF.
              </p>

              <h4 className="font-display font-semibold text-white">2. Seguridad de tus Respuestas</h4>
              <p>
                Las respuestas de tu Escaneo y tus diarios emocionales se analizan mediante servidores de forma agregada para calcular tus perfiles neuro-sensoriales y se almacenan temporalmente en tu propia memoria caché local y en nuestra base de datos resguardada con estrictos sistemas de cifrado. No vendemos, intercambiamos o facilitamos tus datos personales a campañas externas ni terceros comerciales.
              </p>

              <h4 className="font-display font-semibold text-white">3. Derechos de Acceso y Eliminación</h4>
              <p>
                Puedes solicitar en cualquier momento la eliminación total de tus datos personales, históricos de respuestas de 7 días y leads de contacto escribiendo de forma directa al Administrador Principal al correo electrónico oficial: <strong className="text-white">contacto@tupodermental.club</strong> o <strong className="text-white">tupodermentaloficial@gmail.com</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-white">1. Objeto y Alcance del Programa</h4>
              <p>
                El Programa M.A.P.A.™ (Mapa de Activación y Protección Emocional) es una experiencia lúdica e interactiva digital de acompañamiento que dura 7 días consecutivos. Su propósito es brindar marcos analíticos conceptuales sobre la activación del sistema nervioso simpático, la rumia mental, patrones conductuales de alerta y anclas de calma con asistencia de Inteligencia Artificial (Gemini API).
              </p>

              <h4 className="font-display font-semibold text-white">2. Ausencia de Relación Profesional / Clínica</h4>
              <p>
                Al utilizar esta herramienta, reconoces explícitamente y aceptas que **no se constituye ninguna relación médico-paciente ni atención clínica de salud de ningún tipo**. M.A.P.A.™ brinda explicaciones y recomendaciones conductuales generalizadas formuladas con IA y no constituye bajo ningún término una consulta, psicoterapia, fármaco-receta o consejería psiquiátrica clínica certificada.
              </p>

              <h4 className="font-display font-semibold text-white">3. Exclusión Total de Responsabilidad</h4>
              <p>
                La usuaria libera por completo a Leps Digital, a sus programadores, diseñadores y directores de cualquier daño, lesión, crisis emocional, decisión personal o sobre-interpretación diagnóstica que resulte del uso directo o indirecto de esta aplicación. **Si te encuentras experimentando una emergencia severa de salud o ideación crítica, busca ayuda urgente** y asiste directamente al servicio de urgencias local en tu región o comunícate con un profesional especialista licenciado de forma inmediata.
              </p>

              <h4 className="font-display font-semibold text-white">4. Propiedad Intelectual</h4>
              <p>
                Los nombres M.A.P.A.™, Tu Poder Mental Mujer™ y las metodologías analíticas asociadas pertenecen bajo estrictas licencias de marca registrada a sus titulares, y se prohíbe su copia, distribución comercial o suplantación en portales de salud sin consentimiento previo expreso del titular al email.
              </p>
            </div>
          )}

        </div>

        {/* MODAL FOOTER BAR */}
        <div className="p-4 bg-[#07111F]/50 border-t border-white/5 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#7EF9FF] hover:bg-[#00D4FF] text-slate-900 font-mono font-bold text-xs rounded-xl tracking-wider transition-all cursor-pointer"
          >
            He leído y acepto los términos
          </button>
        </div>

      </div>
    </div>
  );
};
