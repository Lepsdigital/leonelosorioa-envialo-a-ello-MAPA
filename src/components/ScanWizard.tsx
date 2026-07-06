import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, ShieldAlert, Heart, HelpCircle, ChevronRight, Compass } from "lucide-react";

interface ScanWizardProps {
  onScanComplete: (responses: { questionIndex: number, value: number, questionLabel: string }[]) => void;
  onBackToHome: () => void;
}

const SCAN_QUESTIONS = [
  {
    title: "Nivel de Activación Emocional",
    subtitle: "¿Qué tan tenso, acelerado o sobreexcitado sientes tu cuerpo actualmente?",
    pilar: "Sintomatología Fisiológica",
    icon: "🫁",
    desc: "Mide el estado autónomo simpático residual acumulado en hombros, mandíbula o latido.",
    options: [
      { value: 10, label: "Activación Extrema (Mandíbula rígida, pecho oprimido o taquicardia constante)", emoji: "🥵" },
      { value: 8, label: "Activación Alta (Hombros tensos que cuesta soltar y respiración superficial)", emoji: "⚡" },
      { value: 6, label: "Activación Moderada (Tensión sorda intermitente durante el trabajo u ocio)", emoji: "🧗" },
      { value: 4, label: "Activación Leve (Inquietud pasajera ante imprevistos concretos)", emoji: "🍃" },
      { value: 2, label: "Activación Baja (Cuerpo suelto, respiración vago-diafragmática profunda)", emoji: "🧘" }
    ]
  },
  {
    title: "Nivel de Preocupación",
    subtitle: "¿Cuánto tiempo pasas dándole vueltas a pendientes, discursos o escenarios futuros catastróficos?",
    pilar: "Patrones de Rumia",
    icon: "🔮",
    desc: "Evalúa la velocidad promedio de tu ciclo cognitivo de anticipación protectora.",
    options: [
      { value: 10, label: "Rumia Constante (Bucle infinito de proyecciones sombrías que sabotea el sueño)", emoji: "🤯" },
      { value: 8, label: "Preocupación Elevada (Ensayando conversaciones, resolviendo el mañana por horas)", emoji: "⏳" },
      { value: 6, label: "Preocupación Frecuente (El runrún está activo pero logro distraerme haciendo tareas)", emoji: "🧭" },
      { value: 4, label: "Preocupación Ocasional (Preveo el itinerario normal y dudo poco de mis decisiones)", emoji: "📝" },
      { value: 2, label: "Paz Cognitiva (Mente despejada, capaz de sumergirse en la quietud profunda)", emoji: "🎈" }
    ]
  },
  {
    title: "Nivel de Alerta Social",
    subtitle: "¿Qué tanto escaneas tu entorno buscando señales de juicio, rechazo o tensión ajena?",
    pilar: "Híper Vigilancia",
    icon: "👁️",
    desc: "Sintoniza el radar corporal de concordancia y resguardo socioemocional.",
    options: [
      { value: 10, label: "Alerta Crítica (Analizando detalladamente miradas y silencios para mediar o callar)", emoji: "🕵️" },
      { value: 8, label: "Alerta Alta (Miedo sutil a quedar en ridículo, justificación excesiva o complacencia)", emoji: "🛡️" },
      { value: 6, label: "Alerta Moderada (Comprensiva hacia emociones ajenas pero sin perder mi eje)", emoji: "👀" },
      { value: 4, label: "Alerta Ligera (Prefiero climas templados pero asumo comentarios contrarios sin sismo)", emoji: "💬" },
      { value: 2, label: "Seguridad Plena (Soberano de mi espacio social, acepto la imperfección ajena)", emoji: "🤝" }
    ]
  },
  {
    title: "Nivel de Agotamiento Vital",
    subtitle: "¿Cómo terminas tu reserva de energía física, cerebral y anímica al finalizar la jornada?",
    pilar: "Desgaste Simpático",
    icon: "🎒",
    desc: "Cuantifica el costo residual metabólico de cargar escudos protectores todo el día.",
    options: [
      { value: 10, label: "Cerebro Frito (Agotamiento crónico severo, insomnio de cansancio o vacío total)", emoji: "📴" },
      { value: 8, label: "Fatiga Elevada (Siento que arrastro un peso constante en hombros y espalda)", emoji: "🥱" },
      { value: 6, label: "Saturación Media (Manejo el cansancio diario pero necesito desconexión urgente nocturna)", emoji: "📉" },
      { value: 4, label: "Descarga Normal (Cansancio fisiológico reparador que se alivia durmiendo bien)", emoji: "🛌" },
      { value: 2, label: "Energía Vibrante (Despierto ligero y mantengo el enfoque dinámico sin bajones)", emoji: "🔋" }
    ]
  },
  {
    title: "Nivel de Claridad Emocional",
    subtitle: "¿Qué tan rápido identificas qué emoción sientes en el cuerpo y cuál es el gatillo real?",
    pilar: "Autoconocimiento",
    icon: "🧠",
    desc: "Mapea tu nivel de sintonización y vocabulario emocional integrativo.",
    options: [
      { value: 10, label: "Claridad Luminosa (Nombro mi estado exacto de inmediato y asimilo su aviso)", emoji: "💡" },
      { value: 8, label: "Entendimiento Bueno (Siento el cambio biológico y encuentro el porqué al reflexionar)", emoji: "🔍" },
      { value: 6, label: "Percepción Difusa (Sé que me siento congestionada emocionalmente pero me cuesta calificarlo)", emoji: "🌫️" },
      { value: 4, label: "Desconexión Ligera (Me entero al explotar en llanto o enojo impulsivo posterior)", emoji: "🤐" },
      { value: 2, label: "Anestesia Completa (Incapaz de leer latidos, me entero días después por dolores físicos)", emoji: "😶" }
    ]
  },
  {
    title: "Nivel de Regulación",
    subtitle: "Ante una ola de agobio, estrés o pánico, ¿qué tanta herramienta posees para re-calibrar?",
    pilar: "Mecanismos de Calma",
    icon: "⚖️",
    desc: "Evalúa tus interruptores autónomos de freno parasimpático o reestructuración.",
    options: [
      { value: 10, label: "Control Zen (Medito, respiro 4-7-8 o estabilizo mis músculos con plena autogestión)", emoji: "🧘" },
      { value: 8, label: "Regulación Buena (Escribo mis notas, hablo con mi puerto seguro y calmo el pico)", emoji: "✍️" },
      { value: 6, label: "Estabilización Parcial (Necesito ducharme, ordenar intensamente o aislarme del todo)", emoji: "🧼" },
      { value: 4, label: "Regulación Baja (La ola me arrastra, rumiando por horas antes de apagarme)", emoji: "🌪️" },
      { value: 2, label: "Sin Herramientas (La tormenta me paraliza o deprime, tomándome días recuperarme)", emoji: "⚠️" }
    ]
  },
  {
    title: "Nivel de Bienestar Percibido",
    subtitle: "¿Cómo describirías tu nivel general de paz mental, esperanza y asertividad actual?",
    pilar: "Bienestar General",
    icon: "🕯️",
    desc: "Prescribe la salud mental integrada y tu nivel percibido de recursos personales.",
    options: [
      { value: 10, label: "Bienestar Pleno (Conectada, con esperanza viva y asumiendo desafíos con dulzura)", emoji: "🌟" },
      { value: 8, label: "Armonía Buena (Estable con días bellos, entiendo mis límites sanamente)", emoji: "🍃" },
      { value: 6, label: "Supervivencia Estable (Viviendo en automático, sorteando baches pero sin gozar)", emoji: "⚙️" },
      { value: 4, label: "Paz Deteriorada (El ruido de fondo diario opaca mis pasiones e ilusiones)", emoji: "🌧️" },
      { value: 2, label: "Agobio Permanente (Siento que asisto pasivamente al desborde y fatiga vital)", emoji: "🥀" }
    ]
  }
];

