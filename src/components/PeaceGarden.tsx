import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Sparkles, 
  Heart, 
  RefreshCw, 
  Info,
  Check,
  ChevronRight,
  Smile,
  Clock,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SoundPreset {
  id: string;
  name: string;
  frequency: number;
  type: OscillatorType;
  description: string;
  color: string;
  benefit: string;
}

const SOUND_PRESETS: SoundPreset[] = [
  {
    id: "528hz",
    name: "Frecuencia Solfeggio (528 Hz)",
    frequency: 528,
    type: "sine",
    description: "Conocida como la frecuencia de la paz y el equilibrio. Ideal para calmar estados agudos de alerta y regular el pulso corporal.",
    color: "from-[#36C4D8]/10 to-[#36C4D8]/5 border-[#36C4D8] text-[#36C4D8]",
    benefit: "Reparación emocional y reducción de cortisol."
  },
  {
    id: "432hz",
    name: "Tono Meditativo (432 Hz)",
    frequency: 432,
    type: "sine",
    description: "Sintonizado con los ritmos de la naturaleza. Genera una resonancia armónica en el cerebro que alivia el cansancio cognitivo.",
    color: "from-[#E36DB4]/10 to-[#E36DB4]/5 border-[#E36DB4] text-[#E36DB4]",
    benefit: "Disminución de la rumia y tensión física."
  },
  {
    id: "cosmic",
    name: "Resonancia Somática (136 Hz)",
    frequency: 136.1,
    type: "triangle",
    description: "Una vibración profunda y cálida inspirada en las frecuencias de la tierra. Actúa directamente sobre el sistema nervioso parasimpático.",
    color: "from-[#6E488A]/10 to-[#6E488A]/5 border-[#6E488A] text-[#6E488A]",
    benefit: "Estimulación vagal suave y anclaje."
  }
];

const SOOTHING_AFFIRMATIONS = [
  "No tengo que resolver todo en este momento. Está bien simplemente respirar y estar aquí.",
  "Mi sistema nervioso está buscando la calma y yo le permito descansar.",
  "Las sensaciones físicas incómodas van a pasar. Estoy a salvo y protegido en este espacio.",
  "Soy mucho más que mis pensamientos de preocupación. Soy el espacio tranquilo que los observa.",
  "Doy un paso atrás y permito que mi cuerpo libere la tensión acumulada a su propio ritmo.",
  "Inhalo paz, exhalo el peso del control. Todo está bien en este instante.",
  "Honro mis emociones sin juzgarlas. Sentir cansancio o angustia es parte de mi proceso humano.",
  "Mi mente puede calmarse. Elijo tratarme con absoluta ternura, paciencia y suavidad hoy.",
  "Abrazo mi presente tal como es, sabiendo que la calma se construye paso a paso."
];

interface PeaceGardenProps {
  userName?: string;
}

const getPersonalizedAffirmations = (name: string) => [
  `Querida ${name}, no tienes que resolver todo en este momento. Está bien simplemente respirar y estar aquí.`,
  `${name}, tu sistema nervioso está buscando la calma y tú le permites descansar con amor.`,
  `Las sensaciones físicas incómodas van a pasar, ${name}. Estás a salvo y protegida en este espacio.`,
  `${name}, eres mucho más que tus pensamientos de preocupación. Eres el espacio tranquilo que los observa.`,
  `Da un paso atrás, ${name}, y permite que tu cuerpo libere la tensión acumulada a su propio ritmo.`,
  `Inhala paz, exhala el peso del control, ${name}. Todo está bien en este instante para ti.`,
  `Honra tus emociones sin juzgarlas, ${name}. Sentir cansancio o angustia es parte de tu valioso proceso humano.`,
  `Tu mente puede calmarse, ${name}. Elige tratarte con absoluta ternura, paciencia y suavidad hoy.`,
  `Abraza tu presente tal como es, ${name}, sabiendo que tu calma se construye paso a paso con cada respiración.`
];

