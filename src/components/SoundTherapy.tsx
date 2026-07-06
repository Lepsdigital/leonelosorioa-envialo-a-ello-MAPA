import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  Compass, 
  Wind, 
  Sun, 
  Shield, 
  Smile, 
  Heart, 
  Activity, 
  Info,
  CheckCircle2,
  Music
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SoundExperience {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  objective: string;
  description: string;
  emotion: string; // "Estoy seguro. Tengo dirección." etc.
  duration: string;
  recommendedUse: string;
  type: "compass" | "breathe" | "sunrise" | "refuge" | "mind" | "nature_tranquility";
}
const BIBLIOTECA_SONIDOS: SoundExperience[] = [
  {
    id: "brujula_interior",
    title: "Brújula Interior",
    subtitle: "Claridad y estabilidad mental",
    emoji: "🧭",
    objective: "Ayudar a disminuir la sensación de incertidumbre y recuperar claridad mental.",
    description: "Piano ambiental noble extremadamente suave, pads cálidos infinitos y un sutil rumor de viento pacífico.",
    emotion: "Estoy seguro. Tengo dirección.",
    duration: "10 min",
    recommendedUse: "Cuando la persona se siente confundida, dispersa o abrumada.",
    type: "compass"
  },
  {
    id: "respirar_en_calma",
    title: "Respirar en Calma",
    subtitle: "Descompresión y paz fisiológica",
    emoji: "🌊",
    objective: "Reducir la activación fisiológica, la ansiedad del cuerpo y regular el ritmo cardíaco.",
    description: "Guía sutil de respiración armónica acoplada al oleaje oceánico muy suave, induciendo relajación profunda.",
    emotion: "Todo está bien ahora. Mi cuerpo descansa.",
    duration: "7 min",
    recommendedUse: "En momentos de tensión física, ansiedad moderada o agitación.",
    type: "breathe"
  },
  {
    id: "amanecer_mental",
    title: "Amanecer Mental",
    subtitle: "Renovación, esperanza y optimismo",
    emoji: "🌅",
    objective: "Generar esperanza, energía luminosa y optimismo cognitivo.",
    description: "Cuerdas pacíficas, notas de piano emocional templado y suaves arrullos de pájaros al despertar el alba.",
    emotion: "Un nuevo comienzo es posible hoy.",
    duration: "10 min",
    recommendedUse: "Al iniciar tu jornada o antes de realizar las bitácoras diarias.",
    type: "sunrise"
  },
  {
    id: "refugio_seguro",
    title: "Refugio Seguro",
    subtitle: "Protección y alivio del estrés",
    emoji: "🏡",
    objective: "Disminuir la sensación de alerta o amenaza constante.",
    description: "Lluvia de bosque templado cayendo suavemente sobre la arboleda, con lejanos ecos de madera grujiente.",
    emotion: "Estoy protegido. Mi entorno es seguro.",
    duration: "15 min",
    recommendedUse: "En momentos de estrés laboral elevado, sobrecarga o fatiga crítica.",
    type: "refuge"
  },
  {
    id: "mente_presente",
    title: "Mente Presente",
    subtitle: "Anclaje absoluto contra la rumiación",
    emoji: "🧘",
    objective: "Reducir la rumiación mental, el sobrepensamiento y los bucles de agobio.",
    description: "Suaves campanas tibetanas zen y un pulso profundo de resonancia terrestre que te ancla al aquí y ahora.",
    emotion: "Estoy aquí, en el presente. Nada más importa.",
    duration: "8 min",
    recommendedUse: "Cuando aparezcan pensamientos repetitivos, obsesivos o anticipatorios.",
    type: "mind"
  },
  {
    id: "bosque_de_paz",
    title: "Bosque de Paz",
    subtitle: "Conexión natural y calma plena",
    emoji: "🌳",
    objective: "Brindar una sensación de tranquilidad profunda y seguridad mediante la naturaleza que ella misma refleja.",
    description: "Rumor constante del viento entre las copas de los árboles, detallados cantos de aves silvestres y sutiles frecuencias armónicas de paz natural.",
    emotion: "Estoy en perfecta calma. La naturaleza me sostiene.",
    duration: "12 min",
    recommendedUse: "Cuando desees detener la rumiación mental y conectar con la relajación absoluta del bosque vivo.",
    type: "nature_tranquility"
  }
];

interface PremiumAudioPlayerProps {
  src: string;
  title: string;
  subtitle: string;
  badge: string;
  themeColor: string;
}