export const ScanWizard: React.FC<ScanWizardProps> = ({ onScanComplete, onBackToHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionIndex: number; value: number; questionLabel: string }[]>([]);

  const currentQ = SCAN_QUESTIONS[currentIndex];

  const handleSelectOption = (value: number, label: string) => {
    const updated = [...answers];
    const existingIdx = updated.findIndex((a) => a.questionIndex === currentIndex);

    if (existingIdx > -1) {
      updated[existingIdx] = { questionIndex: currentIndex, value, questionLabel: label };
    } else {
      updated.push({ questionIndex: currentIndex, value, questionLabel: label });
    }

    setAnswers(updated);

    // Auto-advance with micro-delay for delight
    setTimeout(() => {
      if (currentIndex < SCAN_QUESTIONS.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onScanComplete(updated);
      }
    }, 450);
  };

  const handleGoBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onBackToHome();
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / SCAN_QUESTIONS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 px-2" id="scan_stepper_element">
      {/* Upper Tracker and Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#36C4D8] animate-ping inline-block shrink-0" />
            <span className="text-[10px] font-mono uppercase bg-[#EDE0F0] text-[#6E488A] px-2.5 py-1 rounded-md font-bold tracking-wider">
              {currentQ.pilar}
            </span>
          </div>
          <span className="text-xs font-mono text-[#56346F] font-semibold uppercase">
            Escaneo {currentIndex + 1} de 7
          </span>
        </div>

        {/* Customized Progress Track */}
        <div className="w-full bg-[#EDE0F0]/50 h-3 rounded-full overflow-hidden border border-[#6E488A]/10 relative shadow-inner">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="h-full bg-[#36C4D8]"
          />
        </div>
      </div>

      {/* Main Question Card Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -25 }}
          transition={{ duration: 0.35 }}
          className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative text-left"
        >
          {/* Subtle background flow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F58BC8]/8 rounded-full blur-3xl pointer-events-none" />

          {/* Core Branding Icon & Topic Title */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center space-x-3.5">
              <span className="text-[2.2rem] shrink-0">{currentQ.icon}</span>
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#6E488A] tracking-tight">
                  {currentQ.title}
                </h3>
                <span className="text-[10px] font-mono text-[#E36DB4] tracking-widest font-bold block uppercase mt-0.5">
                  ESCANEAR FACTOR
                </span>
              </div>
            </div>

            <p className="text-base text-[#56346F] pt-3 leading-relaxed font-sans font-medium">
              {currentQ.subtitle}
            </p>
            <p className="text-xs text-[#56346F]/80 italic font-sans font-light">
              💡 {currentQ.desc}
            </p>
          </div>

          {/* Interactive Options list */}
          <div className="space-y-3 pt-3 relative z-10">
            {currentQ.options.map((opt) => {
              const prevSel = answers.find(a => a.questionIndex === currentIndex);
              const isSelected = prevSel?.value === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelectOption(opt.value, opt.label)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-250 cursor-pointer ${
                    isSelected
                      ? "bg-[#36C4D8]/10 border-[#36C4D8] shadow-[0_4px_15px_rgba(54,196,216,0.15)] scale-[1.01]"
                      : "bg-white/80 border-[#6E488A]/10 hover:border-[#6E488A]/25 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3 w-[90%]">
                    <span className="text-xl sm:text-2xl bg-[#EDE0F0]/50 p-1.5 rounded-xl shrink-0">
                      {opt.emoji}
                    </span>
                    <span className={`text-xs sm:text-sm leading-snug font-semibold font-sans ${
                      isSelected ? "text-[#6E488A]" : "text-[#56346F]"
                    }`}>
                      {opt.label}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? "translate-x-1 text-[#36C4D8]" : "text-gray-400"
                  }`} />
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Operational Back Stepper Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleGoBack}
          className="px-5 py-2.5 rounded-xl bg-transparent border border-[#6E488A]/20 text-xs sm:text-sm font-semibold text-[#6E488A] hover:bg-[#EDE0F0]/50 hover:border-[#6E488A]/40 transition-all cursor-pointer"
        >
          ← {currentIndex === 0 ? "Cancelar Escaneo" : "Volver"}
        </button>

        <p className="text-[10px] font-mono text-[#56346F]/60 max-w-[150px] text-right">
          M.A.P.A.™ Escaneo de Activación y Alerta
        </p>
      </div>
    </div>
  );
};
