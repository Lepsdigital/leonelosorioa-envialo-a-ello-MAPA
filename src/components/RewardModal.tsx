import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Award, Trophy, X, Play, Pause, Volume2, Music, CheckCircle, Download, Share2, Save, Loader2 } from "lucide-react";
import { useWhatsAppShare } from "../utils/useWhatsAppShare";

interface RewardModalProps {
  isOpen: boolean;
  type: "day3" | "day4" | "day5" | "day7" | null;
  onClose: () => void;
  userName: string;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  type,
  onClose,
  userName
}) => {
  if (!type) return null;

  const { shareToWhatsApp, shareWithFallback } = useWhatsAppShare();

  const isDay3 = type === "day3";
  const isDay4 = type === "day4";
  const isDay5 = type === "day5";
  const isDay7 = type === "day7";

  let title = "Premio a la Valentía";
  let badge = "Mitad del Camino de Calma • Día 3";
  let themeColor = "#6E488A"; // Lavender
  let audioSrc = "https://f005.backblazeb2.com/file/M.A.P.A/Audio+de+tranquilidad+por+Clara+Premio+tercer+dia.mp3";
  let audioTitle = "Audio de Tranquilidad";
  let audioSubtitle = "Voz de nuestra mentora, Clara";

  if (isDay3) {
    // Already set as defaults
  } else if (isDay4) {
    title = "Hito de Transformación Superado";
    badge = "Obsequio de Constancia • Día 4";
    themeColor = "#72C7CF";
    audioSrc = "https://f005.backblazeb2.com/file/M.A.P.A/Mi+psico%CC%81loga+me+dijo+-+Yulibeth+R.+G.+Katherine+Hoyer.mp3";
    audioTitle = "Audiolibro: Mi psicóloga me dijo";
    audioSubtitle = "Un obsequio exclusivo a tu dedicación y constancia relacional";
  } else if (isDay5) {
    title = "Premio a la Resiliencia";
    badge = "Centinela de la Calma • Día 5";
    themeColor = "#36C4D8"; // Turquoise
    audioSrc = "https://f005.backblazeb2.com/file/M.A.P.A/Centinela+de+la+Calma+-+Clara+Premio+quinto+d%C3%ADa.mp3";
    audioTitle = "Centinela de la Calma";
    audioSubtitle = "Voz de nuestra mentora, Clara";
  } else if (isDay7) {
    title = "Paz Absoluta • Tu Graduación";
    badge = "Reconocimiento de Transformación de 7 Días";
    themeColor = "#36C4D8";
    audioSrc = "https://f005.backblazeb2.com/file/M.A.P.A/Tu+mapa.mp3"; // Or fallback URL
    audioTitle = "Audio de PAZ Absoluta";
    audioSubtitle = "Sintonía de integración profunda de Mentora Clara";
  }

  // HTML5 audio state management
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Async task states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Auto-play and state resetting
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setSaveSuccess(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (isOpen && audioSrc) {
      const playTimeout = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(e => {
              console.warn("Autoplay was prevented by browser or failed to load. Awaiting user interaction.", e);
              setIsPlaying(false);
            });
        }
      }, 500);
      return () => clearTimeout(playTimeout);
    }
  }, [type, isOpen, audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(e => console.warn("Error playing audio:", e));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const val = parseFloat(e.target.value);
    audio.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const val = parseFloat(e.target.value);
    audio.volume = val;
    setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 1. Guardar en Panel (API Request con Resguardo Local Seguro)
  const handleSaveToPanel = async () => {
    setIsSaving(true);
    
    const token = localStorage.getItem("MAPA_ACCESS_TOKEN");
    const activeEmail = localStorage.getItem("MAPA_CURRENT_USER_EMAIL");

    // Función auxiliar para resguardar localmente el audio desbloqueado
    const saveLocally = () => {
      // 1. Actualizar estructura genérica
      const localProgStr = localStorage.getItem("MAPA_7DAY_PROGRESS_V2");
      if (localProgStr) {
        try {
          const localProg = JSON.parse(localProgStr);
          const currentUnlocked = localProg.unlockedAudios || [];
          if (!currentUnlocked.includes(type)) {
            currentUnlocked.push(type);
            localProg.unlockedAudios = currentUnlocked;
            localStorage.setItem("MAPA_7DAY_PROGRESS_V2", JSON.stringify(localProg));
          }
        } catch (err) {
          console.error("Local save error in gen:", err);
        }
      }

      // 2. Actualizar estructura específica de correo
      if (activeEmail) {
        const userProgStr = localStorage.getItem(`MAPA_USER_PROGRESS_${activeEmail.toLowerCase().trim()}`);
        if (userProgStr) {
          try {
            const userProg = JSON.parse(userProgStr);
            const currentUnlocked = userProg.unlockedAudios || [];
            if (!currentUnlocked.includes(type)) {
              currentUnlocked.push(type);
              userProg.unlockedAudios = currentUnlocked;
              localStorage.setItem(`MAPA_USER_PROGRESS_${activeEmail.toLowerCase().trim()}`, JSON.stringify(userProg));
            }
          } catch (err) {
            console.error("Local save error in user:", err);
          }
        }
      }
    };

    // Si no está logueado, lo guardamos localmente con éxito
    if (!token || !activeEmail) {
      saveLocally();
      setSaveSuccess(true);
      alert("¡Audio guardado localmente en tu dispositivo con éxito! Para guardarlo en tu panel en la nube de forma permanente y poder acceder desde cualquier otro dispositivo, por favor inicia sesión en la plataforma.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/save-unlocked-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ audioId: type })
      });

      if (res.ok) {
        saveLocally();
        setSaveSuccess(true);
        alert("¡Audio guardado con éxito en tu Panel de Fortificación Neural!");
      } else {
        // Parsear respuesta robustamente (evitar error de JSON en páginas HTML/texto de error)
        let errorMsg = "No se pudo guardar el audio en la nube. Por favor inicia sesión nuevamente.";
        try {
          const text = await res.text();
          const errData = JSON.parse(text);
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (parseErr) {
          errorMsg = `Error del servidor (Código ${res.status}): No pudimos sincronizar con la nube.`;
        }
        
        // Guardar de todas formas de forma local como plan de contingencia
        saveLocally();
        setSaveSuccess(true);
        alert(`Nota: ${errorMsg}\n\nNo te preocupes: Hemos guardado tu audio de forma segura a nivel local en este dispositivo para que puedas escucharlo.`);
      }
    } catch (err) {
      console.error("Save reward failed:", err);
      // Guardar de todas formas de forma local como plan de contingencia
      saveLocally();
      setSaveSuccess(true);
      alert("No pudimos conectar con el servidor en este momento.\n\nNo te preocupes: Tu audio ha sido guardado de forma segura de manera local en este navegador para que no pierdas tu recompensa.");
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Descargar MP3
  const handleDownload = async () => {
    if (!audioSrc) return;
    setIsDownloading(true);
    try {
      const response = await fetch(audioSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = isDay3 
        ? "MAPA_Mujer_Audio_de_Tranquilidad.mp3" 
        : isDay5 
          ? "MAPA_Mujer_Centinela_de_la_Calma.mp3" 
          : isDay4 
            ? "MAPA_Mujer_Audiolibro.mp3" 
            : "MAPA_Mujer_Audio_PAZ_Absoluta.mp3";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed, using backup direct window open method:", err);
      window.open(audioSrc, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  // 3. Compartir (Web Share API con embudo de ventas)
  const handleShare = async () => {
    const options = {
      variant: "reward" as const,
      rewardTitle: audioTitle,
      day: isDay3 ? 3 : isDay5 ? 5 : isDay4 ? 4 : 7
    };
    
    const result = await shareWithFallback(options);
    if (result.success) {
      if (result.method === "clipboard") {
        alert("¡Mensaje motivador de M.A.P.A.™ y enlace al Test copiados al portapapeles! Compártelo con tus amigas y seres queridos.");
      }
    } else {
      // Fallback manual a WhatsApp
      shareToWhatsApp(options);
    }
  };

  const nameToShow = userName || "Usuaria";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop blur with deep shadow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B0515]/85 backdrop-blur-md"
          />

          {/* Cinematic Glassmorphism Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative w-full max-w-xl bg-gradient-to-br from-[#2D163F] via-[#1E092D] to-[#0F0417] text-white rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.75)] border border-white/10 overflow-hidden z-10"
          >
            {/* Ambient dynamic glowing orbs behind card */}
            <div 
              className="absolute -right-24 -top-24 w-48 h-48 rounded-full blur-3xl opacity-35 animate-pulse pointer-events-none"
              style={{ backgroundColor: themeColor }}
            />
            <div className="absolute -left-24 -bottom-24 w-48 h-48 bg-[#56346F]/45 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all cursor-pointer border-none outline-none z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hidden HTML5 Audio Element */}
            <audio
              ref={audioRef}
              src={audioSrc}
              preload="auto"
              style={{ display: "none" }}
            />

            {/* Content Container */}
            <div className="space-y-6 text-center relative z-10">
              
              {/* Header Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                {isDay3 ? (
                  <Trophy className="w-4 h-4 text-[#E86FA3] animate-bounce" />
                ) : isDay5 ? (
                  <Award className="w-4 h-4 text-[#36C4D8] animate-pulse" />
                ) : isDay4 ? (
                  <Sparkles className="w-4 h-4 text-[#72C7CF] animate-pulse" />
                ) : (
                  <Award className="w-4 h-4 text-[#36C4D8] animate-spin" />
                )}
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest" style={{ color: themeColor }}>
                  {badge}
                </span>
              </div>

              {/* Avatar Illustration Section */}
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-[#EDE0F0]/15 rounded-full blur-xl scale-125 pointer-events-none" />
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-xl border-2"
                  style={{ borderColor: `${themeColor}40`, backgroundColor: "#311849" }}
                >
                  {isDay3 ? "🌸" : isDay5 ? "🛡️" : isDay4 ? "📚" : "🎓"}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white/10 border border-white/20 p-1 rounded-full">
                  <Sparkles className="w-4 h-4" style={{ color: themeColor }} />
                </div>
              </div>

              {/* Title & Clara Prompt */}
              <div className="space-y-2">
                <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
                  {title}
                </h3>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-white/50">
                  Mensaje Especial de Mentora Clara
                </p>
                <div className="h-0.5 w-16 mx-auto" style={{ backgroundColor: themeColor }} />
              </div>

              {/* Empathic Message Body */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 text-left text-sm leading-relaxed text-white/90 font-sans italic relative">
                <span className="absolute -top-3 -left-1 text-4xl text-white/10 font-serif">“</span>
                {isDay3 ? (
                  <p>
                    Querida <strong style={{ color: themeColor }}>{nameToShow}</strong>, hoy has completado tu tercer día de M.A.P.A.™ y quiero detenerme para honrar tu inmensa valentía. Llegar a la mitad de este proceso no es casualidad; es la prueba viviente de tu compromiso absoluto con tu paz y bienestar. Para premiar tu valentía, he desbloqueado este <strong className="text-white">Audio de Tranquilidad</strong>. Un bálsamo acústico diseñado para calmar tu sistema nervioso y recordarte que estás a salvo. Este audio quedará guardado para siempre en tu panel para que lo escuches cuando lo necesites.
                  </p>
                ) : isDay5 ? (
                  <p>
                    Felicidades, mi querida <strong style={{ color: themeColor }}>{nameToShow}</strong>. Has completado exitosamente tu test del Día 5. Hoy honramos tu constancia y tu poder de resiliencia emocional. Te entrego el audio <strong className="text-white">Centinela de la Calma</strong>, una sintonía protectora de calma profunda y equilibrio interno diseñada por mí para guiar tus momentos de tensión y devolver la armonía a tu corazón.
                  </p>
                ) : isDay4 ? (
                  <p>
                    ¡Lo lograste, <strong style={{ color: themeColor }}>{nameToShow}</strong>! Has superado la mitad de tu viaje de transformación. Llegar al Día 4 requiere un compromiso inmenso con tu paz mental, y tu persistencia merece ser honrada.
                  </p>
                ) : (
                  <p>
                    ¡Felicidades, mi querida <strong style={{ color: themeColor }}>{nameToShow}</strong>! Has concluido con éxito los 7 días de tu Mapa de Activación y Protección Emocional. Hoy celebro con profunda admiración tu constancia, tu resiliencia y el infinito amor que te has demostrado al completar este viaje terapéutico. Te entrego tu reconocimiento final y libero para ti el <strong className="text-white">Audio de PAZ Absoluta</strong>, para que esta sintonía te acompañe indefinidamente a lo largo de tu vida. Siempre estará disponible en tu perfil. ¡Lo lograste!
                  </p>
                )}
                <span className="absolute -bottom-7 -right-1 text-4xl text-white/10 font-serif">”</span>
              </div>

              {/* Native HTML5 Customized Audio Player Container */}
              <div className="bg-[#1A0A26] border border-white/10 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Music className="w-5 h-5" style={{ color: themeColor }} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {audioTitle}
                    </h4>
                    <p className="text-[11px] text-white/60 font-sans italic">
                      {audioSubtitle}
                    </p>
                  </div>
                </div>

                {/* Progress bar and time */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer transition-all outline-none"
                    style={{
                      background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${
                        (currentTime / (duration || 1)) * 100
                      }%, rgba(255, 255, 255, 0.1) ${
                        (currentTime / (duration || 1)) * 100
                      }%, rgba(255, 255, 255, 0.1) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-[9px] font-mono text-white/40">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 300)}</span>
                  </div>
                </div>

                {/* Player Playback controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 text-slate-950 shadow-md border-none outline-none"
                    style={{ backgroundColor: themeColor }}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current text-[#1A0A26]" />
                    ) : (
                      <Play className="w-4 h-4 fill-current text-[#1A0A26] ml-0.5" />
                    )}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                      {isMuted ? (
                        <span className="text-[10px] font-mono font-bold text-red-400">MUTED</span>
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>
              </div>

              {/* Utility Tools Actions Panel */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {/* 1. Save to Panel */}
                <button
                  onClick={handleSaveToPanel}
                  disabled={isSaving || saveSuccess}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer select-none outline-none disabled:opacity-80"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: themeColor }} />
                  ) : saveSuccess ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Save className="w-5 h-5 text-white" />
                  )}
                  <span className="text-[10px] mt-1.5 font-bold tracking-tight">
                    {saveSuccess ? "¡Guardado!" : "Guardar Panel"}
                  </span>
                </button>

                {/* 2. Download */}
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer select-none outline-none disabled:opacity-80"
                >
                  {isDownloading ? (
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: themeColor }} />
                  ) : (
                    <Download className="w-5 h-5 text-white" />
                  )}
                  <span className="text-[10px] mt-1.5 font-bold tracking-tight">Descargar</span>
                </button>

                {/* 3. Share */}
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer select-none outline-none"
                >
                  <Share2 className="w-5 h-5 text-white" />
                  <span className="text-[10px] mt-1.5 font-bold tracking-tight">Compartir</span>
                </button>
              </div>

              {/* Close / Recibir button */}
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-gradient-to-r from-[#EDE0F0] to-[#E36DB4]/30 text-white hover:text-white rounded-xl font-bold uppercase tracking-wider text-xs border border-white/20 hover:border-white/40 cursor-pointer shadow-md hover:shadow-xl transition-all"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${themeColor} 0%, #56346F 100%)`
                  }}
                >
                  {isDay3 || isDay5 ? (
                    "Completar y Continuar ➔"
                  ) : isDay4 ? (
                    "Guardar en mis recursos y continuar"
                  ) : (
                    "Guardar Reconocimiento y Finalizar 🎓"
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