const PremiumAudioPlayer: React.FC<PremiumAudioPlayerProps> = ({
  src,
  title,
  subtitle,
  badge,
  themeColor
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

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
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(e => console.warn("MP3 URL is a placeholder in development:", e));
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

  return (
    <div className="bg-[#56346F]/80 backdrop-blur-md border border-[#EDE0F0]/15 rounded-2xl p-5 text-white space-y-4 relative overflow-hidden shadow-md">
      <div 
        className="absolute -right-8 -bottom-8 w-20 h-20 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />
      
      <audio 
        ref={audioRef} 
        src={src} 
        preload="none" 
        style={{ display: "none" }} 
      />

      <div className="flex justify-between items-start text-left">
        <div className="space-y-1">
          <span 
            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-xs border bg-white/5"
            style={{ color: themeColor, borderColor: `${themeColor}35` }}
          >
            {badge}
          </span>
          <h4 className="font-display font-black text-base text-white leading-tight mt-1">
            {title}
          </h4>
          <p className="text-xs text-white/70 font-sans italic">
            {subtitle}
          </p>
        </div>
        <div className="text-lg">🌸</div>
      </div>

      <div className="space-y-1">
        <input 
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#36C4D8]"
          style={{
            background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${
              (currentTime / (duration || 1)) * 100
            }%, rgba(255, 255, 255, 0.2) ${
              (currentTime / (duration || 1)) * 100
            }%, rgba(255, 255, 255, 0.2) 100%)`
          }}
        />
        <div className="flex justify-between text-[10px] font-mono text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 300)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <button 
          onClick={togglePlay}
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 text-slate-950 shadow border-none outline-none"
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
              <Volume2 className="w-3.5 h-3.5 text-white" />
            )}
          </button>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-14 h-0.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    </div>
  );
};

interface SoundTherapyProps {
  unlockedAudios?: string[];
}

export const SoundTherapy: React.FC<SoundTherapyProps> = ({ unlockedAudios = [] }) => {
  const [selectedTrack, setSelectedTrack] = useState<SoundExperience>(BIBLIOTECA_SONIDOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.3); // Soft default
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Breathing visualization state (for Respirar en Calma)
  const [breathPhase, setBreathPhase] = useState<"Inhalar" | "Retener" | "Exhalar" | "Sostener">("Inhalar");
  const [breathProgress, setBreathProgress] = useState<number>(0);

  // Web Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Track lists of playing nodes to guarantee NO overlap when turning OFF or changing track
  const activeOscillators = useRef<OscillatorNode[]>([]);
  const activeBufferSources = useRef<AudioBufferSourceNode[]>([]);
  const activeGains = useRef<GainNode[]>([]);
  const activeFilters = useRef<BiquadFilterNode[]>([]);
  const activeIntervals = useRef<any[]>([]);

  // Master Gain node of the active session
  const masterGainNode = useRef<GainNode | null>(null);

  // Maintain precise breathing guide interval on UI
  useEffect(() => {
    let breathTimer: any = null;
    if (isPlaying && selectedTrack.type === "breathe") {
      let elapsedSeconds = 0;
      breathTimer = setInterval(() => {
        elapsedSeconds = (elapsedSeconds + 0.1) % 10;
        
        if (elapsedSeconds < 4) {
          setBreathPhase("Inhalar");
          setBreathProgress(elapsedSeconds / 4);
        } else if (elapsedSeconds < 6) {
          setBreathPhase("Retener");
          setBreathProgress((elapsedSeconds - 4) / 2);
        } else if (elapsedSeconds < 10) {
          setBreathPhase("Exhalar");
          setBreathProgress((elapsedSeconds - 6) / 4);
        }
      }, 100);
    } else {
      setBreathProgress(0);
      setBreathPhase("Inhalar");
    }

    return () => {
      if (breathTimer) clearInterval(breathTimer);
    };
  }, [isPlaying, selectedTrack]);

  // Clean up Web Audio on component unmount
  useEffect(() => {
    return () => {
      stopAllSoundsAndClean();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Sync volume state changes to active Master Gain Node
  useEffect(() => {
    if (masterGainNode.current && audioCtxRef.current) {
      const targetVolume = isMuted ? 0 : (volume * 2.8);
      masterGainNode.current.gain.setTargetAtTime(targetVolume, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume, isMuted]);

  // Start sound when active track changes while playing
  useEffect(() => {
    if (isPlaying) {
      startSynthesizer(selectedTrack);
    }
  }, [selectedTrack]);

  // Safety trigger for Audio Context
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Robustly clear up all previous notes, intervals & oscillators
  const stopAllSoundsAndClean = () => {
    setIsPlaying(false);

    // Stop active intervals
    activeIntervals.current.forEach(timer => clearInterval(timer));
    activeIntervals.current = [];

    // Stop and disconnect Oscillators
    activeOscillators.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
      try { osc.disconnect(); } catch(e) {}
    });
    activeOscillators.current = [];

    // Stop and disconnect Buffer Sources
    activeBufferSources.current.forEach(src => {
      try { src.stop(); } catch(e) {}
      try { src.disconnect(); } catch(e) {}
    });
    activeBufferSources.current = [];

    // Disconnect Filters
    activeFilters.current.forEach(f => {
      try { f.disconnect(); } catch(e) {}
    });
    activeFilters.current = [];

    // Disconnect Gains
    activeGains.current.forEach(g => {
      try { g.disconnect(); } catch(e) {}
    });
    activeGains.current = [];

    if (masterGainNode.current) {
      try { masterGainNode.current.disconnect(); } catch(e) {}
      masterGainNode.current = null;
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAllSoundsAndClean();
    } else {
      startSynthesizer(selectedTrack);
    }
  };

  // Main Synthesizer router utilizing perfect soft-volume Web Audio API nodes
  const startSynthesizer = (track: SoundExperience) => {
    // 1. Terminate all ongoing tracks completely to ensure NO overlapping
    stopAllSoundsAndClean();

    const ctx = getAudioContext();
    const currTime = ctx.currentTime;

    // 2. Establish Master Gain connected directly to user destination via a warm soft Limiter/Compressor
    const masterGain = ctx.createGain();
    const initialTargetVolume = isMuted ? 0 : (volume * 2.8);
    masterGain.gain.setValueAtTime(initialTargetVolume, currTime);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, currTime);
    compressor.knee.setValueAtTime(25, currTime);
    compressor.ratio.setValueAtTime(10, currTime);
    compressor.attack.setValueAtTime(0.003, currTime);
    compressor.release.setValueAtTime(0.25, currTime);

    masterGain.connect(compressor);
    compressor.connect(ctx.destination);
    masterGainNode.current = masterGain;

    // Helper functions for soft synthesis tracking
    const playOsc = (freq: number, type: OscillatorType, gainVol: number, outputNode: AudioNode): OscillatorNode => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, currTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(gainVol, currTime);

      osc.connect(oscGain).connect(outputNode);
      osc.start(currTime);

      activeOscillators.current.push(osc);
      activeGains.current.push(oscGain);
      return osc;
    };

    const createWhiteNoiseBuffer = (): AudioBuffer => {
      const bufferSize = ctx.sampleRate * 4; // 4 seconds of unique noise loops
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    };

    const playAmbientNoise = (filterFreq: number, q: number, scaleVolume: number): BiquadFilterNode => {
      const buffer = createWhiteNoiseBuffer();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(filterFreq, currTime);
      filter.Q.setValueAtTime(q, currTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(scaleVolume, currTime);

      source.connect(filter).connect(noiseGain).connect(masterGain);
      source.start(currTime);

      activeBufferSources.current.push(source);
      activeFilters.current.push(filter);
      activeGains.current.push(noiseGain);

      return filter;
    };

    // Synthesize the selected audio design gracefully with very soft textures
    switch (track.type) {
      case "compass": { // G3 / D3 ground + sparse notes
        const padRoot = playOsc(98.0, "sine", 0.35, masterGain);
        const padFifth = playOsc(146.8, "sine", 0.22, masterGain);

        const compassFilter = playAmbientNoise(180, 0.8, 0.18);
        
        const breezeLfo = ctx.createOscillator();
        breezeLfo.frequency.setValueAtTime(0.04, currTime);
        const breezeLfoGain = ctx.createGain();
        breezeLfoGain.gain.setValueAtTime(60, currTime);

        breezeLfo.connect(breezeLfoGain).connect(compassFilter.frequency);
        breezeLfo.start(currTime);
        activeOscillators.current.push(breezeLfo);
        activeGains.current.push(breezeLfoGain);

        const notes = [293.66, 329.63, 392.00, 440.00, 587.33, 659.25, 783.99];
        const playSparsePianoNote = () => {
          if (!audioCtxRef.current || !masterGainNode.current || audioCtxRef.current.state === "closed") return;
          const contextNow = audioCtxRef.current.currentTime;
          
          const pitch = notes[Math.floor(Math.random() * notes.length)];
          const pianoOsc = audioCtxRef.current.createOscillator();
          pianoOsc.type = "sine";
          pianoOsc.frequency.setValueAtTime(pitch, contextNow);

          const pianoBody = audioCtxRef.current.createOscillator();
          pianoBody.type = "triangle";
          pianoBody.frequency.setValueAtTime(pitch * 0.5, contextNow);

          const noteGain = audioCtxRef.current.createGain();
          noteGain.gain.setValueAtTime(0, contextNow);
          noteGain.gain.linearRampToValueAtTime(0.18, contextNow + 0.15);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, contextNow + 5.0);

          const filterNode = audioCtxRef.current.createBiquadFilter();
          filterNode.type = "lowpass";
          filterNode.frequency.setValueAtTime(600, contextNow);

          pianoOsc.connect(filterNode);
          pianoBody.connect(filterNode);
          filterNode.connect(noteGain).connect(masterGainNode.current);
          
          pianoOsc.start(contextNow);
          pianoBody.start(contextNow);
          pianoOsc.stop(contextNow + 5.5);
          pianoBody.stop(contextNow + 5.2);
        };

        playSparsePianoNote();
        const chimeInterval = setInterval(playSparsePianoNote, 4200);
        activeIntervals.current.push(chimeInterval);
        break;
      }

      case "breathe": {
        const oceanFilter = playAmbientNoise(120, 0.7, 0.38);

        const breathOsc = ctx.createOscillator();
        breathOsc.type = "sine";
        breathOsc.frequency.setValueAtTime(90.0, currTime);

        const breathOscGain = ctx.createGain();
        breathOscGain.gain.setValueAtTime(0.18, currTime);

        const breatheLfo = ctx.createOscillator();
        breatheLfo.frequency.setValueAtTime(0.1, currTime);

        const breatheVolumeMover = ctx.createGain();
        breatheVolumeMover.gain.setValueAtTime(0.06, currTime);

        const breatheFilterMover = ctx.createGain();
        breatheFilterMover.gain.setValueAtTime(140, currTime);

        breatheLfo.connect(breatheVolumeMover).connect(breathOscGain.gain);
        breatheLfo.connect(breatheFilterMover).connect(oceanFilter.frequency);

        breathOsc.connect(breathOscGain).connect(masterGain);
        
        breathOsc.start(currTime);
        breatheLfo.start(currTime);

        activeOscillators.current.push(breathOsc, breatheLfo);
        activeGains.current.push(breathOscGain, breatheVolumeMover, breatheFilterMover);
        break;
      }

      case "sunrise": {
        const chord1 = playOsc(196.00, "sine", 0.22, masterGain);
        const chord2 = playOsc(246.94, "sine", 0.18, masterGain);
        const chord3 = playOsc(293.66, "sine", 0.18, masterGain);
        const chord4 = playOsc(392.00, "sine", 0.15, masterGain);

        const playSoftBirdCoo = () => {
          if (!audioCtxRef.current || !masterGainNode.current || audioCtxRef.current.state === "closed") return;
          const contextNow = audioCtxRef.current.currentTime;

          const basePitch = 850 + Math.random() * 120;
          const birdOsc = audioCtxRef.current.createOscillator();
          birdOsc.type = "sine";
          birdOsc.frequency.setValueAtTime(basePitch, contextNow);
          birdOsc.frequency.exponentialRampToValueAtTime(basePitch * 1.1, contextNow + 0.12);
          birdOsc.frequency.exponentialRampToValueAtTime(basePitch * 0.95, contextNow + 0.3);

          const birdGain = audioCtxRef.current.createGain();
          birdGain.gain.setValueAtTime(0, contextNow);
          birdGain.gain.linearRampToValueAtTime(0.05, contextNow + 0.05);
          birdGain.gain.exponentialRampToValueAtTime(0.0001, contextNow + 0.35);

          const birdLp = audioCtxRef.current.createBiquadFilter();
          birdLp.type = "lowpass";
          birdLp.frequency.setValueAtTime(1200, contextNow);

          birdOsc.connect(birdLp).connect(birdGain).connect(masterGainNode.current);
          birdOsc.start(contextNow);
          birdOsc.stop(contextNow + 0.4);
        };

        const birdTimer = setInterval(playSoftBirdCoo, 5500);
        activeIntervals.current.push(birdTimer);
        break;
      }

      case "refuge": {
        const rainFilter = playAmbientNoise(280, 0.6, 0.45);
        
        const playCampfireSpark = () => {
          if (!audioCtxRef.current || !masterGainNode.current || audioCtxRef.current.state === "closed") return;
          const contextNow = audioCtxRef.current.currentTime;

          const popOsc = audioCtxRef.current.createOscillator();
          popOsc.type = "triangle";
          popOsc.frequency.setValueAtTime(140 + Math.random() * 80, contextNow);

          const popGain = audioCtxRef.current.createGain();
          popGain.gain.setValueAtTime(0.03, contextNow);
          popGain.gain.exponentialRampToValueAtTime(0.0001, contextNow + 0.04);

          const popFilter = audioCtxRef.current.createBiquadFilter();
          popFilter.type = "lowpass";
          popFilter.frequency.setValueAtTime(300, contextNow);

          popOsc.connect(popFilter).connect(popGain).connect(masterGainNode.current);
          popOsc.start(contextNow);
          popOsc.stop(contextNow + 0.05);
        };

        const fireTimer = setInterval(() => {
          if (Math.random() > 0.4) {
            playCampfireSpark();
          }
        }, 1100);
        activeIntervals.current.push(fireTimer);
        break;
      }

      case "mind": {
        const earthRoot = playOsc(110.0, "sine", 0.24, masterGain);
        const earthHarmonic = playOsc(220.0, "sine", 0.12, masterGain);

        const playTibetanSingingBowl = () => {
          if (!audioCtxRef.current || !masterGainNode.current || audioCtxRef.current.state === "closed") return;
          const contextNow = audioCtxRef.current.currentTime;

          const bowlFreqs = [144.0, 216.0, 288.0, 432.0];
          const bowlVolumeFactors = [0.18, 0.12, 0.08, 0.05];

          bowlFreqs.forEach((freq, idx) => {
            const osc = audioCtxRef.current!.createOscillator();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, contextNow);

            const oscGain = audioCtxRef.current!.createGain();
            oscGain.gain.setValueAtTime(0, contextNow);
            oscGain.gain.linearRampToValueAtTime(bowlVolumeFactors[idx], contextNow + 0.1);
            oscGain.gain.exponentialRampToValueAtTime(0.0001, contextNow + 7.5);

            osc.connect(oscGain).connect(masterGainNode.current!);
            osc.start(contextNow);
            osc.stop(contextNow + 8.0);
          });
        };

        playTibetanSingingBowl();
        const bowlTimer = setInterval(playTibetanSingingBowl, 9500);
        activeIntervals.current.push(bowlTimer);
        break;
      }

      case "nature_tranquility": {
        const padRoot = playOsc(164.81, "sine", 0.35, masterGain);
        const padFifth = playOsc(220.00, "sine", 0.25, masterGain);

        const forestFilter = playAmbientNoise(320, 0.55, 0.42);
        const breezeLfo = ctx.createOscillator();
        breezeLfo.frequency.setValueAtTime(0.08, currTime);
        const breezeLfoGain = ctx.createGain();
        breezeLfoGain.gain.setValueAtTime(140, currTime);

        breezeLfo.connect(breezeLfoGain).connect(forestFilter.frequency);
        breezeLfo.start(currTime);

        activeOscillators.current.push(breezeLfo);
        activeGains.current.push(breezeLfoGain);

        const playForestBirdChirp = () => {
          if (!audioCtxRef.current || !masterGainNode.current || audioCtxRef.current.state === "closed") return;
          const contextNow = audioCtxRef.current.currentTime;

          const birder = Math.random();
          if (birder < 0.5) {
            for (let i = 0; i < 3; i++) {
              const delay = i * 0.18;
              const osc = audioCtxRef.current.createOscillator();
              osc.type = "sine";
              const startFreq = 1800 + Math.random() * 400;
              osc.frequency.setValueAtTime(startFreq, contextNow + delay);
              osc.frequency.exponentialRampToValueAtTime(startFreq + 600, contextNow + delay + 0.08);

              const oscGain = audioCtxRef.current.createGain();
              oscGain.gain.setValueAtTime(0, contextNow + delay);
              oscGain.gain.linearRampToValueAtTime(0.06, contextNow + delay + 0.02);
              oscGain.gain.exponentialRampToValueAtTime(0.0001, contextNow + delay + 0.08);

              const filterNode = audioCtxRef.current.createBiquadFilter();
              filterNode.type = "bandpass";
              filterNode.frequency.setValueAtTime(startFreq + 300, contextNow + delay);

              osc.connect(filterNode).connect(oscGain).connect(masterGainNode.current);
              osc.start(contextNow + delay);
              osc.stop(contextNow + delay + 0.1);
            }
          } else {
            for (let i = 0; i < 3; i++) {
              const delay = i * 0.35;
              const osc = audioCtxRef.current.createOscillator();
              osc.type = "sine";
              const baseFreq = 550 + Math.random() * 40;
              osc.frequency.setValueAtTime(baseFreq, contextNow + delay);
              osc.frequency.linearRampToValueAtTime(baseFreq - 30, contextNow + delay + 0.22);

              const oscGain = audioCtxRef.current.createGain();
              oscGain.gain.setValueAtTime(0, contextNow + delay);
              oscGain.gain.linearRampToValueAtTime(0.12, contextNow + delay + 0.06); 
              oscGain.gain.exponentialRampToValueAtTime(0.0001, contextNow + delay + 0.28);

              const filterNode = audioCtxRef.current.createBiquadFilter();
              filterNode.type = "lowpass";
              filterNode.frequency.setValueAtTime(650, contextNow + delay);

              osc.connect(filterNode).connect(oscGain).connect(masterGainNode.current);
              osc.start(contextNow + delay);
              osc.stop(contextNow + delay + 0.3);
            }
          }
        };

        playForestBirdChirp();
        const birdsInterval = setInterval(playForestBirdChirp, 3800);
        activeIntervals.current.push(birdsInterval);
        break;
      }
    }

    setIsPlaying(true);
  };

  return (
    <div 
      className="bg-white border-2 border-[#36C4D8]/20 border-b-[6px] border-b-[#36C4D8]/30 rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden shadow-[0_15px_45px_rgba(54,196,216,0.08),_0_5px_15px_rgba(54,196,216,0.03)] text-left"
      id="mapa_sound_therapy_module"
    >
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#E86FA3]/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Decorative Brand Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#EDE0F0] border border-[#E86FA3]/25 rounded-full text-[10px] font-mono font-bold text-[#E86FA3] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#E86FA3] animate-pulse" />
            <span>M.A.P.A. Premium</span>
          </div>
          <h2 className="font-display font-black text-2xl text-[#411F66] tracking-tight">
            M.A.P.A. Audio Experience
          </h2>
          <p className="text-sm text-[#0B152B]/80 max-w-xl font-sans font-semibold">
            "Sonidos diseñados para ayudarte a comprender, regular y fortalecer tu mente."
          </p>
        </div>

        {/* Benefits Tooltip Toggle */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip("benefits")}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={() => setShowTooltip(prev => prev ? null : "benefits")}
            className="flex items-center space-x-1 px-3 py-1.5 bg-[#FAF7F9] hover:bg-[#EDE0F0]/30 text-xs text-[#0B152B]/80 hover:text-[#0B152B] border border-[#411F66]/15 rounded-xl transition-all cursor-pointer font-bold"
            id="btn_benefits_info"
          >
            <Info className="w-3.5 h-3.5 text-[#36C4D8]" />
            <span>Beneficios Clínicos</span>
          </button>

          <AnimatePresence>
            {showTooltip === "benefits" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 md:left-auto md:right-0 top-9 w-[calc(100vw-3.5rem)] max-w-[290px] sm:max-w-xs bg-white border border-[#411F66]/25 rounded-2xl p-4 shadow-xl z-40 text-xs space-y-2.5 font-sans text-[#0B152B]"
              >
                <p className="font-bold text-[#411F66] border-b border-[#411F66]/15 pb-1.5">Impacto Terapéutico Diseñado:</p>
                <div className="space-y-1.5 text-[#0B152B]/90 font-semibold">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#36C4D8] shrink-0 mt-0.5" />
                    <span>Disminución de la activación emocional.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#36C4D8] shrink-0 mt-0.5" />
                    <span>Reducción de la rumiación y bucles de pensamiento.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#36C4D8] shrink-0 mt-0.5" />
                    <span>Estímulo de seguridad psicológica cerebral.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#36C4D8] shrink-0 mt-0.5" />
                    <span>Regulación del sistema simpático involuntario.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#36C4D8] shrink-0 mt-0.5" />
                    <span>Reconexión inmediata con el momento presente.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* UNLOCKED PACIFIC AUDIOS IN PROFILE SECTION */}
      {unlockedAudios && (unlockedAudios.includes("day3") || unlockedAudios.includes("day4") || unlockedAudios.includes("day5") || unlockedAudios.includes("day7")) && (
        <div className="bg-[#56346F]/5 border border-[#56346F]/15 p-5 sm:p-6 rounded-3xl space-y-4 mb-8 text-left animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#E86FA3] animate-pulse" />
            <h3 className="font-display font-black text-lg text-[#56346F]">Tus Recompensas de Paz Desbloqueadas</h3>
          </div>
          <p className="text-xs text-[#56346F]/80 leading-relaxed max-w-2xl font-medium">
            ¡Felicidades por tu inmensa dedicación! La <strong>Mentora Clara</strong> ha liberado de forma permanente estas sintonías especiales para proteger tu paz y regular tu sistema nervioso cuando lo necesites.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAudios.includes("day3") && (
              <PremiumAudioPlayer
                src="https://f005.backblazeb2.com/file/M.A.P.A/Audio+de+tranquilidad+por+Clara+Premio+tercer+dia.mp3"
                title="Audio de Tranquilidad"
                subtitle="Sintonía de alivio y valentía del Día 3"
                badge="Premio a la Valentía • Día 3"
                themeColor="#E86FA3"
              />
            )}
            {unlockedAudios.includes("day4") && (
              <PremiumAudioPlayer
                src="https://f005.backblazeb2.com/file/M.A.P.A/Mi+psico%CC%81loga+me+dijo+-+Yulibeth+R.+G.+Katherine+Hoyer.mp3"
                title="Audiolibro: Mi psicóloga me dijo"
                subtitle="Un obsequio exclusivo a tu dedicación y constancia relacional"
                badge="Obsequio de Constancia • Día 4"
                themeColor="#72C7CF"
              />
            )}
            {unlockedAudios.includes("day5") && (
              <PremiumAudioPlayer
                src="https://f005.backblazeb2.com/file/M.A.P.A/Centinela+de+la+Calma+-+Clara+Premio+quinto+d%C3%ADa.mp3"
                title="Centinela de la Calma"
                subtitle="Sintonía de resiliencia y serenidad del Día 5"
                badge="Centinela de la Calma • Día 5"
                themeColor="#36C4D8"
              />
            )}
            {unlockedAudios.includes("day7") && (
              <PremiumAudioPlayer
                src="URL_DE_TU_STORAGE_DIA_7"
                title="Audio de PAZ Absoluta"
                subtitle="Sintonía de integración profunda de los 7 Días"
                badge="Paz Absoluta • Programa Completo"
                themeColor="#36C4D8"
              />
            )}
          </div>
        </div>
      )}

      {/* Grid of the 6 Audio Experiences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="audio_experiences_grid">
        {BIBLIOTECA_SONIDOS.map((track) => {
          const isSelected = selectedTrack.id === track.id;
          return (
            <motion.button
              key={track.id}
              onClick={() => setSelectedTrack(track)}
              whileHover={{ y: -2, scale: 1.01 }}
              className={`p-5 rounded-2xl text-left flex flex-col justify-between h-56 transition-all cursor-pointer relative overflow-hidden group select-none ${
                isSelected 
                  ? "bg-white border-2 border-[#36C4D8] border-b-4 border-b-[#36C4D8] shadow-[0_8px_20px_rgba(54,196,216,0.15)] text-[#56346F]" 
                  : "bg-[#FAF7F9] hover:bg-white border border-[#6E488A]/15 hover:border-[#6E488A]/35 border-b-4 hover:border-b-4 hover:border-b-[#EDE0F0]/70 border-b-[#EDE0F0]/30 shadow-sm text-[#56346F]"
              }`}
              id={`track_card_${track.id}`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#36C4D8]/10 rounded-full blur-xl pointer-events-none" />
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="text-2xl">{track.emoji}</div>
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#EDE0F0]/50 border border-[#6E488A]/10 rounded-lg text-[9px] font-mono font-bold text-[#56346F]/80">
                    <Clock className="w-3 h-3 text-[#6E488A]" />
                    <span>{track.duration}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-base text-[#6E488A] flex items-center gap-1.5">
                    {track.title}
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#36C4D8] animate-ping shrink-0" />
                    )}
                  </h3>
                  <p className="text-[10px] font-mono text-[#36C4D8] font-bold tracking-wider uppercase mb-1.5">{track.subtitle}</p>
                  <p className="text-xs text-[#56346F]/85 line-clamp-2 leading-relaxed font-medium">
                    {track.objective}
                  </p>
                </div>
              </div>

              {/* Emotional Affirmation Badge Footer */}
              <div className="border-t border-[#6E488A]/10 pt-2.5 mt-2 flex justify-between items-center w-full">
                <div className="text-[10.5px] text-[#56346F]/90 font-bold italic truncate max-w-[80%]">
                  "{track.emotion}"
                </div>
                {isSelected ? (
                  <span className="text-[10px] font-mono text-[#36C4D8] font-bold uppercase shrink-0">Seleccionado</span>
                ) : (
                  <span className="text-[10px] font-mono text-[#56346F]/60 group-hover:text-[#56346F]/80 transition-colors shrink-0 font-bold">Escuchar</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Main active player controller panel */}
      <div 
        className="bg-gradient-to-r from-white via-[#FFF7FC] to-white border border-[#E86FA3]/20 rounded-3xl p-5 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-[0_0_25px_rgba(232,111,163,0.08)]"
        id="sound_therapy_player_console"
      >
        {/* Subtle decorative background wave animation when playing */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#36C4D8] via-[#E86FA3] to-[#411F66] opacity-60 animate-pulse pointer-events-none" />
        )}

        {/* Selected sound summary metadata info */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="text-4xl p-3.5 bg-white border border-[#411F66]/15 rounded-2xl shrink-0 shadow-sm">
            {selectedTrack.emoji}
          </div>
          <div className="space-y-1 text-left">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-[#E86FA3] uppercase tracking-widest bg-[#EDE0F0] px-2 py-0.5 rounded border border-[#E86FA3]/15">
                Reproductor Integrado
              </span>
              <span className="text-xs text-[#0B152B]/70 font-semibold">• {selectedTrack.duration}</span>
            </div>
            <h4 className="font-display font-black text-lg text-[#411F66]">{selectedTrack.title}</h4>
            <p className="text-xs text-[#0B152B]/90 italic font-bold">"{selectedTrack.emotion}"</p>
          </div>
        </div>

        {/* Center: Live interactive breathing and visualizer area */}
        <div className="flex flex-col items-center justify-center shrink-0 min-w-[200px] text-center space-y-2">
          {selectedTrack.type === "breathe" && isPlaying ? (
            <div className="space-y-1.5 flex flex-col items-center">
              <div className="text-[10px] font-mono font-bold text-[#36C4D8] uppercase tracking-widest">Guía de Respiración</div>
              <motion.div 
                animate={{ scale: breathPhase === "Inhalar" ? 1.4 : breathPhase === "Retener" ? 1.4 : 1.0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#36C4D8]/10 border border-[#36C4D8]/50 shadow-[0_0_15px_rgba(54,196,216,0.25)] text-xs text-[#36C4D8] font-bold"
              >
                {breathPhase.substring(0, 3)}
              </motion.div>
              <span className="text-[11px] text-[#411F66] font-bold">
                {breathPhase === "Inhalar" && "Toma aire despacio... 💨"}
                {breathPhase === "Retener" && "Sostén con calma... 🧘"}
                {breathPhase === "Exhalar" && "Suelta el aire suave... 🌊"}
              </span>
            </div>
          ) : isPlaying ? (
            <div className="flex items-center justify-center space-x-1 h-12">
              {/* Refined non-linear soft reactive audio bars */}
              {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => (
                <motion.div
                  key={idx}
                  className="w-1.5 rounded-full bg-gradient-to-t from-[#411F66] to-[#E86FA3]"
                  animate={{ 
                    height: [
                      `${val * 4}px`, 
                      `${val * 7 + Math.random() * 12}px`, 
                      `${val * 4}px`
                    ] 
                  }}
                  transition={{ 
                    duration: 0.8 + idx * 0.1, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#0B152B]/70 font-sans italic max-w-[220px] font-semibold">
              Toca reproducir para iniciar la experiencia sonora libre de distorsiones
            </p>
          )}
        </div>

        {/* Master audio state controls (Play, volume, mute) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
          {/* Main big Play Trigger Button */}
          <button 
            onClick={togglePlayPause}
            className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all shrink-0 shadow-[0_0_15px_rgba(232,111,163,0.3)] select-none bg-gradient-to-r from-[#411F66] to-[#E86FA3] text-white hover:opacity-90 btn-neon-pulse"
            title={isPlaying ? "Pausar sonido de calma" : "Iniciar sonido de calma"}
            id="btn_play_pause_therapy"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white stroke-none" />
            ) : (
              <Play className="w-6 h-6 fill-white stroke-none ml-0.5" />
            )}
          </button>

          {/* Mute toggle button */}
          <div className="flex items-center space-x-3 bg-white border border-[#411F66]/15 rounded-2xl py-2 px-4 w-full sm:w-auto justify-between sm:justify-start shadow-sm">
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="p-1.5 hover:bg-[#FAF7F9] rounded-xl transition-colors cursor-pointer text-[#411F66]"
              title={isMuted ? "Quitar silencio" : "Mute/Silenciar"}
              id="btn_toggle_mute_therapy"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#36C4D8]" />
              )}
            </button>

            {/* Volume range bar feel */}
            <div className="flex flex-col text-left space-y-1 w-24">
              <span className="text-[8px] font-mono text-[#0B152B]/60 uppercase tracking-widest font-bold">Volumen</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full h-1 bg-[#EDE0F0] rounded-lg appearance-none cursor-pointer accent-[#36C4D8] outline-none"
                aria-label="Ajustar volumen"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice of Recommended Use */}
      <div className="bg-[#EDE0F0]/30 border border-[#E86FA3]/20 p-4 rounded-2xl flex items-start gap-3 text-xs text-[#0B152B]/80 leading-relaxed font-sans">
        <Info className="w-4 h-4 text-[#36C4D8] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-left">
          <p className="font-bold text-[#411F66]">Recomendación terapéutica:</p>
          <p className="font-semibold">
            Para esta experiencia sonora, <strong className="text-[#E86FA3]">haz clic sobre una de las 6 cartas anteriores</strong> que describa mejor tu estado de ánimo actual. Recomendamos su uso preferiblemente con auriculares a volumen moderadamente bajo para percibir de manera óptima las frecuencias armónicas envolventes y los microtonos.
          </p>
        </div>
      </div>
    </div>
  );
};
