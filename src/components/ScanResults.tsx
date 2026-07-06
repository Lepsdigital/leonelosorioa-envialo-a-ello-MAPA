import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from "recharts";
import { 
  Sparkles, 
  Brain, 
  ShieldAlert, 
  Heart, 
  TrendingUp, 
  ArrowRight, 
  Mail, 
  Users, 
  Lock, 
  Compass, 
  Clock, 
  ChevronRight,
  UserCheck
} from "lucide-react";

interface ScanResultsProps {
  metrics: {
    activacion: number;
    preocupacion: number;
    alerta: number;
    agotamiento: number;
    claridad: number;
    regulacion: number;
    bienestar: number;
    riesgoSobrecarga: number;
    factoresProteccion: string[];
  };
  radialData: { subject: string; valor: number }[];
  interpretacionIA: string;
  onBeginProgram: (nombre: string, email: string, whatsapp: string, accessCode: string) => void;
  onRestart: () => void;
  isLoadingReg: boolean;
}

export const ScanResults: React.FC<ScanResultsProps> = ({
  metrics,
  radialData,
  interpretacionIA,
  onBeginProgram,
  onRestart,
  isLoadingReg
}) => {
  const [showSignup, setShowSignup] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);

  const handleSubmitSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!nombre.trim() || !email.trim() || !accessCode.trim()) return;
    if (!acceptTerms) return;

    // Email format validation (RFC 5322 simple regex)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Por favor ingresa un correo electrónico con formato válido.");
      return;
    }

    onBeginProgram(nombre.trim(), email.trim(), "", accessCode.trim().toUpperCase());
  };  // Color mapping bases
  const getRiesgoColor = (val: number) => {
    if (val >= 80) return "text-[#E86FA3]";
    if (val >= 50) return "text-[#E86FA3]";
    return "text-[#36C4D8]";
  };

  const getRiesgoBg = (val: number) => {
    if (val >= 80) return "bg-white border-[#E86FA3]/30 shadow-[0_0_25px_rgba(232,111,163,0.15)]";
    if (val >= 50) return "bg-white border-[#E86FA3]/20 shadow-[0_0_20px_rgba(232,111,163,0.1)]";
    return "bg-white border-[#36C4D8]/20 shadow-[0_0_20px_rgba(54,196,216,0.1)]";
  };

  // Motion variants for smooth fade-in / pulse transition after loading
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 85,
        damping: 14
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-10 py-2 px-2" 
      id="scan_results_view"
    >
      
      {/* HEADER RESULT CARD */}
      <motion.section variants={cardVariants} className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#EDE0F0] border border-[#6E488A]/20 p-1.5 px-4 rounded-full">
          <UserCheck className="w-4 h-4 text-[#411F66]" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#411F66] font-extrabold">
            ESCANEO FINALIZADO • INFORME INMEDIATO
          </span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-[#411F66] tracking-tight leading-snug">
          M.A.P.A.™ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E86FA3] to-[#36C4D8]">Revelado de Alerta</span>
        </h2>
        <p className="text-sm text-[#0B152B]/85 max-w-xl mx-auto font-sans leading-relaxed font-medium">
          Tu escaneo de sensibilidad corporal y emocional ha concluido con éxito. Aquí están tus indicadores principales de protección mental.
        </p>
      </motion.section>

      {/* THREE COLUMN GRID - STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric Card 1: Activación */}
        <motion.div 
          variants={cardVariants}
          className="p-6 rounded-3xl bg-white border border-[#E86FA3]/20 space-y-4 text-left shadow-[0_0_20px_rgba(232,111,163,0.1)] transition-all hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(232,111,163,0.15)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#411F66] font-bold tracking-widest">ACTIVACIÓN CORPORAL</span>
            <span className="text-xl">🫁</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-4xl font-display font-black text-[#E86FA3]">{metrics.activacion}%</h4>
            <p className="text-xs text-[#0B152B]/80 font-sans leading-relaxed font-medium">
              Tensión física guardada en tus músculos y respiración.
            </p>
          </div>
          <div className="w-full bg-[#EDE0F0] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#E86FA3] to-[#F58BC8]" style={{ width: `${metrics.activacion}%` }} />
          </div>
        </motion.div>

        {/* Metric Card 2: Alerta Social */}
        <motion.div 
          variants={cardVariants}
          className="p-6 rounded-3xl bg-white border border-[#6E488A]/12 space-y-4 text-left shadow-md transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#411F66] font-bold tracking-widest">ALERTA SOCIAL</span>
            <span className="text-xl">👁️</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-4xl font-display font-black text-[#411F66]">{metrics.alerta}%</h4>
            <p className="text-xs text-[#0B152B]/80 font-sans leading-relaxed font-medium">
              Sensación de tener que predecir problemas o tensiones con los demás.
            </p>
          </div>
          <div className="w-full bg-[#EDE0F0] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-[#411F66]" style={{ width: `${metrics.alerta}%` }} />
          </div>
        </motion.div>

        {/* Metric Card 3: Riesgo Sobrecarga */}
        <motion.div 
          variants={cardVariants}
          className={`p-6 rounded-3xl border space-y-4 text-left transition-all hover:scale-[1.01] ${getRiesgoBg(metrics.riesgoSobrecarga)}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#411F66] font-bold tracking-widest">RIESGO DE SOBRECARGA</span>
            <span className="text-xl">🎒</span>
          </div>
          <div className="space-y-1">
            <h4 className={`text-4xl font-display font-black ${getRiesgoColor(metrics.riesgoSobrecarga)}`}>
              {metrics.riesgoSobrecarga}%
            </h4>
            <p className="text-xs text-[#0B152B]/80 font-sans leading-relaxed font-medium">
              Cansancio profundo acumulado en tu sistema nervioso actual.
            </p>
          </div>
          <div className="w-full bg-[#EDE0F0] h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${getRiesgoColor(metrics.riesgoSobrecarga).includes("E86FA3") ? "bg-[#E86FA3]" : "bg-[#36C4D8]"}`} style={{ width: `${metrics.riesgoSobrecarga}%` }} />
          </div>
        </motion.div>

      </div>

      {/* CORE ANALYSIS: COGNITIVE RADAR & IA INTERPRETATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radial Radar Comparison chart */}
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#36C4D8]/20 flex flex-col justify-center items-center h-[340px] shadow-[0_0_20px_rgba(54,196,216,0.1)] transition-all hover:scale-[1.01]"
        >
          <span className="text-xs font-mono text-[#411F66] uppercase tracking-widest font-black block mb-4">
            REGISTRO RADIAL DE ADAPTACIÓN
          </span>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radialData}>
                <PolarGrid stroke="#EDE0F0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: "#411F66", fontSize: 9, fontFamily: "monospace", fontWeight: "bold" }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#411F66" }} />
                <Radar 
                  name="Puntajes" 
                  dataKey="valor" 
                  stroke="#36C4D8" 
                  fill="#36C4D8" 
                  fillOpacity={0.25} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Interpretation generated with AI */}
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#E86FA3]/25 space-y-6 text-left flex flex-col justify-between shadow-[0_0_20px_rgba(232,111,163,0.08)] relative overflow-hidden transition-all hover:scale-[1.01]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#36C4D8]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 bg-[#EDE0F0] border border-[#6E488A]/20 flex items-center justify-center rounded-lg text-xs leading-none">
                🤖
              </span>
              <h4 className="font-display font-extrabold text-lg text-[#411F66]">
                Interpretación Inteligente M.A.P.A.™
              </h4>
            </div>
            
            <p className="text-sm sm:text-base text-[#0B152B] font-sans tracking-wide leading-relaxed pl-3 border-l-4 border-[#E86FA3] font-semibold italic">
              "{interpretacionIA}"
            </p>
          </div>

          {/* Factores de protección list */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono tracking-widest text-[#E86FA3] font-extrabold uppercase block">
              🛡️ FACTORES CLAVE DE PROTECCIÓN DETECTADOS:
            </span>
            <ul className="space-y-1.5 pl-1.5">
              {metrics.factoresProteccion.map((fac, idx) => (
                <li key={idx} className="text-xs text-[#0B152B] font-sans flex items-start space-x-2 leading-relaxed font-semibold">
                  <span className="text-[#36C4D8] font-bold shrink-0">✔</span>
                  <span>{fac}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

      </div>

      {/* INVITATION & SIGNUP AREA */}
      <AnimatePresence mode="wait">
        {!showSignup ? (
          <motion.div
            key="invitation_box"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-4 sm:p-8 rounded-3xl bg-white border border-[#E86FA3]/30 space-y-5 text-center max-w-2xl mx-auto shadow-[0_0_35px_rgba(232,111,163,0.15)] relative"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#36C4D8]/10 rounded-full blur-2xl animate-pulse" />
            
            <div className="space-y-2">
              <span className="text-[10px] sm:text-xs font-mono text-[#E86FA3] font-black uppercase tracking-widest block">
                ⭐ PROGRAMA DE ACOMPAÑAMIENTO DE 7 DÍAS
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#411F66]">
                Inicia tu Plan de Alivio de 7 Días
              </h3>
              <p className="text-xs sm:text-sm text-[#0B152B]/85 font-sans max-w-lg mx-auto leading-relaxed font-medium">
                Tu resultado muestra que te beneficiarías del <strong className="text-[#411F66] font-black">M.A.P.A.™ de 7 días</strong>. Recibe audios, ejercicios prácticos y seguimiento diario para calmar tu alarma corporal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={() => setShowSignup(true)}
                className="px-6 py-3.5 sm:px-10 sm:py-4 rounded-xl font-display font-extrabold tracking-wider text-white bg-gradient-to-r from-[#411F66] to-[#E86FA3] hover:scale-[1.03] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[0_4px_25px_rgba(232,111,163,0.35)] hover:shadow-[0_0_25px_rgba(54,196,216,0.6)] duration-300 text-xs sm:text-sm border-2 border-[#262222]"
              >
                <span>COMENZAR PROGRAMA</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <button
                onClick={onRestart}
                className="px-4 py-3 sm:px-6 sm:py-4 rounded-xl border border-[#6E488A]/20 text-[#411F66] hover:bg-[#EDE0F0]/40 text-xs font-bold transition-all cursor-pointer"
              >
                Hacer otro escaneo
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup_box"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-4 sm:p-8 rounded-3xl bg-white border border-[#E86FA3]/30 space-y-5 text-left max-w-md mx-auto shadow-[0_0_35px_rgba(232,111,163,0.15)] relative backdrop-blur-md"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#36C4D8]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-1 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#EDE0F0] border border-[#6E488A]/10 flex items-center justify-center mx-auto sm:mx-0">
                <Compass className="w-5 h-5 text-[#36C4D8] animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <h3 className="font-display font-black text-xl text-[#411F66] pt-2">
                Ingresa al Programa
              </h3>
              <p className="text-xs text-[#0B152B]/85 font-sans leading-relaxed font-semibold">
                Completa tus datos (regístrate con el mismo correo con el que realizaste la compra) para guardar tu avance, acceder cada día y recibir tu guía de ejercicios prácticos.
              </p>
            </div>

            <form onSubmit={handleSubmitSignup} className="space-y-4">
              {/* Cómo quieres que te llamemos */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#411F66] uppercase tracking-widest font-black">
                  ¿Cómo quieres que te llamemos?
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#411F66]/60" />
                  <input 
                    type="text" 
                    required
                    placeholder="Tu nombre o cómo te sientas más cómoda..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-white border border-[#6E488A]/15 focus:border-[#36C4D8] placeholder:text-gray-400 rounded-xl p-3 pl-11 text-sm outline-none text-[#0B152B] transition-all font-sans font-semibold"
                  />
                </div>
                <p className="text-[10px] text-[#56346F]/80 leading-relaxed font-sans font-medium mt-1 select-none">
                  No necesitas darnos tus apellidos. Usaremos este nombre únicamente para personalizar tu dashboard y dirigirnos a ti con cariño durante tu proceso.
                </p>
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#411F66] uppercase tracking-widest font-black">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#411F66]/60" />
                  <input 
                    type="email" 
                    required
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`w-full bg-white border ${emailError ? 'border-[#E86FA3] focus:border-[#E86FA3]' : 'border-[#6E488A]/15 focus:border-[#36C4D8]'} placeholder:text-gray-400 rounded-xl p-3 pl-11 text-sm outline-none text-[#0B152B] transition-all font-sans font-semibold`}
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] font-mono text-[#E86FA3] animate-pulse mt-1 font-bold">
                    ⚠ {emailError}
                  </p>
                )}
              </div>

              {/* Código de Acceso */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#411F66] uppercase tracking-widest font-black flex justify-between items-center">
                  <span>Código de Acceso (6 caracteres)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#411F66]/60" />
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. K9A8B7"
                    maxLength={6}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-[#6E488A]/15 focus:border-[#36C4D8] placeholder:text-gray-400 rounded-xl p-3 pl-11 text-sm outline-none text-[#0B152B] transition-all font-mono font-bold tracking-widest uppercase"
                  />
                </div>
                <span className="block text-[10px] text-[#0B152B]/70 font-sans mt-0.5 leading-relaxed font-semibold">
                  Ingresa el código de 6 caracteres que se envió a tu correo tras tu compra en Hotmart.
                </span>
              </div>

              {/* Consent checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <input 
                  type="checkbox" 
                  id="consent_check"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 accent-[#36C4D8] rounded shrink-0"
                />
                <label htmlFor="consent_check" className="text-[10px] text-[#0B152B]/85 leading-normal font-sans cursor-pointer select-none font-semibold">
                  Entiendo que M.A.P.A.™ es una experiencia lúdica y emocional de acompañamiento y no una terapia psiquiátrica clínica presencial. Doy mi conformidad.
                </label>
              </div>

              {/* Submision Button */}
              <button
                type="submit"
                disabled={!acceptTerms || isLoadingReg}
                className="w-full py-4 rounded-xl font-display font-black tracking-wider text-white bg-gradient-to-r from-[#411F66] to-[#E86FA3] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(232,111,163,0.35)] hover:shadow-[0_0_25px_rgba(54,196,216,0.6)] duration-300 flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none border-2 border-[#262222]"
              >
                <span>{isLoadingReg ? "CREANDO ACCESO..." : "ACCEDER A MI MAPA DE 7 DÍAS"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowSignup(false)}
                className="text-xs font-bold text-[#411F66]/85 hover:text-[#411F66] transition-colors bg-transparent border-none py-1 cursor-pointer"
              >
                ← Volver al informe visual
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