export const PeaceGarden: React.FC<PeaceGardenProps> = ({ userName }) => {
  // Web Audio state
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [playingPreset, setPlayingPreset] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.3); // 0 to 1

  // Breathing Guide state
  const [breathMode, setBreathMode] = useState<"4-4-4" | "4-7-8" | "5-5">("5-5");
  const [breathPhase, setBreathPhase] = useState<"IN" | "HOLD" | "OUT" | "HOLD_OUT">("IN");
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  // Affirmations state
  const [activeAffirmation, setActiveAffirmation] = useState<string>(
    userName ? getPersonalizedAffirmations(userName)[0] : SOOTHING_AFFIRMATIONS[0]
  );
  const [savedAnchor, setSavedAnchor] = useState<string>(
    localStorage.getItem("MAPA_PEACE_ANCHOR") || (userName ? `Querida ${userName}, elijo perdonar mi cansancio y descansar en paz.` : "La calma es mi estado natural y tengo el derecho de descansar.")
  );
  const [anchorInput, setAnchorInput] = useState<string>("");
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (userName) {
      const list = getPersonalizedAffirmations(userName);
      setActiveAffirmation(list[0]);
      setSavedAnchor(localStorage.getItem("MAPA_PEACE_ANCHOR") || `Querida ${userName}, elijo perdonar mi cansancio y descansar en paz.`);
    }
  }, [userName]);

  // Initialize Audio Context on demand
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Sound play control
  const toggleSoundPreset = (preset: SoundPreset) => {
    try {
      initAudio();
      
      // If already playing this preset, stop it
      if (playingPreset === preset.id) {
        stopSound();
        return;
      }

      // Stop any other active oscillator
      stopSound();

      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = preset.type;
      osc.frequency.setValueAtTime(preset.frequency, ctx.currentTime);
      
      // Soft start to avoid clicks
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.15, ctx.currentTime + 0.1); // Keep it subtle and soft

      // Beautiful lowpass filter to make it sound incredibly cozy, deep and gentle
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(preset.type === "triangle" ? 300 : 800, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gainNode;
      setPlayingPreset(preset.id);
    } catch (err) {
      console.error("No se pudo iniciar el sintetizador de audio:", err);
    }
  };

  const stopSound = () => {
    if (oscillatorRef.current && gainNodeRef.current && audioCtxRef.current) {
      try {
        const currTime = audioCtxRef.current.currentTime;
        // Fade out to avoid pop clicks
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, currTime + 0.15);
        
        const osc = oscillatorRef.current;
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        }, 200);
      } catch (err) {}
      oscillatorRef.current = null;
      gainNodeRef.current = null;
    }
    setPlayingPreset(null);
  };

  // Live volume slider update
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.15, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {}
      }
    };
  }, []);

  // Breathing timing logic
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (breathMode === "5-5") {
            if (breathPhase === "IN") {
              setBreathPhase("OUT");
              return 5;
            } else {
              setBreathPhase("IN");
              setCompletedCycles(c => c + 1);
              return 5;
            }
          } else if (breathMode === "4-4-4") {
            if (breathPhase === "IN") {
              setBreathPhase("HOLD");
              return 4;
            } else if (breathPhase === "HOLD") {
              setBreathPhase("OUT");
              return 4;
            } else {
              setBreathPhase("IN");
              setCompletedCycles(c => c + 1);
              return 4;
            }
          } else { // 4-7-8 Deep relaxation
            if (breathPhase === "IN") {
              setBreathPhase("HOLD");
              return 7;
            } else if (breathPhase === "HOLD") {
              setBreathPhase("OUT");
              return 8;
            } else {
              setBreathPhase("IN");
              setCompletedCycles(c => c + 1);
              return 4;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive, breathPhase, breathMode]);

  // Reset breathing when switching mode
  const handleModeChange = (mode: "4-4-4" | "4-7-8" | "5-5") => {
    setBreathMode(mode);
    setBreathPhase("IN");
    setSecondsLeft(mode === "5-5" ? 5 : 4);
    setCompletedCycles(0);
  };

  // Generate random affirmation
  const handleRandomAffirmation = () => {
    const list = userName ? getPersonalizedAffirmations(userName) : SOOTHING_AFFIRMATIONS;
    let nextIdx = Math.floor(Math.random() * list.length);
    while (list[nextIdx] === activeAffirmation) {
      nextIdx = Math.floor(Math.random() * list.length);
    }
    setActiveAffirmation(list[nextIdx]);
  };

  // Save anchor
  const handleSaveAnchor = (text: string) => {
    if (!text.trim()) return;
    localStorage.setItem("MAPA_PEACE_ANCHOR", text);
    setSavedAnchor(text);
    setAnchorInput("");
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#56346F]">
      
      {/* Upper tranquil explanation card */}
      <div className="bg-[#EDE0F0]/50 border border-[#6E488A]/15 p-6 rounded-2xl flex gap-5 text-sm shadow-sm text-left">
        <div className="w-12 h-12 rounded-full bg-[#E36DB4]/10 border border-[#E36DB4]/20 flex items-center justify-center shrink-0">
          <Heart className="w-6 h-6 text-[#E36DB4] fill-[#E36DB4]/15 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h4 className="font-display font-black text-base text-[#6E488A] uppercase tracking-wider">
            JARDÍN DE RESPIRACIÓN Y FRECUENCIAS TERAPÉUTICAS
          </h4>
          <p className="text-[#56346F]/80 leading-relaxed text-sm font-medium">
            Te damos la bienvenida, <strong className="text-[#6E488A] font-extrabold">{userName || "amiga"}</strong>, a tu espacio seguro de calma incondicional. Aquí no hay evaluaciones, diagnósticos ni presiones de rendimiento. Diseñamos este módulo interactivo exclusivamente para ti, para ayudarte a regular la alarma de tu cuerpo, liberar la tensión de la amígdala cerebral y anclar tu atención en el presente mediante sonidos puros y respiraciones somáticas, sintiéndote siempre escuchada y cuidada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: GUIDED BREATHING FLOWER (Col span 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[#6E488A]/15 shadow-sm flex flex-col justify-between space-y-8 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#36C4D8] uppercase tracking-widest font-bold block">RELAJACIÓN CARDIO-RESPIRATORIA</span>
            <h3 className="font-display font-black text-2xl text-[#6E488A]">La Guía de Respiración Somática</h3>
            <p className="text-sm text-[#56346F]/80 font-medium font-sans">Sincroniza tu respiración con la flor geométrica para reducir la respuesta vagal simpática en segundos.</p>
          </div>

          {/* Breathing Modes Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={() => handleModeChange("5-5")}
              className={`px-3 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 text-center cursor-pointer ${
                breathMode === "5-5"
                  ? "bg-[#EDE0F0]/50 border border-[#E36DB4] text-[#E36DB4] shadow-sm"
                  : "bg-[#FAF7F9] hover:bg-[#EDE0F0]/35 text-[#56346F]/80 border border-[#6E488A]/10"
              }`}
            >
              <div className="font-black text-xs sm:text-sm">Equitativa (5s)</div>
              <div className="text-[9px] sm:text-[10px] opacity-90 mt-0.5 font-bold">Armonía y Enfoque</div>
            </button>
            <button
              onClick={() => handleModeChange("4-4-4")}
              className={`px-3 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 text-center cursor-pointer ${
                breathMode === "4-4-4"
                  ? "bg-[#EDE0F0]/50 border border-[#36C4D8] text-[#36C4D8] shadow-sm"
                  : "bg-[#FAF7F9] hover:bg-[#EDE0F0]/35 text-[#56346F]/80 border border-[#6E488A]/10"
              }`}
            >
              <div className="font-black text-xs sm:text-sm">Caja (4s)</div>
              <div className="text-[9px] sm:text-[10px] opacity-90 mt-0.5 font-bold">Estabilidad Mental</div>
            </button>
            <button
              onClick={() => handleModeChange("4-7-8")}
              className={`px-3 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 text-center cursor-pointer ${
                breathMode === "4-7-8"
                  ? "bg-[#EDE0F0]/50 border border-[#6E488A] text-[#6E488A] shadow-sm"
                  : "bg-[#FAF7F9] hover:bg-[#EDE0F0]/35 text-[#56346F]/80 border border-[#6E488A]/10"
              }`}
            >
              <div className="font-black text-xs sm:text-sm">Grave 4-7-8</div>
              <div className="text-[9px] sm:text-[10px] opacity-90 mt-0.5 font-bold">Calma la Ansiedad</div>
            </button>
          </div>

          {/* Core Interactive Breathing Visualizer */}
          <div className="h-72 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#FAF7F9] to-[#EDE0F0]/35 rounded-2xl border border-[#6E488A]/15 p-6 overflow-hidden shadow-inner">
            
            {/* Background floating peaceful particles */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <span className="absolute top-1/4 left-1/4 w-2.5 h-2.5 rounded-full bg-[#36C4D8] animate-pulse" />
              <span className="absolute top-1/3 right-1/4 w-3.5 h-3.5 rounded-full bg-[#E36DB4] animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="absolute bottom-1/4 left-1/2 w-2 h-2 rounded-full bg-[#6E488A] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Pulsing Breathing Flower Circle Wrapper */}
            <div className="relative flex items-center justify-center w-48 h-48">
              
              {/* Outer pulsing ring matching the exact scale */}
              <motion.div
                animate={{
                  scale: !breathingActive 
                    ? 1 
                    : breathPhase === "IN" 
                    ? 1.55
                    : breathPhase === "HOLD" 
                    ? 1.55
                    : 1
                }}
                transition={{
                  duration: secondsLeft,
                  ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-full border opacity-30 ${
                  breathPhase === "IN" ? "bg-[#36C4D8]/10 border-[#36C4D8]" :
                  breathPhase === "HOLD" ? "bg-[#E36DB4]/10 border-[#E36DB4]" :
                  "bg-[#6E488A]/10 border-[#6E488A]"
                }`}
              />

              {/* Second ring */}
              <motion.div
                animate={{
                  scale: !breathingActive 
                    ? 1 
                    : breathPhase === "IN" 
                    ? 1.3
                    : breathPhase === "HOLD" 
                    ? 1.3
                    : 1
                }}
                transition={{
                  duration: secondsLeft,
                  ease: "easeInOut"
                }}
                className={`absolute w-38 h-38 rounded-full border opacity-40 ${
                  breathPhase === "IN" ? "bg-[#36C4D8]/10 border-[#36C4D8]" :
                  breathPhase === "HOLD" ? "bg-[#E36DB4]/10 border-[#E36DB4]" :
                  "bg-[#6E488A]/10 border-[#6E488A]"
                }`}
              />

              {/* Core Breathing Node with Phase Label */}
              <motion.div
                animate={{
                  scale: !breathingActive 
                    ? 1 
                    : breathPhase === "IN" 
                    ? 1.15
                    : breathPhase === "HOLD" 
                    ? 1.15
                    : 0.85
                }}
                transition={{
                  duration: secondsLeft,
                  ease: "easeInOut"
                }}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-md relative z-10 transition-colors duration-500 text-center ${
                  !breathingActive
                    ? "bg-[#FAF7F9] border border-[#6E488A]/20 text-[#56346F]"
                    : breathPhase === "IN"
                    ? "bg-[#36C4D8] text-white border border-[#36C4D8] shadow-lg shadow-[#36C4D8]/20"
                    : breathPhase === "HOLD"
                    ? "bg-[#E36DB4] text-white border border-[#E36DB4] shadow-lg shadow-[#E36DB4]/20"
                    : "bg-[#6E488A] text-white border border-[#6E488A] shadow-lg shadow-[#6E488A]/20"
                }`}
              >
                <span className="text-xs font-mono tracking-widest uppercase opacity-95 block font-black">
                  {!breathingActive ? "Pausa" : 
                   breathPhase === "IN" ? "Inhala" :
                   breathPhase === "HOLD" ? "Retén" : "Exhala"}
                </span>
                <span className="text-4xl md:text-5xl font-display font-black block leading-none mt-1">
                  {!breathingActive ? "🌿" : secondsLeft}
                </span>
                <span className="text-[10px] opacity-95 block mt-1 font-mono font-bold">segundos</span>
              </motion.div>
            </div>

            {/* Instruction Banner text */}
            <div className="mt-5 text-center z-15">
              <p className="text-base font-extrabold text-[#6E488A]">
                {!breathingActive ? "Haz clic abajo para iniciar tu ciclo regulador" :
                 breathPhase === "IN" ? "Lleva el aire suavemente al abdomen..." :
                 breathPhase === "HOLD" ? "Conserva el aire con el cuerpo relajado..." :
                 "Suelta todo el aire como un suspiro liberador..."}
              </p>
              {breathingActive && (
                <p className="text-xs font-mono text-[#36C4D8] font-bold mt-1 uppercase tracking-widest">
                  Ciclos Completados: {completedCycles}
                </p>
              )}
            </div>

          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => setBreathingActive(!breathingActive)}
              className={`w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                breathingActive
                  ? "bg-red-600 text-white hover:bg-red-500 shadow-md"
                  : "bg-gradient-to-r from-[#6E488A] to-[#E36DB4] text-white hover:opacity-90 shadow-md"
              }`}
            >
              {breathingActive ? (
                <>
                  <Square className="w-5 h-5 fill-current" />
                  <span>Detener Ciclo</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current animate-pulse" />
                  <span>Iniciar Respiración</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setCompletedCycles(0);
                setBreathPhase("IN");
                setSecondsLeft(breathMode === "5-5" ? 5 : 4);
              }}
              disabled={!breathingActive}
              className="w-full sm:w-auto px-5 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm border border-[#6E488A]/20 text-[#56346F]/80 hover:text-[#56346F] bg-[#FAF7F9] hover:bg-[#EDE0F0]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-1.5 font-bold shadow-sm"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Reiniciar Contador</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: HEALING SOUND PRESETS & AFFIRMATIONS (Col span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Soundscapes Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#6E488A]/15 shadow-sm space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#36C4D8] uppercase tracking-widest font-bold block">SONIDOS SOMÁTICOS</span>
              <h3 className="font-display font-black text-2xl text-[#6E488A] block">Generador de Climas</h3>
              <p className="text-sm text-[#56346F]/80 font-medium font-sans block">Estimula tu nervio vago con frecuencias puras sintetizadas en tiempo real en tu navegador.</p>
            </div>

            {/* Preset Cards list */}
            <div className="space-y-3.5">
              {SOUND_PRESETS.map((preset) => {
                const isActive = playingPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between gap-3 relative overflow-hidden ${
                      isActive 
                        ? `bg-gradient-to-tr ${preset.color} shadow-sm border-current`
                        : "bg-[#FAF7F9] hover:bg-[#EDE0F0]/20 border-[#6E488A]/10 text-[#56346F]"
                    }`}
                  >
                    {/* Pulsing overlay for playing track */}
                    {isActive && (
                      <div className="absolute top-0 right-0 w-32 h-full bg-radial-gradient from-teal-500/20 to-transparent opacity-40 pointer-events-none" />
                    )}

                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="font-display font-black text-base block text-[#6E488A]">{preset.name}</span>
                        <span className={`text-[10px] font-mono tracking-wide font-black uppercase block ${isActive ? "text-[#E36DB4]" : "text-[#36C4D8]"}`}>
                          Efecto: {preset.benefit}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => toggleSoundPreset(preset)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                          isActive
                            ? "bg-white text-[#6E488A] border border-[#6E488A]/25 hover:scale-105 font-bold"
                            : "bg-[#FAF7F9] hover:bg-[#EDE0F0]/30 border border-[#6E488A]/15 text-[#56346F] hover:scale-105"
                        }`}
                        title={isActive ? "Silenciar" : "Reproducir frecuencia"}
                      >
                        {isActive ? (
                          <VolumeX className="w-5 h-5 text-[#6E488A] font-bold" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-[#56346F]/70" />
                        )}
                      </button>
                    </div>

                    <p className={`text-xs leading-relaxed block pr-4 font-medium ${isActive ? "text-[#56346F]/90" : "text-[#56346F]/80"}`}>
                      {preset.description}
                    </p>

                    {/* Equalizer lines decoration for active presets */}
                    {isActive && (
                      <div className="flex items-center gap-1.5 h-3.5 mt-1.5">
                        <span className="w-1.5 bg-current rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                        <span className="w-1.5 bg-current rounded-full animate-bounce" style={{ animationDuration: '0.9s', animationDelay: '0.1s' }} />
                        <span className="w-1.5 bg-current rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }} />
                        <span className="w-1.5 bg-current rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                        <span className="text-[10px] font-mono font-black ml-1 text-[#36C4D8]">Frecuencia Activa</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Global Volume Control */}
            <div className="bg-[#FAF7F9] p-4 rounded-xl border border-[#6E488A]/10 space-y-3">
              <div className="flex justify-between items-center text-xs text-[#56346F] font-mono font-bold">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#36C4D8]" />
                  Volumen del Sonido:
                </span>
                <span className="font-extrabold text-[#36C4D8]">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#36C4D8] bg-[#EDE0F0] h-2 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-[#56346F]/70 italic text-center leading-relaxed font-medium">
                Se recomienda escuchar estas frecuencias estables con audífonos a volumen moderado para optimizar la inducción de ondas calmantes.
              </p>
            </div>

          </div>

          {/* Seeds of Peace Affirmations Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#6E488A]/15 shadow-sm space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#E36DB4] uppercase tracking-widest font-bold block">SEMINARIO DE AUTOCOMPASIÓN</span>
              <h3 className="font-display font-black text-2xl text-[#6E488A] block">Semillas de Paz Diarias</h3>
              <p className="text-sm text-[#56346F]/80 font-medium font-sans block">Cultiva un diálogo interno suave e incondicional.</p>
            </div>

            {/* Active Affirmation Display Card */}
            <div className="bg-[#EDE0F0]/25 border border-[#6E488A]/15 p-5 rounded-2xl text-left relative overflow-hidden space-y-4 shadow-inner">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#EDE0F0] border border-[#6E488A]/10 text-[#6E488A] inline-block uppercase font-black tracking-widest">
                AFIRMACIÓN COMPASIVA
              </span>
              <p className="text-sm font-sans italic text-[#56346F] leading-relaxed font-extrabold block">
                "{activeAffirmation}"
              </p>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={handleRandomAffirmation}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-[#FAF7F9] border border-[#6E488A]/15 text-xs text-[#56346F] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                  title="Cambiar afirmación"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Otra Semilla</span>
                </button>
                <button
                  onClick={() => handleSaveAnchor(activeAffirmation)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#6E488A] to-[#E36DB4] hover:opacity-90 text-xs text-white font-extrabold cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                  title="Guardar como anclaje del día"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Anclar Esta</span>
                </button>
              </div>
            </div>

            {/* Active Saved Anchor display */}
            <div className="p-5 rounded-2xl bg-[#FAF7F9] border border-[#36C4D8]/20 text-left space-y-3 shadow-inner">
              <span className="text-xs font-mono text-[#36C4D8] uppercase tracking-widest font-black flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-[#36C4D8]" />
                MI ANCLAJE DE PAZ ACTIVO DE HOY:
              </span>
              <p className="text-xs text-[#56346F] leading-relaxed bg-white px-4 py-3 rounded-xl border border-[#36C4D8]/15 italic font-bold block shadow-sm">
                {savedAnchor}
              </p>

              {/* Custom Input anchor form */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-sans text-[#56346F]/80 font-bold">O escribe tu propio pensamiento de anclaje:</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={anchorInput}
                    onChange={(e) => setAnchorInput(e.target.value)}
                    placeholder="Ej. Elijo perdonar mi cansancio..."
                    className="w-full min-w-0 bg-white border border-[#6E488A]/15 rounded-xl px-4 py-2 text-xs text-[#56346F] placeholder-gray-400 focus:outline-none focus:border-[#36C4D8] font-sans font-medium"
                  />
                  <button
                    onClick={() => handleSaveAnchor(anchorInput)}
                    disabled={!anchorInput.trim()}
                    className="w-full sm:w-auto px-5 py-2 bg-[#36C4D8] text-white hover:bg-[#36C4D8]/90 disabled:opacity-45 disabled:cursor-not-allowed text-xs font-bold rounded-xl cursor-pointer transition-all shrink-0 shadow-sm"
                  >
                    Guardar
                  </button>
                </div>
              </div>

              {/* Success Feedback banner */}
              <AnimatePresence>
                {showSavedFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="text-xs text-[#36C4D8] font-bold text-center flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Check className="w-3.5 h-3.5 text-[#36C4D8]" />
                    <span>¡Anclaje de paz fijado con éxito!</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
