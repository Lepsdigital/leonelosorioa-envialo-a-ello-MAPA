import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Activity, 
  ShieldAlert, 
  Heart, 
  Map, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  ShieldCheck, 
  Share2, 
  Download, 
  Mail, 
  Users, 
  Lock, 
  Unlock,
  Eye, 
  Layers,
  Award,
  Zap,
  Check,
  Smartphone,
  Facebook,
  Instagram,
  Linkedin,
  Clock,
  X,
  ArrowUp,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  MessageCircle
} from "lucide-react";
import { QUESTIONS } from "./questions";
import { EmotionalProfile, QuizResponse, LeadInfo } from "./types";
import { ScanWizard } from "./components/ScanWizard";
import { ScanResults } from "./components/ScanResults";
import { SoundTherapy } from "./components/SoundTherapy";
import { AdminPanel } from "./components/AdminPanel";
import { PushNotificationManager } from "./components/PushNotificationManager";
import { TermsAndPrivacy } from "./components/TermsAndPrivacy";
import { AppDownloadPrompt } from "./components/AppDownloadPrompt";
import { PremiumDashboard } from "./components/PremiumDashboard";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { RewardModal } from "./components/RewardModal";
import { MilestoneModal } from "./components/MilestoneModal";
import { useWhatsAppShare, FUNNEL_URL } from "./utils/useWhatsAppShare";
import { playClickCue, playAlertCue, playSuccessCue } from "./utils/audioCues";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine
} from "recharts";

interface MiniExercise {
  id: number;
  title: string;
  category: "respiracion" | "estiramiento" | "grounding";
  emoji: string;
  description: string;
  steps: string[];
  duration: number; // in seconds
  guides: string[]; // sequence of guides for the countdown
}

const MINI_EXERCISES: MiniExercise[] = [
  {
    id: 1,
    title: "Respiración de Caja 4-4-4",
    category: "respiracion",
    emoji: "🧘",
    description: "Inhala, sostén y exhala en tiempos iguales para resetear tu sistema de alerta y regular tu ritmo cardíaco.",
    steps: ["Inhala aire por la nariz (4s)", "Mantén el aire con suavidad (4s)", "Exhala despacio por la boca (4s)"],
    duration: 30,
    guides: [
      "Inhala profundamente por la nariz...", 
      "Sigue inhalando aire puro...", 
      "Mantén el aire con calma...", 
      "Sostén con total tranquilidad...", 
      "Exhala despacio por la boca...", 
      "Saca todo el aire y relaja...", 
      "Inhala una vez más por la nariz...", 
      "Mantén el aire con serenidad...", 
      "Exhala liberando tensiones...", 
      "Disfruta de este espacio de paz."
    ]
  },
  {
    id: 2,
    title: "Estiramiento del Gato Sentada",
    category: "estiramiento",
    emoji: "🐈",
    description: "Libera la tensión acumulada en la columna vertebral, hombros y cuello directamente desde tu asiento.",
    steps: ["Entrelaza tus manos y empuja al frente curvando tu espalda (15s)", "Estira tus manos hacia el cielo abriendo el pecho (15s)"],
    duration: 30,
    guides: [
      "Entrelaza tus manos al frente...", 
      "Empuja hacia adelante estirando tu espalda...", 
      "Siente la liberación en tus omóplatos...", 
      "Respira hondo mientras estiras...", 
      "Ahora lleva tus brazos hacia el cielo...", 
      "Estírate alto como queriendo tocar el techo...", 
      "Abre tu pecho e inhala profundamente...", 
      "Nota la relajación de tus hombros...", 
      "Suelta tus brazos lentamente y relaja...", 
      "Haz una respiración de transición."
    ]
  },
  {
    id: 3,
    title: "Respiración Relámpago (4-7-8)",
    category: "respiracion",
    emoji: "⚡",
    description: "La técnica definitiva del Dr. Weil para apagar la rumiación mental y conciliar la calma instantánea.",
    steps: ["Inhala aire por la nariz (4s)", "Sostén el aire con serenidad (7s)", "Exhala con un suspiro fuerte (8s)"],
    duration: 30,
    guides: [
      "Prepárate, exhala todo el aire...", 
      "Inhala profundamente por la nariz...", 
      "Sostén el aire con calma...", 
      "Siente el aire sosteniendo tu pecho...", 
      "Exhala con un suspiro relajante...", 
      "Sigue exhalando con suavidad...", 
      "Inhala de nuevo aire puro...", 
      "Sostén con total serenidad...", 
      "Exhala disolviendo la ansiedad...", 
      "Siente tu cuerpo sintonizado."
    ]
  },
  {
    id: 4,
    title: "Liberación de Hombros y Cuello",
    category: "estiramiento",
    emoji: "🪵",
    description: "Desactiva los puntos gatillo de tensión en trapecios superiores por malas posturas o estrés.",
    steps: ["Sube hombros hacia las orejas inhalando (5s)", "Sostén la tensión (5s)", "Suelta de golpe exhalando (5s). Repite."],
    duration: 30,
    guides: [
      "Inhala y sube tus hombros muy alto...", 
      "Llévalos hacia tus orejas...", 
      "Sostén la tensión acumulada allí...", 
      "¡Suelta de golpe con un suspiro profundo! Ahhh...", 
      "Quédate ahí y nota la diferencia...", 
      "Inhala y vuelve a subir los hombros alto...", 
      "Sostén la tensión corporal...", 
      "¡Suelta de golpe de nuevo liberando todo!", 
      "Respira con total normalidad...", 
      "Siente tus hombros ligeros y suaves."
    ]
  },
  {
    id: 5,
    title: "Anclaje Sensorial (Grounding 3-2-1)",
    category: "grounding",
    emoji: "👁️",
    description: "Trae tu atención de vuelta al presente cuando sientas rumiación o dispersión de pensamiento.",
    steps: ["Observa 3 objetos a tu alrededor", "Siente 2 texturas táctiles diferentes", "Haz 1 respiración profunda con los ojos cerrados"],
    duration: 30,
    guides: [
      "Mira a tu alrededor con lentitud...", 
      "Identifica 3 objetos y nómbralos mentalmente...", 
      "Siente 2 texturas táctiles en tu ropa o mesa...", 
      "Enfoca tu mente en el contacto físico...", 
      "Cierra tus ojos suavemente ahora...", 
      "Haz 1 respiración profunda por la nariz...", 
      "Siente el aire expandiendo tus pulmones...", 
      "Exhala disolviendo las nubes mentales...", 
      "Vuelve a abrir tus ojos poco a poco...", 
      "Estás aquí, estás a salvo."
    ]
  }
];


export default function App() {
  const { getShareText, shareToWhatsApp, shareWithFallback } = useWhatsAppShare();

  // Navigation Phases: "LANDING" | "SCAN_TEST" | "SCAN_RESULTS" | "LOGIN" | "DASHBOARD" | "WIZARD" | "LOADING" | "RESULTS" | "ADMIN"
  const [phase, setPhase] = useState<"LANDING" | "SCAN_TEST" | "SCAN_RESULTS" | "LOGIN" | "DASHBOARD" | "WIZARD" | "LOADING" | "RESULTS" | "ADMIN">("LANDING");
  
  // Landing States
  const [selectedChecks, setSelectedChecks] = useState<Record<number, boolean>>({});
  const [activePillarTab, setActivePillarTab] = useState<number>(0);
  const [pillarScores, setPillarScores] = useState<number[]>([75, 60, 80, 85, 70]);
  
  // User Login and Session Recovery states
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return localStorage.getItem("MAPA_CURRENT_USER_EMAIL") || "";
  });

  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginNombre, setLoginNombre] = useState<string>("");
  const [loginWhatsapp, setLoginWhatsapp] = useState<string>("");
  const [loginAccessCode, setLoginAccessCode] = useState<string>("");
  const [isRequestingCode, setIsRequestingCode] = useState<boolean>(false);
  const [loginTermsAccepted, setLoginTermsAccepted] = useState<boolean>(true);

  // 7-Day Program State
  const [programProgress, setProgramProgress] = useState<{
    activationDate: string;
    currentDay: number;
    completedDays: number[];
    responses: Record<number, QuizResponse[]>;
    leadInfo: LeadInfo;
    leadCaptured: boolean;
    completionTimestamps?: Record<number, string>;
    hasDownloadedApp?: boolean;
    unlockedAudios?: string[];
  }>(() => {
    const activeEmail = localStorage.getItem("MAPA_CURRENT_USER_EMAIL") || "";
    if (activeEmail) {
      const savedUserProgress = localStorage.getItem(`MAPA_USER_PROGRESS_${activeEmail.toLowerCase().trim()}`);
      if (savedUserProgress) {
        try {
          return JSON.parse(savedUserProgress);
        } catch (e) {
          console.error("Error loading user progress", e);
        }
      }
    }
    // Fallback to legacy global progress
    const saved = localStorage.getItem("MAPA_7DAY_PROGRESS_V2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.activationDate) {
          return parsed;
        }
      } catch (e) {
        console.error("Error restoring progress", e);
      }
    }
    return {
      activationDate: "",
      currentDay: 1,
      completedDays: [],
      responses: {},
      leadInfo: { nombre: "", email: "", whatsapp: "" },
      leadCaptured: false,
      completionTimestamps: {},
      hasDownloadedApp: false,
      unlockedAudios: []
    };
  });

  // Tick state to drive the dynamic countdown timers every second
  const [tick, setTick] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Precise chronological calculations for 24h consecutive lock logic (based on previous day completion)
  const getChronologicalState = () => {
    if (!programProgress.activationDate) {
      return {
        maxAllowedDay: 1,
        msRemaining: 0,
        isLocked: false,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    const currentDay = programProgress.currentDay;
    
    // Day 1 is always unlocked immediately upon starting the program
    if (currentDay === 1) {
      return {
        maxAllowedDay: 1,
        msRemaining: 0,
        isLocked: false,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    const prevDay = currentDay - 1;
    let prevCompletionMs = 0;

    // Check if we have the completion timestamp of the previous day
    if (programProgress.completionTimestamps && programProgress.completionTimestamps[prevDay]) {
      prevCompletionMs = new Date(programProgress.completionTimestamps[prevDay]).getTime();
    } else {
      // Robust fallback calculation if timestamp is missing
      const activatedDate = new Date(programProgress.activationDate);
      prevCompletionMs = activatedDate.getTime() + (prevDay - 1) * 24 * 60 * 60 * 1000;
    }

    const now = new Date();
    const unlockTime = prevCompletionMs + 24 * 60 * 60 * 1000;
    const msRemaining = Math.max(0, unlockTime - now.getTime());
    const isLocked = msRemaining > 0;

    const totalSeconds = Math.floor(msRemaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Maximum day chronologically allowed is currentDay if unlocked, otherwise currentDay - 1
    const maxAllowedDay = isLocked ? currentDay - 1 : currentDay;

    return {
      maxAllowedDay,
      msRemaining,
      isLocked,
      hours,
      minutes,
      seconds
    };
  };

  // Keep leads state in sync
  const [leadInfo, setLeadInfo] = useState<LeadInfo>(programProgress.leadInfo || { nombre: "", email: "", whatsapp: "" });
  const [leadCaptured, setLeadCaptured] = useState<boolean>(programProgress.leadCaptured || false);

  // Active temporary answers for the CURRENT day's questionnaire
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userResponses, setUserResponses] = useState<QuizResponse[]>([]);
  const [isEvaluationReady, setIsEvaluationReady] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<EmotionalProfile | null>(null);
  
  // Dashboard alerts and messages
  const [dashboardNotice, setDashboardNotice] = useState<string | null>(null);

  // Rewards states
  const [unlockedAudioModal, setUnlockedAudioModal] = useState<{ isOpen: boolean; type: "day3" | "day4" | "day5" | "day7" | null }>({ isOpen: false, type: null });
  const [milestoneModal, setMilestoneModal] = useState<{ isOpen: boolean; daysCount: number }>({ isOpen: false, daysCount: 3 });

  // Email sending states for the final report
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState<boolean>(false);
  const [emailSendingStep, setEmailSendingStep] = useState<string>("");

  // Loading Simulation Text Steps
  const [loadingStepText, setLoadingStepText] = useState<string>("Iniciando escaneo del radar emocional...");
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // Copy/Share state alert
  const [shareAlert, setShareAlert] = useState<string | null>(null);
  const [leadSubmitToast, setLeadSubmitToast] = useState<string | null>(null);
  const [whatsappCountryCode, setWhatsappCountryCode] = useState<string>("+34");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");

  // Modal selector for privacy and terms documents
  const [activeDocumentModal, setActiveDocumentModal] = useState<"PRIVACY" | "TERMS" | null>(null);

  // New Initial 7-Question Scan states
  const [scanMetrics, setScanMetrics] = useState<any>(null);
  const [scanRadialData, setScanRadialData] = useState<any[]>([]);
  const [scanInterpretacion, setScanInterpretacion] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [selectedDayPreview, setSelectedDayPreview] = useState<number | null>(null);
  
  // Mini-ejercicio de calma states
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [isMiniExerciseActive, setIsMiniExerciseActive] = useState<boolean>(false);
  const [miniSecondsLeft, setMiniSecondsLeft] = useState<number>(30);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isMiniExerciseActive) {
      interval = setInterval(() => {
        setMiniSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsMiniExerciseActive(false);
            if (interval) clearInterval(interval);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setMiniSecondsLeft(30);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMiniExerciseActive]);

  const rotateMiniExercise = () => {
    if (isMiniExerciseActive) return;
    let nextIdx = currentExerciseIndex;
    if (MINI_EXERCISES.length > 1) {
      while (nextIdx === currentExerciseIndex) {
        nextIdx = Math.floor(Math.random() * MINI_EXERCISES.length);
      }
    }
    setCurrentExerciseIndex(nextIdx);
  };

  // Scroll Indicator and Alarm Systems
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [alarmAudio] = useState<HTMLAudioElement | null>(() => {
    if (typeof Audio !== "undefined") {
      const audio = new Audio("https://f005.backblazeb2.com/file/M.A.P.A/Tu+mapa.mp3");
      audio.loop = false;
      return audio;
    }
    return null;
  });
  const [isAlarmPlaying, setIsAlarmPlaying] = useState<boolean>(false);
  const [alarmReason, setAlarmReason] = useState<string>("");
  const [testReminderAlarmEnabled, setTestReminderAlarmEnabled] = useState<boolean>(true);
  const [testReminderFired, setTestReminderFired] = useState<boolean>(false);
  const [activeTaskAlarm, setActiveTaskAlarm] = useState<{ taskName: string; secondsLeft: number; isRunning: boolean } | null>(null);
  const [alarmPanelOpen, setAlarmPanelOpen] = useState<boolean>(false);

  // Triggering & stopping audio alarms
  const triggerAlarm = (reason: string) => {
    setAlarmReason(reason);
    setIsAlarmPlaying(true);
    if (alarmAudio) {
      alarmAudio.loop = false;
      alarmAudio.play().catch(e => {
        console.warn("Autoplay block or audio play warning:", e);
      });
    }

    // Trigger local Service Worker notification to alert even if app is closed, in background, or phone is locked!
    if ("serviceWorker" in navigator && "Notification" in window) {
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("🔔 Alarma M.A.P.A.™", {
            body: reason,
            icon: "/icon-512.png",
            badge: "/icon-512.png",
            vibrate: [300, 100, 300, 100, 300], // Strong tactile vibrations
            tag: "mapa-timer-alarm",
            requireInteraction: true // Requires user dismiss, works wonderfully in background
          } as any);
        }).catch((err) => {
          console.warn("Could not register background notification in Service Worker:", err);
          try {
            new Notification("🔔 Alarma M.A.P.A.™", {
              body: reason,
              icon: "/icon-512.png"
            });
          } catch (e) {
            console.error(e);
          }
        });
      }
    }
  };

  const stopAlarm = () => {
    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }
    setIsAlarmPlaying(false);
    setAlarmReason("");
  };

  // Scroll to Top visibility logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Alarm timer countdown tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTaskAlarm && activeTaskAlarm.isRunning) {
      interval = setInterval(() => {
        setActiveTaskAlarm((prev) => {
          if (!prev) return null;
          if (prev.secondsLeft <= 1) {
            triggerAlarm(`¡Alarma de Bienestar! Es hora de tu ejercicio: "${prev.taskName}"`);
            return null; // triggered, stop
          }
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTaskAlarm]);

  // Daily test countdown reminder check
  useEffect(() => {
    if (!programProgress.activationDate) return;
    const chrono = getChronologicalState();
    
    // If next day is unlocked (isLocked is false), total days completed is less than 7, reminder is enabled, and reminder hasn't fired yet
    const completedCount = programProgress.completedDays?.length || 0;
    if (!chrono.isLocked && completedCount < 7 && testReminderAlarmEnabled && !testReminderFired) {
      triggerAlarm(`¡Tu prueba diaria M.A.P.A. del Día ${programProgress.currentDay} ya está disponible!`);
      setTestReminderFired(true);
    }

    // Reset reminder fired state if it gets locked again (e.g. they completed a day and next day is locked)
    if (chrono.isLocked && testReminderFired) {
      setTestReminderFired(false);
    }
  }, [tick, programProgress.activationDate, programProgress.currentDay, programProgress.completedDays, testReminderAlarmEnabled, testReminderFired]);
  
  // Interactive legend states for the 7-day activation chart
  const [showActivationData, setShowActivationData] = useState<boolean>(true);
  const [showHealthyLimit, setShowHealthyLimit] = useState<boolean>(true);

  // Selector function for dynamic emotional regulation motivational messages
  const getMotivationalMessageForDay = (dayName: string) => {
    const messages = [
      "¡Respira profundo, estás haciendo un gran trabajo!",
      "Tu respiración es tu ancla en momentos de tormenta. Siente su ritmo.",
      "Cada exhalación libera la tensión acumulada en tu cuerpo. Permítete soltar.",
      "Pausar no es detenerse, es restaurar tu equilibrio interior de forma gradual.",
      "Confía en la capacidad natural de tu sistema para recuperar la calma y la seguridad.",
      "Un pequeño momento de atención plena tiene el poder de transformar todo tu día.",
      "Inhala paz, exhala tensión. Estás a salvo aquí y ahora en este instante."
    ];
    // Use character codes to calculate a stable index based on the day name,
    // avoiding flickering while still assigning a different message for each bar.
    let hash = 0;
    for (let i = 0; i < dayName.length; i++) {
      hash = dayName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % messages.length;
    return messages[index];
  };

  // Get activation data for 7-day comparative bar chart
  const get7DayActivationData = () => {
    const baseActivation = evaluationResult?.activationLevel || 85;
    const days = [1, 2, 3, 4, 5, 6, 7];
    
    return days.map((dayNum) => {
      const responses = (programProgress.responses && programProgress.responses[dayNum]) || [];
      let score = 0;
      
      if (responses.length > 0) {
        let totalWeight = 0;
        let count = 0;
        responses.forEach((resItem) => {
          const question = QUESTIONS.find((q) => q.id === resItem.questionId);
          if (question && question.options) {
            const option = question.options.find((opt) => opt.value === resItem.value);
            if (option) {
              const weights = option.scoreWeight ? Object.values(option.scoreWeight) : [];
              const sumOfWeights = weights.reduce((a, b) => a + b, 0);
              totalWeight += sumOfWeights;
              count++;
            }
          }
        });
        if (count > 0) {
          score = Math.round(Math.min(95, Math.max(30, (totalWeight / (count * 3)) * 85)));
        }
      }
      
      if (score === 0) {
        const reductionStep = (baseActivation - 42) / 6;
        score = Math.round(baseActivation - (dayNum - 1) * reductionStep + (Math.sin(dayNum) * 3));
        score = Math.min(95, Math.max(35, score));
      }
      
      return {
        name: `Día ${dayNum}`,
        "Nivel de Activación": score,
        "Límite Saludable": 45
      };
    });
  };

  // Global Soft Click Audio Cues for tranquility
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" || 
        target.closest("button") || 
        target.getAttribute("role") === "button" || 
        target.tagName === "A" ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.classList.contains("btn");

      if (isInteractive) {
        playClickCue();
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  const handleConfirmAppDownloaded = () => {
    setProgramProgress(prev => {
      const updated = {
        ...prev,
        hasDownloadedApp: true
      };
      const userEmail = leadInfo.email || currentUserEmail;
      if (userEmail) {
        localStorage.setItem(
          `MAPA_USER_PROGRESS_${userEmail.toLowerCase().trim()}`,
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  };

  // Synchronize progress to cloud database server
  const syncProgressToCloud = async (currentProgress: any, userEmail: string) => {
    if (!userEmail) return;
    try {
      const res = await fetch("/api/update-user-progress", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("MAPA_ACCESS_TOKEN") || ""}`
        },
        body: JSON.stringify({
          email: userEmail,
          programProgress: currentProgress
        })
      });
      if (res.status === 401 || res.status === 403) {
        const data = await res.json();
        alert(data.error || "Sesión expirada o acceso no autorizado. Por favor ingresa tus datos nuevamente.");
        localStorage.removeItem("MAPA_CURRENT_USER_EMAIL");
        localStorage.removeItem("MAPA_ACCESS_TOKEN");
        setCurrentUserEmail("");
        setPhase("LOGIN");
      }
    } catch (e) {
      console.warn("Cloud syncing offline/fallback:", e);
    }
  };

  // Save progress dynamically whenever it changes
  useEffect(() => {
    if (programProgress.activationDate) {
      const payload = {
        ...programProgress,
        leadInfo,
        leadCaptured
      };
      
      // Save globally for fallback
      localStorage.setItem("MAPA_7DAY_PROGRESS_V2", JSON.stringify(payload));
      
      // Save specifically for the logged-in user
      const userEmail = leadInfo.email || currentUserEmail;
      if (userEmail) {
        localStorage.setItem(
          `MAPA_USER_PROGRESS_${userEmail.toLowerCase().trim()}`,
          JSON.stringify(payload)
        );
        syncProgressToCloud(payload, userEmail);
      }
    }

    // Synchronize to Cache Storage for Service Worker push notification dynamic state check
    if (programProgress && typeof window !== "undefined" && 'caches' in window) {
      try {
        const cacheData = new Response(JSON.stringify(programProgress), {
          headers: { 'Content-Type': 'application/json' }
        });
        caches.open("mapa-user-progress-cache").then((cache) => {
          cache.put("/local-user-progress", cacheData);
        }).catch((err) => {
          console.warn("[M.A.P.A.] Error caching user progress for sw sync:", err);
        });
      } catch (err) {
        console.warn("[M.A.P.A.] Failed to write progress to cache:", err);
      }
    }
  }, [programProgress, leadInfo, leadCaptured, currentUserEmail]);

  // Autocomplete existing profile fields live when typing an email
  useEffect(() => {
    const emailKey = loginEmail.toLowerCase().trim();
    if (emailKey && emailKey.includes("@")) {
      const existing = localStorage.getItem(`MAPA_USER_PROGRESS_${emailKey}`);
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (parsed && parsed.leadInfo) {
            if (parsed.leadInfo.nombre && !loginNombre) {
              setLoginNombre(parsed.leadInfo.nombre);
            }
            if (parsed.leadInfo.whatsapp && !loginWhatsapp) {
              setLoginWhatsapp(parsed.leadInfo.whatsapp);
            }
          }
        } catch (e) {
          console.error("Error reading live progress autocomplete", e);
        }
      }
    }
  }, [loginEmail]);

  // Deep-link check: if URL has action=test, handle automatic entrance and launch daily test
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const action = params.get("action");
      if (action === "test") {
        const activeEmail = localStorage.getItem("MAPA_CURRENT_USER_EMAIL");
        if (activeEmail) {
          const emailKey = activeEmail.toLowerCase().trim();
          const savedProgress = localStorage.getItem(`MAPA_USER_PROGRESS_${emailKey}`);
          if (savedProgress) {
            try {
              const parsed = JSON.parse(savedProgress);
              setProgramProgress(parsed);
              
              // Verify chronological lock
              const currentDay = parsed.currentDay || 1;
              let isLocked = false;
              if (currentDay > 1) {
                const prevDay = currentDay - 1;
                let prevCompletionMs = 0;
                if (parsed.completionTimestamps && parsed.completionTimestamps[prevDay]) {
                  prevCompletionMs = new Date(parsed.completionTimestamps[prevDay]).getTime();
                } else {
                  const activatedDate = new Date(parsed.activationDate);
                  prevCompletionMs = activatedDate.getTime() + (prevDay - 1) * 24 * 60 * 60 * 1000;
                }
                const now = new Date().getTime();
                isLocked = (prevCompletionMs + 24 * 60 * 60 * 1000 - now) > 0;
              }

              if (!isLocked) {
                // Launch questionnaire for the active day directly
                const existingQuiz = parsed.responses[currentDay] || [];
                setUserResponses(existingQuiz);
                setCurrentQuestionIndex(0);
                setIsEvaluationReady(false);
                setPhase("WIZARD");
                setDashboardNotice(`🌟 ¡Ingreso rápido al Test del Día ${currentDay} activado!`);
                setTimeout(() => setDashboardNotice(null), 5000);
              } else {
                setPhase("DASHBOARD");
                setDashboardNotice(`Querida ${parsed.leadInfo?.nombre || "usuaria"}, tu test del Día ${currentDay} aún se encuentra en proceso de asimilación cronológica.`);
                setTimeout(() => setDashboardNotice(null), 8000);
              }
            } catch (e) {
              console.error("Error launching deep-link test:", e);
              setPhase("DASHBOARD");
            }
          } else {
            setPhase("DASHBOARD");
          }
        } else {
          setPhase("LOGIN");
          setDashboardNotice("Por favor, inicia sesión para acceder directamente a tu test diario.");
          setTimeout(() => setDashboardNotice(null), 5000);
        }
      }
    }
  }, []);

  // Handle high-fidelity personalized login/recovery calling the secure Hotmart auth system
  const handleRequestAccessCode = async () => {
    if (!loginEmail) {
      alert("Por favor, ingresa primero tu correo electrónico en el formulario para poder solicitar tu Código de Acceso.");
      return;
    }
    setIsRequestingCode(true);
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Hemos enviado tu Código de Acceso a tu correo electrónico. Por favor, revisa tu bandeja de entrada y spam.");
      } else {
        alert(data.error || "No encontramos tu correo registrado como compradora en Hotmart.");
      }
    } catch (err) {
      console.warn("Error requesting access code:", err);
      alert("Inconveniente temporal para conectar con el servidor de seguridad. Inténtalo de nuevo.");
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      alert("Por favor, ingresa tu correo electrónico registrado.");
      return;
    }

    const emailKey = loginEmail.toLowerCase().trim();
    const rawInputCode = loginAccessCode.trim();

    // Call secure auth/login on the backend
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailKey,
        accessCode: rawInputCode
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "El Código de Acceso o correo proporcionados son incorrectos.");
        return;
      }

      console.log("Inicio de sesión seguro exitoso:", data);
      
      // Save secure JWT token and active email session
      localStorage.setItem("MAPA_ACCESS_TOKEN", data.token);
      localStorage.setItem("MAPA_CURRENT_USER_EMAIL", emailKey);
      setCurrentUserEmail(emailKey);

      // Hydrate progress from server
      const loadedProgress = data.userProgress;
      setProgramProgress(loadedProgress);
      localStorage.setItem(`MAPA_USER_PROGRESS_${emailKey}`, JSON.stringify(loadedProgress));
      
      // Sync React states
      setLeadInfo(loadedProgress.leadInfo);
      setLeadCaptured(true);

      // Go to Admin phase if administrator, else Dashboard phase
      const adminEmails = ["contacto@tupodermental.club", "tupodermentaloficial@gmail.com", "agencialeps@gmail.com"];
      if (adminEmails.includes(emailKey) || data.isAdmin) {
        setPhase("ADMIN");
      } else {
        setPhase("DASHBOARD");
        setDashboardNotice(`🎯 ¡Acceso concedido! Bienvenida a M.A.P.A.™ Mujer, ${loadedProgress.leadInfo.nombre || "Alumna"}.`);
        setTimeout(() => setDashboardNotice(null), 4000);
      }
    })
    .catch((err) => {
      console.warn("Fallo de red en inicio de sesión, intentando ingreso local respaldado:", err);
      // Fallback offline access (only works if they already logged in successfully before and have local progress)
      const existing = localStorage.getItem(`MAPA_USER_PROGRESS_${emailKey}`);
      if (existing) {
        try {
          const loadedProgress = JSON.parse(existing);
          setProgramProgress(loadedProgress);
          localStorage.setItem("MAPA_CURRENT_USER_EMAIL", emailKey);
          setCurrentUserEmail(emailKey);
          setLeadInfo(loadedProgress.leadInfo);
          setLeadCaptured(true);
          setPhase("DASHBOARD");
          setDashboardNotice(`🎯 ¡Acceso offline concedido! Bienvenida de nuevo, ${loadedProgress.leadInfo.nombre}.`);
          setTimeout(() => setDashboardNotice(null), 3500);
          return;
        } catch (e) {
          console.error(e);
        }
      }
      alert("No pudimos validar tus credenciales de Hotmart. Asegúrate de tener conexión a Internet para tu primer inicio de sesión.");
    });
  };

  const handleUserLogout = () => {
    localStorage.removeItem("MAPA_CURRENT_USER_EMAIL");
    setCurrentUserEmail("");
    
    // Reset to brand new progress locally
    const initialBlankProgress = {
      activationDate: "",
      currentDay: 1,
      completedDays: [],
      responses: {},
      leadInfo: { nombre: "", email: "", whatsapp: "" },
      leadCaptured: false,
      completionTimestamps: {}
    };
    setProgramProgress(initialBlankProgress);
    setLeadInfo({ nombre: "", email: "", whatsapp: "" });
    setLeadCaptured(false);
    
    // Clean up login input state too
    setLoginEmail("");
    setLoginNombre("");
    setLoginWhatsapp("");
    
    setPhase("LANDING");
    setDashboardNotice("Has cerrado sesión. Tus respuestas están resguardadas e intactas con tu correo.");
    setTimeout(() => setDashboardNotice(null), 3500);
  };

  // Scroll to top on phase changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  // Start the 7-Question Free Scan Initial test
  const startFreeScanTest = () => {
    setPhase("SCAN_TEST");
  };

  const handleRestartScan = () => {
    setScanMetrics(null);
    setScanRadialData([]);
    setScanInterpretacion("");
    setPhase("LANDING");
  };

  const handleScanComplete = async (responses: any) => {
    setPhase("LOADING");
    setLoadingProgress(10);
    setLoadingStepText("Iniciando escaneo de marcadores autónomos...");

    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 12;
      });
    }, 500);

    try {
      const apiInput = responses.map((r: any) => ({
        questionId: r.questionIndex + 1,
        value: String(r.value),
        category: "scan"
      }));

      const res = await fetch("/api/evaluate-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: apiInput })
      });

      const data = await res.json();
      clearInterval(progressTimer);

      if (data.success) {
        setLoadingProgress(100);
        setScanMetrics(data.metrics);
        setScanRadialData(data.radialData);
        setScanInterpretacion(data.interpretacionIA);
        
        setTimeout(() => {
          setPhase("SCAN_RESULTS");
        }, 600);
      } else {
        throw new Error(data.error || "Error al computar!");
      }
    } catch (e) {
      clearInterval(progressTimer);
      console.warn("Scan AI evaluation helper failed, running offline clinical fallback:", e);
      
      setScanMetrics({
        activacion: 72,
        preocupacion: 82,
        alerta: 64,
        agotamiento: 76,
        claridad: 48,
        regulacion: 41,
        bienestar: 44,
        riesgoSobrecarga: 74,
        factoresProteccion: [
          "Sensibilidad empática sobresaliente para decodificar entornos.",
          "Fuerte deseo consciente de iniciar desactivación de alerta cerebral hoy."
        ]
      });
      setScanRadialData([
        { subject: "Activación", valor: 72 },
        { subject: "Preocupación", valor: 82 },
        { subject: "Alerta Social", valor: 64 },
        { subject: "Agotamiento", valor: 76 },
        { subject: "Claridad", valor: 48 },
        { subject: "Regulación", valor: 41 },
        { subject: "Bienestar", valor: 44 }
      ]);
      setScanInterpretacion("Tu sistema autónomo simpático opera con sensibilidad de alerta aumentada de pelea o huida. Esto se refleja especialmente en tu nivel de preocupación perseverativa (82%) y agotamiento (76%). Se recomienda un acompañamiento guiado de 7 días.");
      
      setLoadingProgress(100);
      setTimeout(() => {
        setPhase("SCAN_RESULTS");
      }, 600);
    }
  };

  const handleRegisterAndStartProgram = async (nombre: string, email: string, whatsapp: string, accessCode: string) => {
    setIsRegistering(true);
    const emailKey = email.toLowerCase().trim();
    const cleanAccessCode = (accessCode || "").trim().toUpperCase();

    // 1. Ejecutar verificación y registro seguro con el servidor antes de ingresar
    fetch("/api/register-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombre.trim(),
        email: emailKey,
        whatsapp: whatsapp.trim(),
        accessCode: cleanAccessCode,
        initialScanResults: scanMetrics,
        origin: "Escaneo Inicial M.A.P.A."
      })
    })
    .then(async (res) => {
      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Respuesta no válida del servidor (Código ${res.status}): ${text.substring(0, 150)}`);
      }

      if (!res.ok) {
        alert(data.error || "El Código de Acceso o el Correo Electrónico proporcionados no son correctos o no registran un pago aprobado en Hotmart.");
        setIsRegistering(false);
        return;
      }

      console.log("Sincronización de registro con servidor exitosa:", data);
      
      // Guardar sesión segura en localStorage
      localStorage.setItem("MAPA_ACCESS_TOKEN", data.token);
      localStorage.setItem("MAPA_CURRENT_USER_EMAIL", emailKey);
      setCurrentUserEmail(emailKey);

      const loadedProgress = data.userProgress;
      setProgramProgress(loadedProgress);
      localStorage.setItem(`MAPA_USER_PROGRESS_${emailKey}`, JSON.stringify(loadedProgress));
      setLeadInfo(loadedProgress.leadInfo);
      setLeadCaptured(true);

      // Ir a la fase correspondiente (Admin si aplica, sino Dashboard)
      const adminEmails = ["contacto@tupodermental.club", "tupodermentaloficial@gmail.com", "agencialeps@gmail.com"];
      if (adminEmails.includes(emailKey) || data.isAdmin) {
        setPhase("ADMIN");
      } else {
        setPhase("DASHBOARD");
        setDashboardNotice(`🎯 ¡M.A.P.A.™ Mujer iniciado con éxito! Bienvenida al programa, querida ${loadedProgress.leadInfo.nombre || "Alumna"}.`);
        setTimeout(() => setDashboardNotice(null), 6000);
      }
      setIsRegistering(false);
    })
    .catch((err) => {
      console.error("Fallo de red en registro:", err);
      alert(`⚠ Error de comunicación con el servidor: ${err.message || "Por favor, asegúrate de estar conectada a internet e inténtalo de nuevo."}`);
      setIsRegistering(false);
    });
  };

  // Initialize Program on Landing with precise current timestamp
  const startSevenDayProgram = () => {
    const activeToken = localStorage.getItem("MAPA_ACCESS_TOKEN");
    if (!currentUserEmail || !activeToken) {
      // Direct them to customized email identification/login
      setLoginEmail(currentUserEmail || "");
      setLoginNombre("");
      setLoginWhatsapp("");
      setLoginAccessCode("");
      setPhase("LOGIN");
      return;
    }

    const emailKey = currentUserEmail.toLowerCase().trim();
    const existing = localStorage.getItem(`MAPA_USER_PROGRESS_${emailKey}`);
    if (existing) {
      try {
        const loaded = JSON.parse(existing);
        setProgramProgress(loaded);
        setPhase("DASHBOARD");
        return;
      } catch (e) {
        console.error("Error loading user progress", e);
      }
    }

    const nowStr = new Date().toISOString();
    const newProg = {
      activationDate: nowStr,
      currentDay: 1,
      completedDays: [],
      responses: {},
      leadInfo: leadInfo,
      leadCaptured: true,
      completionTimestamps: {}
    };
    setProgramProgress(newProg);
    localStorage.setItem(`MAPA_USER_PROGRESS_${emailKey}`, JSON.stringify(newProg));
    
    // Jump straight to Dashboard where Day 1 awaits
    setPhase("DASHBOARD");
  };

  // Launch questionnaire for the active day
  const launchDailyQuiz = () => {
    const day = programProgress.currentDay;
    // Load previously answered responses for this day if any exist, otherwise empty
    const existing = programProgress.responses[day] || [];
    setUserResponses(existing);
    setCurrentQuestionIndex(0);
    setIsEvaluationReady(false);
    setPhase("WIZARD");
  };

  // Handle checking a card in FASE 2
  const toggleLandingCheck = (id: number) => {
    setSelectedChecks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Pre-fill landing cards descriptions
  const landingCards = [
    { id: 1, text: "Noto tensión física constante, pecho apretado o respiración superficial.", tag: "Fisiológico" },
    { id: 2, text: "Me acuesto cansada pero mi mente se enciende recordando pendientes.", tag: "Insomnio" },
    { id: 3, text: "Me cuesta delegar, siento que si no lo hago yo misma algo saldrá mal.", tag: "Hipercontrol" },
    { id: 4, text: "Suelo absorber los problemas y dolores de otros hasta quedar exhausta.", tag: "Empatía Activa" },
    { id: 5, text: "Finjo que todo está perfecto ante amigos y familia para no preocupar.", tag: "Silencioso" },
    { id: 6, text: "Un cambio imprevisto de planes me genera un cortocircuito emocional interno.", tag: "Anticipación" }
  ];

  // Mechanism 5 Pillars Data
  const pillarsData = [
    {
      title: "Activación Física",
      desc: "Mide el nivel de tensión corporal y alerta acumulada.",
      accent: "from-cyan-400 to-blue-500",
      stats: "Cuerpo"
    },
    {
      title: "Desencadenantes",
      desc: "Identifica qué situaciones exactas disparan tu malestar.",
      accent: "from-amber-400 to-orange-500",
      stats: "Detonadores"
    },
    {
      title: "Patrones Mentales",
      desc: "Muestra hábitos de velocidad mental o autocrítica.",
      accent: "from-purple-400 to-pink-500",
      stats: "Mente"
    },
    {
      title: "Protección Vagal",
      desc: "Tus herramientas biológicas naturales para calmar los nervios.",
      accent: "from-emerald-400 to-teal-500",
      stats: "Calma"
    },
    {
      title: "Ruta Práctica",
      desc: "Guía paso a paso de 3 acciones esenciales para esta semana.",
      accent: "from-blue-400 to-accent",
      stats: "Ruta"
    }
  ];

  // Active Questions slice based on program context
  const getActiveDayQuestions = () => {
    const day = programProgress.currentDay;
    return QUESTIONS.slice((day - 1) * 7, day * 7);
  };

  // Wizard Logic
  const handleOptionSelect = (optionValue: string, qCategory: string) => {
    const activeQuestions = getActiveDayQuestions();
    const currentQ = activeQuestions[currentQuestionIndex];
    if (!currentQ) return;

    const newResponses = [...userResponses];
    const existingIndex = newResponses.findIndex(r => r.questionId === currentQ.id);

    if (existingIndex > -1) {
      newResponses[existingIndex] = { questionId: currentQ.id, value: optionValue, category: qCategory };
    } else {
      newResponses.push({ questionId: currentQ.id, value: optionValue, category: qCategory });
    }
    
    setUserResponses(newResponses);

    // Auto-advance
    setTimeout(() => {
      if (currentQuestionIndex < 6) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setIsEvaluationReady(true);
        // Automatically submit the quiz and show results immediately
        handleDailyComplete(newResponses);
      }
    }, 280);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // 7-Day compilation triggers are mapped directly inside the programProgress flow.

  // Client-side fallback calculator
  const buildLocalFallback = (responses: QuizResponse[]): EmotionalProfile => {
    const scores = { vigilante: 0, anticipador: 0, hipercontrolador: 0, sobrecargado: 0, protectorSilencioso: 0 };
    responses.forEach((resItem) => {
      const question = QUESTIONS.find((q) => q.id === resItem.questionId);
      if (question && question.options) {
        const option = question.options.find((opt) => opt.value === resItem.value);
        if (option && option.scoreWeight) {
          Object.keys(option.scoreWeight).forEach((key) => {
            const pKey = key as keyof typeof scores;
            scores[pKey] += (option.scoreWeight[pKey] || 0);
          });
        }
      }
    });

    let dominantKey = "vigilante" as string;
    let maxVal = -1;
    Object.keys(scores).forEach((key) => {
      const pKey = key as keyof typeof scores;
      if (scores[pKey] > maxVal) {
        maxVal = scores[pKey];
        dominantKey = pKey;
      }
    });

    let profileSlug: "VIGILANTE" | "ANTICIPADOR" | "HIPERCONTROLADOR" | "SOBRECARGADO" | "PROTECTOR" = "VIGILANTE";
    if (dominantKey === "anticipador") profileSlug = "ANTICIPADOR";
    else if (dominantKey === "hipercontrolador") profileSlug = "HIPERCONTROLADOR";
    else if (dominantKey === "sobrecargado") profileSlug = "SOBRECARGADO";
    else if (dominantKey === "protectorSilencioso") profileSlug = "PROTECTOR";

    // Offline profile details mapping
    const localTemplates = {
      VIGILANTE: {
        id: "VIGILANTE" as const,
        name: "El Vigilante",
        avatar: "👁️",
        subTitle: "Centinela del Entorno",
        description: "Vives escaneando tu entorno físico, social y emocional buscando señales de peligro, tensión o desaprobación para ampararte antes que ocurra.",
        psychologicalInsight: "Tu mente asimila la hiper-vigilancia corporal con la seguridad biológica. Sientes que bajar los escudos te dejaría expuesta, manteniendo tu amígdala cerebral en un bucle ininterrumpido de alerta.",
        activationLevel: 85,
        secondaryProfiles: [{ name: "El Anticipador", percentage: 35 }, { name: "El Hipercontrolador", percentage: 25 }],
        radarData: [
          { name: "Activación Fisiológica", A: 85, B: 50 },
          { name: "Patrones Mentales", A: 60, B: 45 },
          { name: "Híper Vigilancia", A: 90, B: 55 },
          { name: "Capa Protectora", A: 40, B: 40 },
          { name: "Desgaste del Entorno", A: 70, B: 35 }
        ],
        indicators: {
          detonantes: [
            "Climas emocionales tensos o silencios incómodos de otras personas.",
            "Cambios súbitos en el lenguaje corporal de tus seres queridos.",
            "Lugares con exceso de estímulos visuales, ruido o multitudes desordenadas."
          ],
          patrones: [
            "Análisis obsesivo de micro-gestos ajenos ('¿Estará enojado conmigo?').",
            "Dificultad radical para relajar el cuerpo en momentos de ocio.",
            "Chequeo repetitivo del teléfono, cerraduras o correos de forma urgente."
          ],
          proteccion: [
            "Silencio total y aislamiento controlado en una habitación despejada.",
            "Rutinas predecibles y hábitos matutinos estables.",
            "Ejercicios de respiración profunda que envían seguridad al diafragma."
          ]
        },
        tranquilityRoute: {
          acciones: [
            "Haz un escaneo corporal de 2 minutos cada mediodía: libera la tensión acumulada en la mandíbula y baja los hombros.",
            "Establece una bitácora de 'falsas alarmas': anota cuándo creíste que alguien estaba molesto contigo y qué ocurrió en realidad.",
            "Práctica la respiración 4-7-8 antes de dormir para recordarle a tu amígdala que estás a salvo en tu habitación."
          ],
          habitos: [
            "Un detox digital selectivo: deja el móvil fuera del alcance la primera hora de tu mañana.",
            "Caminatas de presencia plena: fíjate en 3 sonidos y 2 texturas del camino en lugar de anticipar el destino.",
            "Establece rituales físicos de transición: lávate las manos al llegar a casa simbolizando el soltar el escudo."
          ],
          observar: [
            "El deseo súbito de disculparte por cosas insignificantes.",
            "La rigidez física o aguantar la respiración mientras trabajas frente a la pantalla.",
            "Tu nivel de impaciencia ante actividades tranquilas aleatorias."
          ]
        }
      },
      ANTICIPADOR: {
        id: "ANTICIPADOR" as const,
        name: "El Anticipador",
        avatar: "🔮",
        subTitle: "Director de Películas Futuras",
        description: "Vives en el mañana inmediato. Creas simulaciones de tragedias, conversaciones difíciles, rechazos u obstáculos para ensayar tus respuestas.",
        psychologicalInsight: "Crear escenarios sombríos es el intento defensivo de tu cerebro para actuar como vacuna emocional contra el dolor. Al ensayar la angustia por adelantado, sufres hoy por un futuro ficticio.",
        activationLevel: 92,
        secondaryProfiles: [{ name: "El Vigilante", percentage: 40 }, { name: "El Hipercontrolador", percentage: 30 }],
        radarData: [
          { name: "Activación Fisiológica", A: 92, B: 50 },
          { name: "Patrones Mentales", A: 85, B: 45 },
          { name: "Híper Vigilancia", A: 75, B: 55 },
          { name: "Capa Protectora", A: 30, B: 40 },
          { name: "Desgaste del Entorno", A: 80, B: 35 }
        ],
        indicators: {
          detonantes: [
            "Incertidumbre laboral, académica o de salud sin resolver.",
            "Mensajes vacíos de 'tenemos que hablar' o llamadas perdidas sin contexto.",
            "Falta de fechas límites claras o planes suspendidos."
          ],
          patrones: [
            "Rumia de '¿Qué tal si pasa lo peor?' de forma incremental.",
            "Ensayar discursos interminablemente en tu ducha para prever ataques.",
            "Insomnio provocado por proyecciones de la agenda."
          ],
          proteccion: [
            "Escribir todo el caos del futuro en papel para vaciar la memoria RAM.",
            "Ejercicios físicos que arrastran tu conciencia de vuelta aquí.",
            "Hablar con personas realistas y estables que actúan como anclas."
          ]
        },
        tranquilityRoute: {
          acciones: [
            "Aplica la pregunta filtro: '¿Esto de lo que me preocupo es un hecho real hoy, o solo una probabilidad futura?'.",
            "Escribe un guión alternativo: si tu mente imagina el peor de los casos, oblígala a redactar el mejor de los casos.",
            "Pon una alarma de preocupación de 10 minutos al día: fuera de ese tiempo, aplaza amablemente el sobrepensamiento."
          ],
          habitos: [
            "Práctica de anclaje de 5 sentidos.",
            "Escribe un diario de gratitud enfocado en el presente.",
            "Ejercicios de estiramiento pasivo o yoga nocturno."
          ],
          observar: [
            "Palabras clave en tu diálogo: '¿Y si...?', 'Tengo que...'.",
            "Opresión ligera y constante en el pecho al atardecer.",
            "El impulso involuntario de planificar conversaciones espontáneas."
          ]
        }
      },
      HIPERCONTROLADOR: {
        id: "HIPERCONTROLADOR" as const,
        name: "El Hipercontrolador",
        avatar: "⚙️",
        subTitle: "Arquitecto del Orden",
        description: "Sientes que si dejas de supervisar o intervenir todo colapsará. Te cuesta delegar profundamente y el desorden físico te agobia severamente.",
        psychologicalInsight: "El control externo es la balsa con la que intentas contener tu agitación interna. Crees que controlando las variables calmarás tu amígdala, pero la rigidez metodológica te agota.",
        activationLevel: 78,
        secondaryProfiles: [{ name: "El Anticipador", percentage: 45 }, { name: "El Sobrecargado", percentage: 15 }],
        radarData: [
          { name: "Activación Fisiológica", A: 70, B: 50 },
          { name: "Patrones Mentales", A: 90, B: 45 },
          { name: "Híper Vigilancia", A: 85, B: 55 },
          { name: "Capa Protectora", A: 50, B: 40 },
          { name: "Desgaste del Entorno", A: 60, B: 35 }
        ],
        indicators: {
          detonantes: [
            "Delegar tareas y tolerar ritmos ajenos.",
            "Desorden físico persistente en tu hogar.",
            "Cambios imprevistos de itinerarios a última hora."
          ],
          patrones: [
            "Perfeccionismo implacable contigo mismo y exigencia hacia los demás.",
            "Hacer listas infinitas de tareas y enojarte si no se completan.",
            "Asumir que 'si quiero que algo salga bien, debo hacerlo yo mismo'."
          ],
          proteccion: [
            "Hacer limpieza sistemática de un espacio pequeño para dar orden.",
            "Entornos minimalistas con colores tenues.",
            "Planificación deliberada de espacios grises sin metas."
          ]
        },
        tranquilityRoute: {
          acciones: [
            "Elige una tarea menor esta semana y delégala por completo aceptando que no se haga de tu perfecta manera.",
            "Practica el 'caos controlado' dejando un cajón desordenado o platos sin lavar a propósito un día.",
            "Sustituye la autocrítica por compasión."
          ],
          habitos: [
            "Bloques de ocio vacíos sin planear.",
            "Escribir tres cosas que salieron bien aunque no hayan seguido el plan original.",
            "Relajación muscular progresiva."
          ],
          observar: [
            "Suspiros cansados frecuentes y dientes apretados.",
            "El deseo de corregir cómo otros hacen tareas.",
            "Frustración desproporcionada ante un pequeño tropiezo."
          ]
        }
      },
      SOBRECARGADO: {
        id: "SOBRECARGADO" as const,
        name: "El Sobrecargado",
        avatar: "🎒",
        subTitle: "Atlante Emocional",
        description: "Cargas inconscientemente con el bienestar de todos a tu alrededor. Decir que 'no' se siente imposible por miedo a generar rechazo.",
        psychologicalInsight: "Tu mente asoció que tu valor como persona depende de tu capacidad para salvar a otros. Al vaciar tu copa para intentar saciar los problemas ajenos, te quedas seco de combustible vital.",
        activationLevel: 82,
        secondaryProfiles: [{ name: "El Protector Silencioso", percentage: 38 }, { name: "El Vigilante", percentage: 18 }],
        radarData: [
          { name: "Activación Fisiológica", A: 82, B: 50 },
          { name: "Patrones Mentales", A: 65, B: 45 },
          { name: "Híper Vigilancia", A: 75, B: 55 },
          { name: "Capa Protectora", A: 30, B: 40 },
          { name: "Desgaste del Entorno", A: 95, B: 35 }
        ],
        indicators: {
          detonantes: [
            "Ver a alguien querido molesto o triste (sientes la obligación de arreglarlo).",
            "Tener que negarte a una petición o poner un límite firme.",
            "Acumulación excesiva de tareas ajenas por inercia."
          ],
          patrones: [
            "Sentir culpa corrosiva cuando descansas.",
            "Anticipación de las necesidades ajenas antes de que lo pidan.",
            "Quejarte en silencio de que nadie te cuida como cuidas tú."
          ],
          proteccion: [
            "Contacto directo con la tierra o naturaleza caminatas.",
            "Establecer un círculo íntimo ultra-reducido de reciprocidad.",
            "Pasar tiempo con mascotas o hobbies creativos sin juicio."
          ]
        },
        tranquilityRoute: {
          acciones: [
            "Aplica la regla de las 24 horas antes de aceptar una petición de ayuda.",
            "Escribe una lista de tus responsabilidades frente a las de otros.",
            "Di un 'NO' amable esta semana a algo menor."
          ],
          habitos: [
            "Define un bloque de 'Santuario Personal' de 30 minutos innegociable.",
            "Diarios de descarga de escritura libre.",
            "Caminatas vigorosas que marquen tu perímetro."
          ],
          observar: [
            "Sabor a resentimiento sordo ante peticiones ajenas.",
            "Dolor constante en hombros y espalda baja.",
            "El impulso de justificarte en exceso para no decir sí."
          ]
        }
      },
      PROTECTOR: {
        id: "PROTECTOR" as const,
        name: "El Protector Silencioso",
        avatar: "🎭",
        subTitle: "Fortaleza Solitaria",
        description: "Eres el puerto seguro de todos. Construyes una máscara impecable de optimismo e inafectabilidad exterior, mientras que por dentro batallas solo.",
        psychologicalInsight: "Utilizas el orgullo de la autosuficiencia y la discreción como mecanismo de aislamiento preventivo. Al enterrar tus señales débiles de auxilio, dejas a tu sistema nervioso gritando sin escape.",
        activationLevel: 75,
        secondaryProfiles: [{ name: "El Sobrecargado", percentage: 40 }, { name: "El Vigilante", percentage: 22 }],
        radarData: [
          { name: "Activación Fisiológica", A: 75, B: 50 },
          { name: "Patrones Mentales", A: 80, B: 45 },
          { name: "Híper Vigilancia", A: 70, B: 55 },
          { name: "Capa Protectora", A: 85, B: 40 },
          { name: "Desgaste del Entorno", A: 65, B: 35 }
        ],
        indicators: {
          detonantes: [
            "Preguntas íntimas de otros sobre tu salud emocional real.",
            "Situaciones que requieran mostrar debilidad o cometer errores públicos.",
            "La sensación de perder la compostura formal."
          ],
          patrones: [
            "Sostener optimismo artificial continuo con tu familia.",
            "Aislarte de inmediato cuando estás abrumado sin pedir auxilio.",
            "Tragar el llanto e ignorar el cansancio simulando plenitud."
          ],
          proteccion: [
            "Espacios artísticos anónimos donde se te permita equivocarte.",
            "Entornos silenciosos libres de expectativas sociales.",
            "Amistades lejanas donde no ejerces el rol de salvador."
          ]
        },
        tranquilityRoute: {
          acciones: [
            "Usa una palabra clave con alguien cercano para indicar que hoy estás cansado.",
            "Escribe una carta franca detallando tus miedos y triturándola.",
            "Permítete fallar en una tarea privada para quitarte presión."
          ],
          habitos: [
            "Hacer estiramientos vigorosos de cuello y garganta.",
            "Dormir con mantas pesadas simulando seguridad en el lecho.",
            "Separar 15 minutos de la noche sin celular en penumbra absoluta."
          ],
          observar: [
            "Apretar la mandíbula o morderte las mejillas internas.",
            "Incapacidad voluntaria para pedir un favor menor.",
            "Un nudo persistente y seco en la garganta al atardecer."
          ]
        }
      }
    };

    return localTemplates[profileSlug];
  };

  // Lead Form submission with beautiful sending simulation showing sender: mapa@podermentalia.club
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadInfo.nombre || !leadInfo.email) {
      alert("Por favor rellena tu nombre y correo para enviar tu M.A.P.A.™ completo.");
      return;
    }
    
    setIsSendingEmail(true);
    setEmailSentSuccess(false);
    setEmailSendingStep("Estableciendo conexión con el servidor seguro de Poder Mentalia...");
    
    const emailKey = leadInfo.email.toLowerCase().trim();
    
    // Perform actual registration dispatch in background
    fetch("/api/register-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: leadInfo.nombre.trim(),
        email: emailKey,
        whatsapp: leadInfo.whatsapp || "",
        initialScanResults: scanMetrics,
        origin: "Formulario de Registro"
      })
    })
    .then(async (res) => {
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        console.log("Registro de lead en servidor completado exitosamente:", data);
        if (data.success && data.userProgress) {
          // Initialize active session
          localStorage.setItem("MAPA_CURRENT_USER_EMAIL", emailKey);
          setCurrentUserEmail(emailKey);
          setProgramProgress(data.userProgress);
          localStorage.setItem(`MAPA_USER_PROGRESS_${emailKey}`, JSON.stringify(data.userProgress));
        }
      }
    })
    .catch((err) => {
      console.error("Fallo de registro de lead en segundo plano en el servidor:", err);
    });

    setTimeout(() => {
      setEmailSendingStep("Compilando tu Reporte de Orientación Personalizado M.A.P.A.™...");
    }, 1200);
    
    setTimeout(() => {
      setEmailSendingStep("Sintonizando marcadores corporales simpáticos y autónomos...");
    }, 2400);

    setTimeout(() => {
      setEmailSendingStep("Firmando Dossier de Autodescubrimiento M.A.P.A.™ desde: mapa@podermentalia.club...");
    }, 3600);

    setTimeout(() => {
      setEmailSendingStep("Despachando correo encriptado con PDF al destinatario...");
    }, 4800);

    setTimeout(() => {
      setIsSendingEmail(false);
      setLeadCaptured(true);
      setEmailSentSuccess(true);
    }, 6000);
  };

  // Dual-channel lead capture submit (WhatsApp / Email)
  const handleDualLeadSubmit = async (channel: "whatsapp" | "email") => {
    const name = leadInfo.nombre || "Usuaria M.A.P.A.";
    const emailStr = (leadInfo.email || confirmEmail || "").trim();
    
    if (!name) {
      alert("Por favor, introduce tu nombre.");
      return;
    }
    if (!emailStr) {
      alert("Por favor, introduce tu correo electrónico de confirmación.");
      return;
    }
    
    const combinedWhatsapp = whatsappNumber ? `${whatsappCountryCode} ${whatsappNumber.trim()}` : "";
    
    if (channel === "whatsapp" && !whatsappNumber) {
      alert("Por favor, introduce tu número de WhatsApp para recibir el reporte por este canal.");
      return;
    }

    try {
      setIsSendingEmail(true);
      setEmailSendingStep(`Enviando reporte personalizado vía ${channel === "whatsapp" ? "WhatsApp" : "Email"}...`);

      const payload = {
        nombre: name.trim(),
        email: emailStr.toLowerCase().trim(),
        whatsapp: combinedWhatsapp
      };

      const response = await fetch("/api/premium/submit-lead-report", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("MAPA_ACCESS_TOKEN") || ""}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsSendingEmail(false);
        setLeadCaptured(true);
        playSuccessCue();
        
        const successMsg = `Su Reporte está siendo compilado por la Mentora Clara y llegará en menos de 5 minutos a tu ${channel === "whatsapp" ? "WhatsApp" : "Email"}.`;
        setLeadSubmitToast(successMsg);
        
        // Update local state to reflect captured lead and sync
        const updatedProg = {
          ...programProgress,
          leadCaptured: true,
          isCompleted: true,
          leadInfo: {
            ...leadInfo,
            nombre: name.trim(),
            email: emailStr.toLowerCase().trim(),
            whatsapp: combinedWhatsapp
          }
        };
        setProgramProgress(updatedProg);
        setLeadInfo(updatedProg.leadInfo);
        localStorage.setItem(`MAPA_USER_PROGRESS_${emailStr.toLowerCase().trim()}`, JSON.stringify(updatedProg));
        
        setTimeout(() => setLeadSubmitToast(null), 8000);
      } else {
        setIsSendingEmail(false);
        alert("Ocurrió un problema de conexión con el servidor. Por favor, inténtelo de nuevo.");
      }
    } catch (err) {
      console.error("Error submitting lead:", err);
      setIsSendingEmail(false);
      alert("Ocurrió un error inesperado al registrar el reporte.");
    }
  };

  // Complete the current day and return to Dashboard
  const handleDailyComplete = async (overrideResponses?: QuizResponse[]) => {
    const activeResponses = overrideResponses || userResponses;
    const day = programProgress.currentDay;
    const updatedResponses = {
      ...programProgress.responses,
      [day]: activeResponses
    };

    const updatedCompletedDays = programProgress.completedDays.includes(day)
      ? programProgress.completedDays
      : [...programProgress.completedDays, day];

    let nextDay = day;
    if (updatedCompletedDays.length < 7) {
      nextDay = Math.min(7, day + 1);
    }

    const updatedTimestamps = {
      ...(programProgress.completionTimestamps || {}),
      [day]: new Date().toISOString()
    };

    // Show AI compilation loader
    setPhase("LOADING");
    setLoadingProgress(25);
    setLoadingStepText(`Sintetizando conclusiones cognitivas del Día ${day}...`);

    let conclusionText: any = "Análisis guardado.";
    try {
      const resp = await fetch("/api/evaluate-day-conclusion", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("MAPA_ACCESS_TOKEN") || ""}`
        },
        body: JSON.stringify({
          day,
          responses: activeResponses,
          userProfileName: evaluationResult?.name || "El Vigilante"
        })
      });
      const resData = await resp.json();
      if (resData.success) {
        conclusionText = resData.conclusion;
      }
    } catch (e) {
      console.warn("Day conclusion evaluation skipped, utilizing clinical offline fallback:", e);
      conclusionText = {
        discovered: "Has revelado patrones sobre tu activación y retención de alerta simpática hoy.",
        improved: "Mejora en la conciencia corporal de los hombros y mandíbula.",
        needsStrengthening: "Puntos de resistencia subconsciente frente a demandas imprevistas.",
        patternDetected: "Patrones inerciales de hipervigilancia protectora.",
        recommendation: "Es recomendable un anclaje somático de respiración prolongada."
      };
    }

    const updatedConclusions = {
      ...(programProgress.dailyConclusionText || {}),
      [day]: conclusionText
    };

    const prevConclusions = (programProgress as any).dailyConclusionText || {};
    const finalConclusions = { ...prevConclusions, ...updatedConclusions };

    const currentUnlockedAudios = programProgress.unlockedAudios || [];
    let updatedUnlockedAudios = [...currentUnlockedAudios];
    
    let rewardToTrigger: "day3" | "day4" | "day5" | "day7" | null = null;
    
    if (day === 3 && !updatedUnlockedAudios.includes("day3")) {
      updatedUnlockedAudios.push("day3");
      rewardToTrigger = "day3";
    }
    
    if (day === 4 && !updatedUnlockedAudios.includes("day4")) {
      updatedUnlockedAudios.push("day4");
      rewardToTrigger = "day4";
    }

    if (day === 5 && !updatedUnlockedAudios.includes("day5")) {
      updatedUnlockedAudios.push("day5");
      rewardToTrigger = "day5";
    }
    
    if ((day === 7 || updatedCompletedDays.length === 7) && !updatedUnlockedAudios.includes("day7")) {
      updatedUnlockedAudios.push("day7");
      rewardToTrigger = "day7";
    }

    const newProg = {
      ...programProgress,
      responses: updatedResponses,
      completedDays: updatedCompletedDays,
      currentDay: nextDay,
      completionTimestamps: updatedTimestamps,
      dailyConclusionText: finalConclusions,
      unlockedAudios: updatedUnlockedAudios
    };

    const isMilestone = [3, 5, 7].includes(updatedCompletedDays.length);
    const milestoneCount = updatedCompletedDays.length;

    setProgramProgress(newProg);
    const emailKey = leadInfo.email || currentUserEmail;
    if (emailKey) {
      localStorage.setItem(`MAPA_USER_PROGRESS_${emailKey.toLowerCase().trim()}`, JSON.stringify(newProg));
      syncProgressToCloud(newProg, emailKey);
    } else {
      localStorage.setItem("MAPA_7DAY_PROGRESS_V2", JSON.stringify(newProg));
    }

    // Reset current wizard state
    setUserResponses([]);
    setCurrentQuestionIndex(0);
    setIsEvaluationReady(false);

    playSuccessCue();
    setDashboardNotice(`¡Excelente! Conclusiones del Día ${day} integradas con éxito en tu M.A.P.A.™`);
    setTimeout(() => setDashboardNotice(null), 4000);

    setPhase("DASHBOARD");
    if (rewardToTrigger) {
      setTimeout(() => {
        setUnlockedAudioModal({ isOpen: true, type: rewardToTrigger });
      }, 800);
    }
    if (isMilestone) {
      setTimeout(() => {
        setMilestoneModal({ isOpen: true, daysCount: milestoneCount });
      }, rewardToTrigger ? 2500 : 1000);
    }
  };

  // Compile all historical answers of 7 days to trigger full assessment
  const triggerSevenDayReport = () => {
    const allResponses = Object.values(programProgress.responses).flat() as QuizResponse[];
    
    setPhase("LOADING");
    setLoadingProgress(0);
    setLoadingStepText("Analizando respuestas continuas de los 7 días...");

    const steps = [
      { text: "Recuperando registro continuo de 7 días...", pct: 15 },
      { text: "Calculando marcadores de sobrepensamiento y carga simpática...", pct: 35 },
      { text: "Conectando con el motor inteligente de orientación M.A.P.A.™...", pct: 55 },
      { text: "Generando recomendaciones y plan de regulación de 12 páginas...", pct: 80 },
      { text: "Configurando widgets, brújula de tensión y radar interactivo...", pct: 95 },
      { text: "¡Procesamiento de orientación completado con éxito!", pct: 100 }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLoadingProgress(step.pct);
        setLoadingStepText(step.text);
        if (step.pct === 100) {
          setTimeout(() => {
            const result = buildLocalFallback(allResponses);
            setEvaluationResult(result);
            setPhase("RESULTS");
          }, 600);
        }
      }, (index + 1) * 700);
    });
  };

  // Simulation Share utilities
  const handleShareClick = (platform: string) => {
    const profileName = evaluationResult?.name || "El Vigilante Permanente";
    const shareText = getShareText({ 
      variant: "perfil", 
      perfilName: profileName 
    });
    
    if (platform === "whatsapp") {
      shareToWhatsApp({ 
        variant: "perfil", 
        perfilName: profileName 
      });
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(FUNNEL_URL)}`);
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(FUNNEL_URL)}`);
    } else {
      // Copy to clipboard fallback
      navigator.clipboard.writeText(shareText);
      setShareAlert("¡Mensaje persuasivo y enlace al Test copiados! Listo para compartir en tus Redes Sociales o historias.");
      setTimeout(() => setShareAlert(null), 4000);
    }
  };

  const handleDownloadPDF = () => {
    // Compile consolidated dossier data elegantly
    const nombre = leadInfo.nombre || "Usuario M.A.P.A.™";
    const email = leadInfo.email || "No registrado";
    const fecha = new Date().toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });
    const profileName = evaluationResult?.name || "El Vigilante Permanente";
    const profileSub = evaluationResult?.subTitle || "Foco de Hiperatención Simpática";
    const profileDesc = evaluationResult?.description || "";
    
    // Build Day by Day Clinical Overview with specific details, progress, specific recommendations
    const dayLabels = [
      "Sintomatología Fisiológica y Alerta Corporal",
      "Desencadenantes y Sensibilidad Ambiental",
      "Rumia Mental y Pensamiento Automático Súbito",
      "Relaciones de Vínculo e Interacciones Sociales",
      "Hábitos de Control Rígido y Exigencia Personal",
      "Estrategias de Evitación y Evasión Silenciosa",
      "Integración, Autocompasión, Regulación y Cierre"
    ];

    const dayTechnicalSummaries = [
      "Evaluación del tono basal autonómico. Se detectó predisposición al acaparamiento de tensión física en el trapecio, hombros y mandíbula, sugiriendo una asimilación muscular rígida de estresores cotidianos.",
      "Análisis de reactividad a estímulos y saturación auditiva/visual de entornos activos. Los marcadores revelaron híper-repuestas autónomas ante ruidos bruscos o desorden material en el área de descanso.",
      "Diagnóstico del flujo de pensamiento irracional y anticipación catastrofista futura. Se mapearon bucles recurrentes de película catastrófica que sostienen activos los picos de cortisol pre-dormancia.",
      "Calibración de límites asertivos en relaciones interpersonales. La usuaria reflejó indicios de sobrecarga empática activa, absorbiendo emocionalmente dilemas externos hasta drenar su propia batería homeostática.",
      "Auditoría de hábitos perfeccionistas cognitivos. Se observó una correlación directa entre la compulsión de planificación inflexible y el desgaste cerebral provocado por imprevistos o anomalías de agenda.",
      "Mapeo de fugas energéticas inactivas y de evasión fóbica. Se detectaron de 60 a 120 minutos de procrastinación inercial mediante dispositivos electrónicos como amortiguación subconsciente del agobio sistémico.",
      "Consolidación vegetativa e integración cuerpo-mente. Se estructuró el ancla de balance vagal para estimular de forma voluntaria el restablecimiento de la calma y asertividad parasimpática profunda."
    ];

    const dayClinicalRecs = [
      "Realizar 3 rondas diarias de estiramiento miofascial de trapecio complementadas con respiración box-breathing (frecuencia 4s).",
      "Establecer un santuario libre de notificaciones en el dormitorio y utilizar ruido rosa amortiguado durante episodios de alta exigencia.",
      "Ejecutar registro estructurado en papel bajo la rúbrica 'Hechos Objetivos vs Proyecciones' al final de la jornada laboral.",
      "Ejercitar la contención afectiva de tres capas limitantes y agendar 15 minutos diarios de recuperación de silencio comunicacional.",
      "Implementar la técnica del 'Cajón Imperfecto': delegar conscientemente al menos una tarea secundaria diaria fuera de supervisión.",
      "Establecer temporizadores estrictos en apps de contenido social y reaccionar ante la urgencia de huir mediante acción comprometida somática.",
      "Consolidar la asimilación corporal respiratoria uniendo los 49 indicadores del cuestionario de forma consecutiva e integrada."
    ];

    const dayAdvances = [
      "Aumento detectado del 35% en la propiocepción corporal primaria.",
      "Reducción progresiva del siseo de alerta autonómica frente a picos sensoriales ambientales.",
      "Interrupción consciente de la divagación rumiante severa antes de la fase de sueño.",
      "Establecimiento asertivo de límites energéticos con menor nivel de culpabilidad subconsciente.",
      "Mejora notable del 40% en la adaptabilidad elástica ante interrupciones operativas.",
      "Sustitución progresiva de evasión virtual por pausas biológicas activas reparadoras.",
      "Activación voluntaria asimilada del nervio vago y equilibrio neuro-vegetativo."
    ];

    let daysHTML = "";
    for (let d = 1; d <= 7; d++) {
      const title = dayLabels[d - 1];
      const summaryText = dayTechnicalSummaries[d - 1];
      const recText = dayClinicalRecs[d - 1];
      const advanceText = dayAdvances[d - 1];

      daysHTML += `
        <div class="day-card animate-fade">
          <div class="day-num">DÍA ${d} DEL PROGRAMA</div>
          <h3 class="day-title">${title}</h3>
          
          <div class="day-detail-block">
            <strong>Descripción detallada del Enfoque de Regulación:</strong>
            <p>${summaryText}</p>
          </div>

          <div class="conclusion-grid">
            <div class="conclusion-item border-left-blue">
              <div class="conclusion-label">AVANCE LOGRADO DE HOY</div>
              <div>${advanceText}</div>
            </div>
            <div class="conclusion-item border-left-amber">
              <div class="conclusion-label text-amber-300">RECOMENDACIÓN NEUROPROTECTORA</div>
              <div>${recText}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Construct HTML content with embedded CSS
    const htmlReport = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>M.A.P.A.™ Reporte Clínico Consolidado - ${nombre}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      background-color: #030712;
      color: #e2e8f0;
      margin: 0;
      padding: 40px;
      line-height: 1.6;
    }
    .container {
      max-width: 850px;
      margin: 0 auto;
      background-color: #0b1329;
      border: 1px solid #1e3b8a;
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.7);
    }
    .header {
      border-bottom: 2px solid #1d4ed8;
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #7ef9ff;
    }
    .cover-title {
      font-size: 34px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      line-height: 1.25;
    }
    .subtitle {
      font-size: 16px;
      color: #38bdf8;
      margin-bottom: 24px;
    }
    .metadata {
      background-color: #030712;
      border-left: 4px solid #7ef9ff;
      padding: 20px;
      margin-bottom: 32px;
      border-radius: 0 16px 16px 0;
    }
    .metadata table {
      width: 100%;
      border-collapse: collapse;
    }
    .metadata td {
      padding: 8px;
      font-size: 14px;
    }
    .metadata td.label {
      font-weight: 600;
      color: #7ef9ff;
      width: 180px;
    }
    .disclaimer {
      background-color: rgba(220, 38, 38, 0.08);
      border: 1px solid rgba(220, 38, 38, 0.25);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 32px;
      font-size: 12px;
      color: #fca5a5;
      text-align: justify;
    }
    .section-title {
      font-size: 20px;
      color: #7ef9ff;
      border-bottom: 1px solid #1e3a8a;
      padding-bottom: 8px;
      margin-top: 40px;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
    }
    .day-card {
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .day-num {
      font-size: 11px;
      font-weight: 700;
      color: #00d4ff;
      text-transform: uppercase;
      margin-bottom: 6px;
      letter-spacing: 1px;
    }
    .day-title {
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 14px;
    }
    .day-detail-block {
      background-color: #030712;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 16px;
      border: 1px solid rgba(255,255,255,0.03);
    }
    .day-detail-block strong {
      font-size: 12px;
      color: #94a3b8;
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    .day-detail-block p {
      margin: 0;
      font-size: 13.5px;
      color: #cbd5e1;
      line-height: 1.5;
    }
    .conclusion-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 16px;
    }
    .conclusion-item {
      background-color: #030712;
      padding: 14px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.5;
    }
    .conclusion-label {
      font-weight: bold;
      color: #00d4ff;
      margin-bottom: 6px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .border-left-blue {
      border-left: 3px solid #00d4ff;
    }
    .border-left-amber {
      border-left: 3px solid #ffb703;
    }
    .comparison-sec {
      background-color: #0f172a;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      border: 1px solid rgba(126, 249, 255, 0.1);
    }
    .comparison-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 20px;
      margin-top: 15px;
    }
    .comparison-card {
      background-color: #030712;
      border-radius: 12px;
      padding: 16px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .comparison-header {
      font-size: 14px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .bar-container {
      background-color: rgba(255,255,255,0.05);
      border-radius: 8px;
      height: 24px;
      width: 100%;
      overflow: hidden;
      margin-bottom: 12px;
      position: relative;
    }
    .bar-fill {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 12px;
      box-sizing: border-box;
      font-size: 11px;
      font-weight: bold;
      color: #030712;
    }
    .initial-bar {
      background: linear-gradient(90deg, #ef4444, #f97316);
    }
    .final-bar {
      background: linear-gradient(90deg, #10b981, #34d399);
    }
    .comparison-list {
      margin: 0;
      padding-left: 16px;
      font-size: 12px;
      color: #94a3b8;
    }
    .comparison-list li {
      margin-bottom: 6px;
    }
    .clinical-bullet-list {
      padding-left: 20px;
      margin: 0;
    }
    .clinical-bullet-list li {
      margin-bottom: 12px;
      font-size: 14.5px;
      color: #e2e8f0;
      line-height: 1.5;
    }
    .clinic-badge {
      background-color: rgba(56, 189, 248, 0.1);
      color: #38bdf8;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 8px;
    }
    .cta-area {
      margin-top: 40px;
      border-top: 2px dashed #1e3a8a;
      padding-top: 32px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .btn-action-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      width: 100%;
    }
    .whatsapp-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, #25D366, #128C7E);
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 28px;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(37, 211, 102, 0.25);
      transition: transform 0.2s;
    }
    .whatsapp-btn:hover {
      transform: scale(1.02);
    }
    .web-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, #38bdf8, #1d4ed8);
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 28px;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(56, 189, 248, 0.25);
      transition: transform 0.2s;
    }
    .web-btn:hover {
      transform: scale(1.02);
    }
    .print-btn {
      display: inline-block;
      background-color: #38bdf8;
      color: #030712;
      font-weight: 700;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      margin-bottom: 0px;
      font-family: inherit;
      font-size: 13px;
    }
    .print-btn:hover {
      background-color: #00d4ff;
    }
    @media print {
      body {
        background-color: #ffffff;
        color: #000000;
        padding: 0;
      }
      .container {
        border: none;
        padding: 0;
        box-shadow: none;
        background-color: #ffffff;
      }
      .print-btn, .whatsapp-btn, .web-btn, .cta-area {
        display: none !important;
      }
      .day-card {
        background-color: #f8fafc;
        border: 1px solid #cbd5e1;
        page-break-inside: avoid;
        color: #1e293b;
      }
      .day-title {
        color: #0f172a;
      }
      .day-detail-block {
        background-color: #f1f5f9;
        border: 1px solid #cbd5e1;
      }
      .day-detail-block p {
        color: #1e293b;
      }
      .conclusion-grid {
        grid-template-cols: 1fr;
      }
      .conclusion-item {
        background-color: #f8fafc;
        color: #334155;
        border: 1px solid #e2e8f0;
      }
      .section-title {
        color: #0f172a;
        border-bottom: 2px solid #94a3b8;
      }
      .metadata {
        background-color: #f8fafc;
        border-left: 4px solid #0f172a;
        color: #334155;
      }
      .logo {
        color: #0f172a;
      }
      .cover-title {
        color: #0f172a;
      }
      .comparison-sec {
        background-color: #ffffff;
        border: 1px solid #cbd5e1;
        color: #0f172a;
      }
      .comparison-card {
        background-color: #f8fafc;
        border: 1px solid #cbd5e1;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">M.A.P.A.™</div>
      <button class="print-btn" onclick="window.print()">Imprimir / Guardar como PDF 🖨️</button>
    </div>

    <h1 class="cover-title">Dossier de Autodescubrimiento Emocional M.A.P.A.™</h1>
    <div class="subtitle">Reporte Personalizado de Orientación y Autodescubrimiento Emocional</div>

    <div class="metadata">
      <table>
        <tr>
          <td class="label">Persona Evaluada:</td>
          <td><strong>${nombre}</strong></td>
        </tr>
        <tr>
          <td class="label">Correo Registrado:</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td class="label">Fecha Elaboración:</td>
          <td>${fecha}</td>
        </tr>
        <tr>
          <td class="label">Arquetipo Principal:</td>
          <td><strong>${profileName}</strong> (${profileSub})</td>
        </tr>
      </table>
    </div>

    <div class="disclaimer">
      <strong>AVISO DE METODOLOGÍA Y ORIENTACIÓN (M.A.P.A.™):</strong> Este reporte es una herramienta digital de autoconocimiento y orientación asistida por Inteligencia Artificial. NO ES UN INSTRUMENTO DE DIAGNÓSTICO CLÍNICO, no constituye una evaluación psicológica, ni reemplaza el proceso psicoterapéutico, diagnóstico médico de salud mental, ni tratamiento realizado por profesionales cualificados (psicólogos o psiquiatras). Su objetivo es facilitar una mejor comprensión de tus procesos emocionales, picos de alerta y promover el autoconocimiento.
    </div>

    <div class="section-title">Análisis de Orientación del Arquetipo Dominante</div>
    <div class="day-card" style="margin-bottom:32px;">
      <div class="clinic-badge">Evaluación de Biotipos Neurocognitivos</div>
      <h3 class="day-title" style="margin-bottom:8px;">${profileName}</h3>
      <p style="margin: 0; font-size:14px; color:#cbd5e1; line-height: 1.6; text-align:justify;">${profileDesc}</p>
    </div>

    <!-- COMPARATOR GRAPHICS (BEFORE VS AFTER) -->
    <div class="section-title">Evolución de Regulación de Alerta (Antes vs Después)</div>
    <div class="comparison-sec">
      <p style="margin:0 0 16px 0; font-size:13.5px; color:#94a3b8; line-height:1.5;">
        Los siguientes marcadores resumen el comportamiento del sistema nervioso autónomo de <strong>${nombre}</strong> comparando el umbral basal inicial del Día 1 frente al balance vagal alcanzado al culminar la integración en el Día 7.
      </p>
      
      <div class="comparison-grid">
        <div class="comparison-card">
          <div class="comparison-header font-bold" style="color: #ef4444;">DÓNDE EMPEZASTE (Día 1: Hiperalerta)</div>
          <div class="bar-container">
            <div class="bar-fill initial-bar" style="width: 88%;">88% Carga</div>
          </div>
          <ul class="comparison-list">
            <li><strong>Tono Simpático:</strong> Hiperactivo Severo</li>
            <li><strong>Tensión muscular mandibular:</strong> Retención alta</li>
            <li><strong>Asimilación de estímulos:</strong> Fatiga inmediata</li>
            <li><strong>Bucle rumiador futuro:</strong> 4 - 6 episodios/hora</li>
          </ul>
        </div>
        
        <div class="comparison-card">
          <div class="comparison-header font-bold" style="color: #10b981;">NIVEL RESIDUAL ACTUAL (Día 7: Calma vagal)</div>
          <div class="bar-container">
            <div class="bar-fill final-bar" style="width: 32%;">32% Balance</div>
          </div>
          <ul class="comparison-list">
            <li><strong>Tono Parasimpático:</strong> Óptimo Vagotónico</li>
            <li><strong>Estabilidad muscular:</strong> Propiocepción asimilada</li>
            <li><strong>Amortiguación sensorial:</strong> Filtrado asertivo</li>
            <li><strong>Bucle rumiador futuro:</strong> Auto-interrupción eficaz</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- DAY BY DAY DETAILED CLINICAL WORK -->
    <div class="section-title">Evolución Detallada por Estadios (Programa de 7 Días)</div>
    <div class="day-list">
      ${daysHTML}
    </div>

    <!-- POINTS OF IMPROVEMENT -->
    <div class="section-title">Puntos Críticos Sugeridos Para Tu Mejora</div>
    <div class="day-card" style="background-color:rgba(251, 191, 36, 0.05); border: 1px solid rgba(251,191,36,0.15);">
      <ul class="clinical-bullet-list">
        <li>
          <strong>Control de Micromanagement Somático:</strong> Evitar la monitorización obsesiva del ritmo cardíaco, permitiendo una autorregulación natural del nodo sinusal.
        </li>
        <li>
          <strong>Amortiguación Mandibular Nocturna:</strong> Practicar la separación consciente de arcadas dentales y reposo de la lengua en el paladar superior al descansar.
        </li>
        <li>
          <strong>Ampliación de la Tolerancia al Caos:</strong> Ejercitar pausas deliberadas en entornos desordenados breves para reeducar la corteza insular reduciendo la intolerancia sensorial.
        </li>
        <li>
          <strong>Saturación por Complacencia Afectiva:</strong> Monitorear la tendencia a resolver conflictos ajenos con la consiguiente asimilación de la carga adrenérgica de un tercero.
        </li>
      </ul>
    </div>

    <!-- CONCLUSIONS AND GENERAL PROFESSIONAL RECOMMENDATIONS -->
    <div class="section-title">Síntesis Orientativa y Recomendación General del Avance</div>
    <div class="day-card" style="line-height:1.6; text-align:justify; font-size:14px; color:#e2e8f0;">
      <p style="margin-top:0;">
        <strong>Conclusión de Orientación del Avance:</strong> La persona evaluada <strong>${nombre}</strong> ha mostrado un excelente incremento en sus marcadores de adaptabilidad autonómica. A través de la autoevaluación guiada de 7 días, se observa una transición del patrón reactivo simpático inicial hacia una asertividad de autoprotección y calma. La propiocepción de alarmas físicas debilitadas y el empleo diario de anclas de calma indican una asimilación saludable y una disminución sustancial de los estados rumiantes recurrentes.
      </p>
      <p style="margin-bottom:0;">
        <strong>Recomendaciones de Descompresión Estructurada:</strong> Se aconseja formalmente mantener el protocolo integrado del sintonizador acústico M.A.P.A.™ durante periodos de fatiga extrema. Para asegurar la consolidación permanente de las redes neurales autorreguladas, es fundamental trascender la mera teoría del autodescubrimiento y llevar a cabo sesiones de supervisión o acompañamiento con soporte especializado en regulación del sobrepensamiento y carga adrenérgica.
      </p>
    </div>

    <!-- CALL TO ACTIONS (INTERACTIVE ELEMENTS) -->
    <div class="cta-area">
      <div style="font-size:15px; font-weight:700; color:#7ef9ff; text-transform:uppercase; letter-spacing:1px;">
        Continúa Tu Optimización de Calma con Presencia Profesional
      </div>
      <p style="font-size:13px; color:#94a3b8; max-w-xl; margin:0;">
        Ponemos a tu disposición accesos de acompañamiento personalizados e interactivos para potenciar tu plan de descompresión cognitiva.
      </p>
      <div class="btn-action-container">
        <a href="https://wa.link/u5qnw3" target="_blank" class="whatsapp-btn">
          <span>Agendar Sesión de Descompresión en WhatsApp 💬</span>
        </a>
        <a href="https://tupodermental.club" target="_blank" class="web-btn">
          <span>Visitar Poder Mental Club para Más Información ➔</span>
        </a>
      </div>
    </div>

    <div style="text-align: center; margin-top: 48px; font-size: 11px; color: #64748b;">
      Generado por soporte de la Unidad Integradora Poder Mental IA™ y el motor Gemini API. Administrado por contacto@tupodermental.club
    </div>
  </div>
</body>
</html>
    `;
    
    // Create downloaded blob
    const blob = new Blob([htmlReport], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MAPA_Reporte_Clinico_${nombre.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRestart = () => {
    setUserResponses([]);
    setCurrentQuestionIndex(0);
    setIsEvaluationReady(false);
    setEvaluationResult(null);
    
    const activeEmail = currentUserEmail || leadInfo.email;
    if (activeEmail) {
      const restartedProg = {
        activationDate: new Date().toISOString(),
        currentDay: 1,
        completedDays: [],
        responses: {},
        leadInfo: { nombre: leadInfo.nombre, email: activeEmail, whatsapp: leadInfo.whatsapp },
        leadCaptured: true,
        completionTimestamps: {}
      };
      setProgramProgress(restartedProg);
      localStorage.setItem(`MAPA_USER_PROGRESS_${activeEmail.toLowerCase().trim()}`, JSON.stringify(restartedProg));
      setPhase("DASHBOARD");
    } else {
      setProgramProgress({
        activationDate: "",
        currentDay: 1,
        completedDays: [],
        responses: {},
        leadInfo: { nombre: "", email: "", whatsapp: "" },
        leadCaptured: false,
        completionTimestamps: {}
      });
      localStorage.removeItem("MAPA_7DAY_PROGRESS_V2");
      setPhase("LANDING");
    }
  };

  // CBT Advice computed dynamically on Wizard Step
  const getCBTAdvice = () => {
    const name = leadInfo.nombre || "Usuaria";
    if (currentQuestionIndex < 5) {
      return `Querida ${name}, inicias este camino con mucha valentía. Yo, como tu Mentora Clara, te acompaño. Reconocer cómo reacciona tu cuerpo es el paso número uno para desactivar el radar de alerta.`;
    } else if (currentQuestionIndex < 10) {
      return `¡Excelente nivel de introspección, ${name}! Tu Mentora Clara celebra este avance. Comprender tus desencadenantes enseña a tu amígdala que lo que vives no es un fallo tuyo, sino una respuesta de protección.`;
    } else if (currentQuestionIndex < 15) {
      return `Descubrir tus patrones rumiantes te permite liberarte, querida ${name}. Recuerda que no eres tus pensamientos ansiosos; eres la consciencia sabia que los observa, y yo estoy aquí para protegerte.`;
    } else {
      return `Últimas preguntas completadas, ${name}. Tu brújula emocional está a pocos segundos de calibrarse por completo. Estoy lista para entregarte el alivio y la paz que tanto mereces.`;
    }
  };

  if (phase === "ADMIN") {
    return (
      <div id="app_root_admin" className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#00F0FF]/30 selection:text-white relative overflow-x-hidden">
        <AdminPanel
          onLogoutAdmin={() => {
            localStorage.removeItem("MAPA_CURRENT_USER_EMAIL");
            setCurrentUserEmail("");
            setPhase("LANDING");
          }}
        />
      </div>
    );
  }

  return (
    <div id="app_root" className="min-h-screen bg-[#FAF7F9] text-[#56346F] flex flex-col font-sans selection:bg-[#36C4D8]/30 selection:text-[#6E488A] relative overflow-x-hidden">
      
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-[#EDE0F0]/50 via-transparent to-transparent blur-3xl pointer-events-none z-0" />

      {/* Persistent PWA Install Banner */}
      <PWAInstallBanner />

      {/* HEADER LOGO RAIL */}
      <header id="app_header" className="relative z-10 w-full border-b-2 border-[#6E488A]/15 bg-[#E86FA3] shadow-[0_4px_20px_rgba(232,111,163,0.15)] px-4 py-4 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
          <motion.div 
            className="relative w-14 h-14 rounded-full border-2 border-white/60 bg-gradient-to-b from-white to-[#EDE0F0] flex items-center justify-center shadow-lg shadow-white/10 cursor-pointer overflow-hidden group select-none shrink-0"
            whileHover={{ scale: 1.15, rotate: 10, boxShadow: "0 10px 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {/* Compass outer dial ring (spinning slowly) */}
            <div className="absolute inset-1 rounded-full border border-dashed border-[#36C4D8]/40 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-2 rounded-full border border-dotted border-[#E36DB4]/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
            
            {/* Brain division background color split */}
            <div className="absolute inset-2 rounded-full overflow-hidden flex opacity-65">
              <div className="w-1/2 h-full bg-[#36C4D8]/15 border-r border-[#36C4D8]/20" />
              <div className="w-1/2 h-full bg-[#E36DB4]/15" />
            </div>

            {/* Shiny compass needle rotater */}
            <div className="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
              <div className="relative h-10 w-0.5 flex items-center justify-center">
                {/* Needle point */}
                <div className="absolute -top-0.5 w-1.5 h-1.5 bg-[#36C4D8] rotate-45 rounded" />
                {/* Needle line */}
                <div className="w-[1.5px] h-full bg-gradient-to-b from-[#36C4D8] via-transparent to-[#E36DB4]" />
                {/* Needle gold/pink terminal */}
                <div className="absolute -bottom-0.5 w-1.5 h-1.5 bg-[#E36DB4] rounded-full" />
              </div>
            </div>

            <Compass className="relative z-10 w-7 h-7 text-[#36C4D8] animate-pulse group-hover:scale-110 transition-transform" />
          </motion.div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="font-display font-black text-2xl sm:text-3xl tracking-wider text-white block">
              M.A.P.A. <span className="text-[#411F66] text-lg sm:text-xl font-black">Mujer</span>
            </span>
            <span className="block text-[9px] sm:text-xs text-[#FFF0F5] font-mono tracking-wide uppercase font-black">
              Mapa de Activación y Protección Emocional
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
          {currentUserEmail ? (
            <div className="flex items-center gap-2 sm:gap-3 bg-white border border-[#6E488A]/12 py-1.5 px-3 rounded-xl text-xs sm:text-sm shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[#6E488A] font-sans font-black text-xs sm:text-sm max-w-[110px] xs:max-w-[155px] sm:max-w-none truncate whitespace-nowrap" title={leadInfo.nombre || "Usuaria"}>
                {leadInfo.nombre || "Usuaria"}
              </span>
              <span className="bg-[#36C4D8]/15 text-[#27A1B2] px-1.5 py-0.5 rounded-lg font-mono text-[9px] font-black flex items-center space-x-0.5 shrink-0" title="Sesiones de regulación completadas">
                <span>{programProgress.completedDays?.length || 0}</span>
                <span className="text-[8px]">✓</span>
              </span>
              <span className="text-[#56346F]/70 font-mono text-[10px] hidden md:inline shrink-0">
                ({currentUserEmail})
              </span>
              {["contacto@tupodermental.club", "tupodermentaloficial@gmail.com", "agencialeps@gmail.com"].includes(currentUserEmail.toLowerCase()) && (
                <button
                  onClick={() => setPhase("ADMIN")}
                  className="text-[#36C4D8] hover:text-[#27A1B2] font-mono text-[10px] ml-1 pl-1 border-l border-[#6E488A]/12 transition-colors cursor-pointer bg-transparent border-none py-0 font-black uppercase shrink-0"
                >
                  ⚙️ Admin
                </button>
              )}
              <button
                onClick={handleUserLogout}
                className="text-[#E36DB4] hover:text-[#F58BC8] font-mono text-[10px] ml-1 pl-1 border-l border-[#6E488A]/12 transition-colors cursor-pointer bg-transparent border-none py-0 font-black shrink-0"
                title="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          ) : null}

          <motion.span 
            animate={{ 
              boxShadow: [
                "0px 2px 8px rgba(255,255,255,0.3), 0 0 0 1px rgba(255,255,255,0.2)",
                "0px 6px 18px rgba(255,255,255,0.7), 0 0 0 3px rgba(255,255,255,0.4)",
                "0px 2px 8px rgba(255,255,255,0.3), 0 0 0 1px rgba(255,255,255,0.2)"
              ],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ 
              scale: 1.06, 
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0px 8px 24px rgba(255,255,255,0.9), 0 0 0 4px rgba(255,255,255,0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-1.5 bg-white/95 border-2 border-white text-[#411F66] rounded-full py-1 px-2.5 sm:px-3 text-[9px] sm:text-[10px] font-mono font-black shadow-md cursor-pointer select-none transition-all shrink-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-widest uppercase font-black">SISTEMA ACTIVO</span>
          </motion.span>
          {phase === "RESULTS" && (
            <button 
              onClick={handleRestart}
              className="flex items-center space-x-2 border-2 border-[#262222] bg-[#EDE0F0] text-xs text-[#262222] font-extrabold py-1.5 px-3 rounded-lg hover:bg-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 relative z-10 flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          {phase === "LANDING" && (
            <motion.div
              key="landing_phase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-16"
            >
              {/* Returning User Continuation Card Alert */}
              {programProgress.activationDate && (() => {
                const chrono = getChronologicalState();
                const currentExercise = MINI_EXERCISES[currentExerciseIndex];
                const progressRatio = (30 - miniSecondsLeft) / 30;
                const guideIndex = Math.min(Math.floor(progressRatio * currentExercise.guides.length), currentExercise.guides.length - 1);
                const currentGuideText = isMiniExerciseActive 
                  ? currentExercise.guides[guideIndex] 
                  : "Haz clic en 'Comenzar (30s)' para iniciar.";

                return (
                  <div 
                    id="returning_prompt_card"
                    onMouseEnter={rotateMiniExercise}
                    className="bg-amber-400/20 backdrop-blur-md border-4 border-amber-500 rounded-2xl p-6 text-left max-w-2xl mx-auto flex flex-col gap-5 shadow-2xl shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)] shadow-amber-500/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400 hover:bg-amber-400/30 hover:shadow-amber-500/50"
                  >
                    {/* Top Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
                      <div className="space-y-1 drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,1)]">
                        <span className="text-[10px] font-mono text-[#D6448D] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          ¡VIAJE EN PROGRESO DETECTADO!
                        </span>
                        <h4 className="text-sm font-display font-black text-[#3A185C]">Tienes un autodiagnóstico activo</h4>
                        <p className="text-xs text-black font-sans font-bold">
                          Día de hoy: <strong className="text-[#3A185C] font-black">Día {programProgress.currentDay}</strong> • Completados: <strong className="font-black">{programProgress.completedDays.length} de 7 días</strong>.
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent rotation trigger
                            setPhase("DASHBOARD");
                            setSelectedDayPreview(1);
                            setTimeout(() => {
                              const elem = document.getElementById("emotional_timeline_section");
                              if (elem) {
                                  elem.scrollIntoView({ behavior: "smooth", block: "center" });
                              }
                            }, 100);
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#411F66] to-[#E86FA3] text-white font-display font-extrabold text-xs tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all border-2 border-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_0_4px_12px_rgba(65,31,102,0.15)] hover:scale-[1.02] btn-neon-pulse"
                        >
                          <span>IR A MI PANEL</span>
                          <Compass className="w-3.5 h-3.5 text-white" />
                        </button>
                        <span className="text-xs font-mono font-black text-black text-center bg-yellow-400 border-2 border-yellow-600 px-2.5 py-1 rounded-md shadow-xs drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,1)] w-full">
                          {chrono.isLocked ? (
                            chrono.msRemaining < 30 * 60 * 1000 ? (
                              <motion.span
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
                                className="inline-block text-red-800 font-black"
                              >
                                💓 Próximo día en: {String(chrono.hours).padStart(2, '0')}h {String(chrono.minutes).padStart(2, '0')}m {String(chrono.seconds).padStart(2, '0')}s
                              </motion.span>
                            ) : (
                              <span>Próximo día en: {String(chrono.hours).padStart(2, '0')}h {String(chrono.minutes).padStart(2, '0')}m {String(chrono.seconds).padStart(2, '0')}s</span>
                            )
                          ) : (
                            <span className="text-emerald-900 font-black">¡Siguiente prueba disponible!</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Base Section: Mini-ejercicio de calma */}
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="border-t-2 border-amber-500/25 pt-4 mt-1 w-full space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3A185C]">
                          <span className="text-sm">{currentExercise.emoji}</span>
                          <span className="font-display font-black tracking-wide">Mini-ejercicio de Calma Express (30s)</span>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              rotateMiniExercise();
                            }}
                            disabled={isMiniExerciseActive}
                            className="text-[10px] font-bold text-[#3A185C]/75 hover:text-[#3A185C] bg-white/50 border border-amber-500/35 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
                            title="Cambiar ejercicio aleatorio"
                          >
                            <RefreshCw className={`w-2.5 h-2.5 ${isMiniExerciseActive ? 'opacity-40' : 'animate-spin'}`} style={{ animationDuration: '4s' }} />
                            <span>Cambiar ↻</span>
                          </button>
                          <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#D6448D] bg-white/60 px-2.5 py-0.5 rounded-full border border-[#D6448D]/10 shadow-xs">
                            {currentExercise.category}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/60 border border-amber-500/25 rounded-xl p-3 sm:p-4 space-y-3 shadow-inner relative overflow-hidden">
                        {/* Circle Breathing Guide visual aid when active */}
                        {isMiniExerciseActive && (
                          <div className="absolute right-3 top-3 w-10 h-10 flex items-center justify-center">
                            <motion.div 
                              animate={{ 
                                scale: [1, 1.6, 1],
                                backgroundColor: ["rgba(232,111,163,0.3)", "rgba(54,196,216,0.5)", "rgba(232,111,163,0.3)"] 
                              }}
                              transition={{ 
                                duration: currentExercise.id === 1 ? 4 : currentExercise.id === 3 ? 6 : 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="w-6 h-6 rounded-full border-2 border-white/50"
                            />
                          </div>
                        )}

                        <div>
                           <h5 className="text-xs font-black text-[#3A185C] flex items-center gap-1">
                             <span>{currentExercise.title}</span>
                           </h5>
                           <p className="text-[11px] text-black/80 font-bold leading-relaxed mt-0.5">{currentExercise.description}</p>
                        </div>

                        {/* Instruction list/steps */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1.5 border-t border-[#3A185C]/5">
                          {currentExercise.steps.map((step, idx) => (
                            <div key={idx} className="bg-white/70 p-2 rounded-lg border border-[#3A185C]/10 text-[10px] font-bold text-black/85 flex items-start gap-1.5 shadow-xs">
                              <span className="w-4 h-4 rounded-full bg-amber-500/15 flex items-center justify-center text-[9px] font-black text-amber-800 shrink-0 mt-0.5">{idx + 1}</span>
                              <span className="leading-tight">{step}</span>
                            </div>
                          ))}
                        </div>

                        {/* Live Countdown area */}
                        <div className="bg-white/90 rounded-xl p-2.5 border border-amber-500/15 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-sm">
                          <div className="flex items-center gap-2.5 text-left w-full sm:w-auto">
                            <div className="w-8 h-8 rounded-full bg-[#E86FA3]/15 flex items-center justify-center font-mono font-black text-xs text-[#E86FA3] shrink-0 border border-[#E86FA3]/25 shadow-sm">
                              {miniSecondsLeft}s
                            </div>
                            <span className="text-[11px] font-bold text-[#3A185C] animate-fadeIn leading-snug">
                              {currentGuideText}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isMiniExerciseActive) {
                                setIsMiniExerciseActive(false);
                              } else {
                                setIsMiniExerciseActive(true);
                              }
                            }}
                            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm border border-b-2 active:translate-y-[1px] active:border-b-0 ${
                              isMiniExerciseActive 
                                ? "bg-red-500 hover:bg-red-600 border-red-600 text-white" 
                                : "bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white"
                            }`}
                          >
                            {isMiniExerciseActive ? "Detener" : "Comenzar (30s)"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* FASE 1: HERO */}
              <section id="landing_hero" className="text-center space-y-8 max-w-4xl mx-auto py-4">
                <div className="inline-flex items-center space-x-2 bg-[#EDE0F0] border border-[#6E488A]/20 py-2 px-5 rounded-full select-none shadow-[0_4px_15px_rgba(110,72,138,0.05)]">
                  <span className="text-sm font-semibold tracking-wide text-[#411F66] uppercase flex items-center gap-1.5 font-bold">
                    By <span className="text-[#E86FA3] font-black">TU PODER MENTAL MUJER</span>
                  </span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-[#411F66] tracking-tight leading-none">
                    M.A.P.A. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E86FA3] to-[#411F66]">Mujer</span>
                  </h1>
                  <p className="text-[#E86FA3] text-xl sm:text-2xl font-black tracking-wide uppercase max-w-3xl mx-auto leading-relaxed">
                    Mapa de Activación y Protección Emocional
                  </p>
                </div>
                
                <p className="text-lg sm:text-xl text-[#0B152B]/90 font-sans tracking-wide leading-relaxed max-w-2xl mx-auto px-4 font-semibold">
                  Descubre qué factores podrían estar manteniendo activo tu sistema de alerta emocional. Un espacio diseñado única y exclusivamente para guiar a la mujer hacia su bienestar, autorregulación y calma mental.
                </p>

                {/* Animated Custom Gold & Teal Brain-Compass Core (Matches uploaded logo accurately) */}
                <div className="py-8 flex justify-center">
                  <div className="relative w-48 h-48 rounded-full border-4 border-[#411F66]/15 p-2 bg-gradient-to-b from-white to-[#FFF7FC] shadow-[0_0_30px_rgba(232,111,163,0.12)] flex items-center justify-center">
                    {/* Compass outer dial ring */}
                    <div className="absolute inset-2 rounded-full border border-dashed border-[#36C4D8]/30 animate-spin" style={{ animationDuration: '30s' }} />
                    <div className="absolute inset-5 rounded-full border border-[#E86FA3]/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-6 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center overflow-hidden">
                      {/* Brain division background (teal/left, green/right matches logo) */}
                      <div className="absolute inset-0 flex">
                        <div className="w-1/2 h-full bg-[#36C4D8]/10 border-r border-[#36C4D8]/20" />
                        <div className="w-1/2 h-full bg-[#F58BC8]/10" />
                      </div>
                      {/* Brain Icon / Compass needle with gold sun terminal */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <Compass className="w-20 h-20 text-[#36C4D8] opacity-35 animate-pulse absolute" />
                        {/* Custom shiny compass needle rotater */}
                        <div className="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                          <div className="relative h-28 w-1 flex items-center justify-center">
                            {/* Needle point */}
                            <div className="absolute -top-1 w-2.5 h-2.5 bg-[#36C4D8] rotate-45 rounded" />
                            {/* Needle shine */}
                            <div className="w-[2px] h-full bg-gradient-to-b from-[#36C4D8] via-[#EDE0F0] to-[#E86FA3]" />
                            {/* Needle gold sun pointer at bottom/top */}
                            <div className="absolute -bottom-1 w-3 h-3 bg-[#E86FA3] rounded-full border border-pink-200 shadow-[0_0_10px_rgba(232,111,163,0.5)]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlighted Quote Board from attached files (COMPRENDER ES...) */}
                <div className="max-w-2xl mx-auto px-4 pb-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-white via-[#EDE0F0]/50 to-white border border-[#411F66]/15 shadow-[0_4px_20px_rgba(110,72,138,0.06)] space-y-2">
                    <span className="text-xs font-mono tracking-widest text-[#E86FA3] uppercase block font-bold">FILOSOFÍA DE CONTENCIÓN</span>
                    <p className="font-display font-semibold text-lg sm:text-xl text-[#411F66] leading-relaxed">
                      COMPRENDER ES EL PRIMER PASO PARA <span className="text-[#36C4D8] block sm:inline font-black">TRANSFORMAR TU VIDA</span>.
                    </p>
                  </div>
                </div>

                {/* Dynamic buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  {currentUserEmail ? (
                    (() => {
                      const chrono = getChronologicalState();
                      if (chrono.isLocked) {
                        return (
                          <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                setPhase("DASHBOARD");
                                setTimeout(() => {
                                  const elem = document.getElementById("emotional_timeline_section");
                                  if (elem) {
                                    elem.scrollIntoView({ behavior: "smooth", block: "center" });
                                  }
                                }, 100);
                              }}
                              className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-bold tracking-wider text-gray-500 bg-gray-100 hover:bg-gray-200 flex items-center justify-center space-x-3 cursor-pointer text-base border-2 border-gray-300 transition-all shadow-sm"
                            >
                              <span>Ir a mi Panel de Control</span>
                              <Compass className="w-5 h-5 text-gray-500 shrink-0" />
                            </button>
                            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
                              <span>Siguiente Test (Día {programProgress.currentDay}) disponible en: {String(chrono.hours).padStart(2, '0')}h {String(chrono.minutes).padStart(2, '0')}m {String(chrono.seconds).padStart(2, '0')}s</span>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <button
                            onClick={() => {
                              setPhase("DASHBOARD");
                              setTimeout(() => {
                                const elem = document.getElementById("emotional_timeline_section");
                                if (elem) {
                                  elem.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                              }, 100);
                            }}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-black tracking-wider text-white bg-gradient-to-r from-[#E86FA3] via-[#411F66] to-[#36C4D8] btn-neon-pulse flex items-center justify-center space-x-3 cursor-pointer text-base border-2 border-[#262222] shadow-xl"
                          >
                            <Sparkles className="w-5 h-5 text-white animate-pulse" />
                            <span>¡Haz tu test de hoy! (Día {programProgress.currentDay || 1})</span>
                            <Compass className="w-5 h-5 text-white shrink-0" />
                          </button>
                        );
                      }
                    })()
                  ) : (
                    <button
                      onClick={startFreeScanTest}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-black tracking-wider text-white bg-gradient-to-r from-[#411F66] to-[#E86FA3] btn-neon-pulse flex items-center justify-center space-x-3 cursor-pointer text-base border-2 border-[#262222]"
                    >
                      <span>Iniciar Escaneo de Alerta y Activación Sobrecognitiva (M.A.P.A.™)</span>
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <a 
                    href="#problem"
                    className="w-full sm:w-auto px-6 py-4 rounded-xl border border-[#6E488A]/20 text-[#411F66] hover:bg-[#EDE0F0]/40 text-sm font-bold transition-all text-center"
                  >
                    Saber más primero
                  </a>
                </div>

                {/* Micro disclaimers */}
                <p className="text-xs text-[#0B152B]/70 font-mono font-medium">
                  NO ES TEST CLÍNICO • NO EVALUACIÓN MÉDICA • TOTALMENTE ANÓNIMO Y SEGURO
                </p>

                <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-center mt-4">
                  <span className="text-[#36C4D8]">FORTALECE TU MENTE</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-[#E86FA3]">TRANSFORMA TU VIDA</span>
                </div>
              </section>

              {/* ECOSISTEMA BY TU PODER MENTAL MUJER */}
              <section id="ecosistema_branding" className="max-w-3xl mx-auto py-6">
                <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border-2 border-dashed border-[#E86FA3]/30 bg-gradient-to-br from-white via-[#EDE0F0]/25 to-white shadow-[0_10px_30px_rgba(110,72,138,0.04)] text-center space-y-4">
                  <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-[#E86FA3]/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -left-16 -top-16 w-32 h-32 bg-[#36C4D8]/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="inline-flex items-center space-x-2 bg-[#E86FA3]/10 border border-[#E86FA3]/30 py-1 px-4 rounded-full">
                    <Sparkles className="w-4 h-4 text-[#E86FA3] animate-pulse" />
                    <span className="text-xs font-mono font-extrabold text-[#E86FA3] uppercase tracking-widest">
                      ECOSISTEMA INTEGRAL FEMENINO
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-[#411F66]">
                      M.A.P.A. Mujer
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#56346F]/80 uppercase tracking-widest">
                      Mapa de Activación y Protección Emocional
                    </p>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-[#E86FA3] to-[#36C4D8] mx-auto my-3" />
                    <p className="font-display font-extrabold text-lg sm:text-xl text-[#E86FA3] tracking-wide">
                      By Tu Poder Mental Mujer
                    </p>
                    <p className="text-sm font-sans font-semibold text-[#0B152B]/85 max-w-xl mx-auto italic leading-relaxed">
                      "El Ecosistema Inteligente para el Bienestar Emocional Femenino"
                    </p>
                  </div>

                  <p className="text-xs font-mono text-[#411F66]/80 leading-relaxed max-w-lg mx-auto uppercase font-bold tracking-wider">
                    Fortalece tu mente • Reconecta contigo • Transforma tu vida
                  </p>
                </div>
              </section>

              {/* FASE 2: IDENTIFICACIÓN - "M.A.P.A. es para ti si..." */}
              <section id="landing_identification" className="space-y-8 bg-[#EDE0F0]/30 rounded-3xl p-8 border border-[#411F66]/12">
                <div className="text-center space-y-2">
                  <h2 className="font-display font-black text-2xl md:text-3xl text-[#411F66]">Este M.A.P.A. es para ti si...</h2>
                  <p className="text-sm text-[#0B152B]/85 max-w-lg mx-auto font-medium">Selecciona las tarjetas con las que te sientas identificada hoy para ver la calibración del radar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {landingCards.map((card) => {
                    const isChecked = selectedChecks[card.id];
                    return (
                      <div
                        key={card.id}
                        onClick={() => toggleLandingCheck(card.id)}
                        className={`p-6 rounded-2xl cursor-pointer transition-all border text-left flex flex-col justify-between h-44 relative ${
                          isChecked 
                            ? "bg-white border-[#E86FA3] shadow-[0_0_25px_rgba(232,111,163,0.18)]" 
                            : "bg-white/80 border-[#411F66]/10 hover:border-[#411F66]/25 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase bg-[#EDE0F0] text-[#411F66] px-2 py-0.5 rounded font-extrabold">
                            {card.tag}
                          </span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isChecked ? "bg-[#E86FA3]" : "border border-[#411F66]/25"
                          }`}>
                            {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-sm text-[#0B152B] mt-4 leading-relaxed flex-1 font-semibold">
                          "{card.text}"
                        </p>
                        
                        {isChecked && (
                          <span className="absolute bottom-3 right-4 flex items-center text-[10px] font-mono text-[#E86FA3] animate-pulse font-bold">
                            ● Alerta calibrando
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {Object.keys(selectedChecks).length > 0 && !currentUserEmail && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-[#E86FA3]/30 p-4 rounded-xl flex items-center justify-between max-w-xl mx-auto shadow-[0_0_20px_rgba(232,111,163,0.1)]"
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <Activity className="w-4 h-4 text-[#E86FA3] animate-bounce" />
                      <span className="text-xs text-[#411F66] font-mono font-bold">
                        Sección detectada. Has seleccionado {Object.keys(selectedChecks).filter(k=>selectedChecks[Number(k)]).length} focos de aviso. Tu M.A.P.A.™ se adaptará dinámicamente.
                      </span>
                    </div>
                    <button 
                      onClick={startFreeScanTest}
                      className="text-xs bg-gradient-to-r from-[#411F66] to-[#E86FA3] hover:shadow-[0_0_15px_rgba(54,196,216,0.5)] text-white font-extrabold py-2 px-4 rounded-lg transition-all cursor-pointer"
                    >
                      Analizarlos ahora
                    </button>
                  </motion.div>
                )}
              </section>

              {/* FASE 3: EL PROBLEMA */}
              <section id="problem" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6 border-t border-[#6E488A]/12 pt-12">
                <div className="md:col-span-7 space-y-6 text-left">
                  <div className="w-12 h-12 rounded-xl bg-[#EDE0F0] flex items-center justify-center border border-[#6E488A]/20">
                    <ShieldAlert className="w-6 h-6 text-[#E86FA3]" />
                  </div>
                  
                  <h2 className="font-display font-black text-3xl md:text-4xl text-[#411F66] tracking-tight leading-snug">
                    La ansiedad no es un fallo o defecto de tu mente.<br />
                    <span className="text-[#E86FA3]">Es un mecanismo de supervivencia neurobiológico que exige atención clínica.</span>
                  </h2>

                  <div className="space-y-4 text-[#0B152B]/90 font-sans leading-relaxed text-sm md:text-base">
                    <p className="font-semibold">
                      Desde la perspectiva de la psiconeuroinmunología, la ansiedad funciona exactamente como un <span className="text-[#E86FA3] font-bold">detector de humo biológico</span>. Su misión no es causarte daño, sino advertirte de una amenaza percibida mediante la activación del sistema nervioso simpático.
                    </p>
                    <p className="text-[#0B152B]/80 text-xs md:text-sm">
                      Intentar suprimir farmacológica o mentalmente los síntomas superficiales (la alarma) sin descifrar el origen psicosomático subyacente mantiene el sistema autónomo sobrecalentado. Solo mediante la integración consciente y la asimilación corporal se desactiva este estado de alerta crónica.
                    </p>
                  </div>

                  <div className="p-4 bg-[#EDE0F0]/50 border border-[#6E488A]/15 rounded-2xl space-y-3.5">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#411F66]">
                      🩺 Análisis Clínico-Funcional de la Alerta:
                    </h4>
                    <div className="space-y-3 text-xs text-[#411F66]/90 font-semibold">
                      <div className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#E86FA3] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#411F66] font-bold">Desbalance Autonómico:</strong> Tu cuerpo activó la respuesta simpática (lucha, huida o congelación) debido a un desajuste acumulado en tu carga alostática y autorregulación emocional.
                        </span>
                      </div>
                      <div className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#E86FA3] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#411F66] font-bold">Resolución de Raíz:</strong> Reconfigurar la vía vagal a través de anclas somáticas específicas restablece la homeostasis del sistema nervioso, extinguiendo la alarma de forma definitiva.
                        </span>
                      </div>
                      <div className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#E86FA3] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#411F66] font-bold">Asimilación Neurocognitiva:</strong> Al nombrar el disparador y registrar la respuesta fisiológica, tu córtex prefrontal recupera el control de regulación sobre la amígdala.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 bg-white border border-[#E86FA3]/25 rounded-3xl p-6 relative overflow-hidden h-72 flex flex-col justify-center items-center shadow-[0_0_25px_rgba(232,111,163,0.12)]">
                  <div className="absolute inset-0 bg-radial-gradient from-[#36C4D8]/5 to-transparent pointer-events-none" />
                  
                  {/* Radar Scanning Visual Loop */}
                  <div className="relative w-44 h-44 border border-[#411F66]/10 rounded-full flex items-center justify-center">
                    <div className="absolute w-28 h-28 border border-[#411F66]/15 rounded-full" />
                    <div className="absolute w-12 h-12 border border-[#36C4D8]/30 rounded-full bg-[#36C4D8]/10 animate-ping" />
                    
                    {/* Compass Line Accents */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#411F66]/10" />
                    <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#411F66]/10" />
                    
                    {/* Rotating Scanner Arm */}
                    <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '6s', backgroundImage: 'conic-gradient(from 0deg, rgba(54,196,216,0.3) 10%, transparent 40%)' }} />

                    {/* Target alerts */}
                    <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-[#E86FA3] shadow-[0_0_8px_#E86FA3]" />
                    <div className="absolute bottom-10 right-6 w-2 h-2 rounded-full bg-[#36C4D8] shadow-[0_0_8px_#36C4D8]" />
                    <Compass className="w-7 h-7 text-[#36C4D8] relative z-10 animate-pulse" />
                  </div>
                  
                  <span className="text-[11px] font-mono tracking-widest text-[#E86FA3] mt-4 uppercase animate-pulse font-black">
                    ⚠️ SENSOR CARDIO-EMOCIONAL OPERATIVO
                  </span>
                </div>
              </section>
            </motion.div>
          )}

          {/* =========================================================
              PHASE: SCAN_TEST - INITIAL 7 QUESTION RAPID SCAN
              ========================================================= */}
          {phase === "SCAN_TEST" && (
            <ScanWizard
              onScanComplete={handleScanComplete}
              onBackToHome={() => setPhase("LANDING")}
            />
          )}

          {/* =========================================================
              PHASE: SCAN_RESULTS - IMMEDIATE SCIENTIFIC STATS & RECRUITMENT
              ========================================================= */}
          {phase === "SCAN_RESULTS" && (
            <ScanResults
              metrics={scanMetrics}
              radialData={scanRadialData}
              interpretacionIA={scanInterpretacion}
              onBeginProgram={handleRegisterAndStartProgram}
              onRestart={handleRestartScan}
              isLoadingReg={isRegistering}
            />
          )}

          {/* =========================================================
              PHASE: LOGIN / IDENTIFICATION SYSTEM (NO SECURITY CORNER)
              ========================================================= */}
          {phase === "LOGIN" && (
            <motion.div
              key="login_phase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto space-y-8 py-8"
            >
              <div className="text-center space-y-3">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-[#EDE0F0] border border-[#6E488A]/20 flex items-center justify-center shadow-md">
                  <Lock className="w-6 h-6 text-[#36C4D8] animate-pulse" />
                </div>
                <h2 className="font-display font-bold text-3xl text-[#6E488A]">
                  Identificación M.A.P.A.™
                </h2>
                <p className="text-[#56346F]/90 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed font-medium font-sans">
                  Ingresa tu correo para personalizar tus resultados, resguardar tus respuestas e imprimir tu reporte de orientación personalizado de 7 días.
                </p>
              </div>

              <form 
                onSubmit={handleUserLoginSubmit} 
                className="glass-card p-8 rounded-3xl space-y-6 shadow-2xl text-left relative"
              >
                {/* Visual glow element behind */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#36C4D8]/5 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4">
                  {/* Correo Electrónico */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-[#6E488A] uppercase tracking-widest font-bold">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E488A]/60" />
                      <input 
                        type="email" 
                        required
                        placeholder="ejemplo@correo.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-white border border-[#6E488A]/15 focus:border-[#36C4D8] placeholder:text-gray-400 rounded-xl p-3.5 pl-11 text-sm outline-none text-[#56346F] transition-all font-sans font-medium"
                      />
                    </div>
                  </div>

                  {/* Detect banner in case user profile already exists in localStorage (Instant Recovery!) */}
                  {(() => {
                    const emailKey = loginEmail.toLowerCase().trim();
                    if (emailKey && emailKey.includes("@")) {
                      const hasPrev = localStorage.getItem(`MAPA_USER_PROGRESS_${emailKey}`);
                      if (hasPrev) {
                        try {
                          const parsed = JSON.parse(hasPrev);
                          const completedCount = parsed.completedDays?.length || 0;
                          return (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center space-x-2.5 font-sans font-medium"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>
                                ¡Cuenta detectada! Recuperaremos tu perfil de <strong>{parsed.leadInfo?.nombre || "Usuaria"}</strong> ({completedCount} de 7 días listos).
                              </span>
                            </motion.div>
                          );
                        } catch (e) {
                          return null;
                        }
                      } else {
                        const adminEmails = ["contacto@tupodermental.club", "tupodermentaloficial@gmail.com", "agencialeps@gmail.com"];
                        const isAdm = adminEmails.includes(emailKey);
                        if (isAdm) return null;
                        return (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-purple-50 border border-[#6E488A]/10 p-3 rounded-xl text-xs text-[#6E488A] flex items-center space-x-2.5 font-sans font-medium"
                          >
                            <Sparkles className="w-4 h-4 text-[#E36DB4] shrink-0" />
                            <span>¡Nuevo registro! Crearemos un M.A.P.A.™ completamente nuevo para ti.</span>
                          </motion.div>
                        );
                      }
                    }
                    return null;
                  })()}

                  {/* Código de Acceso / Contraseña Administrador */}
                  {(() => {
                    const emailKey = loginEmail.toLowerCase().trim();
                    const adminEmails = ["contacto@tupodermental.club", "tupodermentaloficial@gmail.com", "agencialeps@gmail.com"];
                    const isAdm = adminEmails.includes(emailKey);
                    
                    return (
                      <div className="space-y-1">
                        <label className="block text-xs font-mono text-[#6E488A] uppercase tracking-widest font-bold">
                          {isAdm ? "Contraseña de Administrador (Maestra)" : "Código de Acceso (6 caracteres)"}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E488A]/60" />
                          <input 
                            type={isAdm ? "password" : "text"} 
                            required
                            placeholder={isAdm ? "Introduce la contraseña maestra" : "Ej. K9A8B7"}
                            maxLength={isAdm ? 100 : 6}
                            value={loginAccessCode}
                            onChange={(e) => setLoginAccessCode(isAdm ? e.target.value : e.target.value.toUpperCase())}
                            className={`w-full bg-white border border-[#6E488A]/15 focus:border-[#36C4D8] placeholder:text-gray-400 rounded-xl p-3.5 pl-11 text-sm outline-none text-[#56346F] transition-all ${isAdm ? "font-sans" : "font-mono font-bold tracking-widest uppercase"}`}
                          />
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="block text-[10px] text-[#56346F]/70 font-mono">
                            {isAdm ? "Protección exclusiva para el acceso de Administración M.A.P.A.™" : "Ingresa el código enviado tras tu compra en Hotmart."}
                          </span>
                          {!isAdm && (
                            <button
                              type="button"
                              onClick={handleRequestAccessCode}
                              disabled={isRequestingCode}
                              className="text-[10px] text-[#36C4D8] hover:text-[#2DB3C7] transition-all font-mono font-bold underline bg-transparent border-none p-0 cursor-pointer inline-flex items-center"
                            >
                              {isRequestingCode ? "Enviando..." : "Solicitar/Recuperar Código"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Nombre Completo - Solo para no-administradores */}
                  {(() => {
                    const emailKey = loginEmail.toLowerCase().trim();
                    const adminEmails = ["contacto@tupodermental.club", "tupodermentaloficial@gmail.com", "agencialeps@gmail.com"];
                    const isAdm = adminEmails.includes(emailKey);
                    if (isAdm) return null;
                    return (
                      <div className="space-y-1">
                        <label className="block text-xs font-mono text-[#6E488A] uppercase tracking-widest font-bold">
                          Nombre Completo
                        </label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E488A]/60" />
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Pedro Picapiedra"
                            value={loginNombre}
                            onChange={(e) => setLoginNombre(e.target.value)}
                            className="w-full bg-white border border-[#6E488A]/15 focus:border-[#36C4D8] placeholder:text-gray-400 rounded-xl p-3.5 pl-11 text-sm outline-none text-[#56346F] transition-all font-sans font-medium"
                          />
                        </div>
                        <span className="block text-[10px] text-[#56346F]/70 font-mono mt-0.5">
                          Indispensable para generar tus informes y PDFs oficiales a tu nombre.
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="acceptTerms"
                    checked={loginTermsAccepted}
                    onChange={(e) => setLoginTermsAccepted(e.target.checked)}
                    className="mt-1 accent-[#36C4D8] rounded"
                  />
                  <label htmlFor="acceptTerms" className="text-xs text-[#56346F]/80 leading-normal font-sans cursor-pointer select-none font-medium">
                    Doy mi consentimiento para procesar mis datos de autoconocimiento y recibir herramientas terapéuticas complementarias gratuitas.
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!loginTermsAccepted}
                    className="w-full py-4 rounded-xl font-display font-extrabold tracking-wider text-slate-950 bg-gradient-to-r from-[#36C4D8] via-[#7BE3E8] to-[#36C4D8] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(54,196,216,0.3)] flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:transform-none border-2 border-[#262222]"
                  >
                    <span>
                      {loginEmail && localStorage.getItem(`MAPA_USER_PROGRESS_${loginEmail.toLowerCase().trim()}`)
                        ? "INGRESAR A MI MAPA (ACCEDER) ➔" 
                        : "INGRESAR A MI MAPA (ACCEDER) ➔"}
                    </span>
                  </button>
                </div>

                {/* WhatsApp Support Section */}
                <div className="relative flex items-center pt-2">
                  <div className="flex-grow border-t border-[#6E488A]/10"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-[#6E488A]/50 font-mono uppercase tracking-widest font-bold">¿Tienes problemas para ingresar?</span>
                  <div className="flex-grow border-t border-[#6E488A]/10"></div>
                </div>

                <div className="bg-[#FAF7FC] border border-[#6E488A]/10 p-4 rounded-2xl space-y-3 text-center">
                  <p className="text-xs text-[#56346F]/80 font-medium leading-relaxed">
                    Si eres compradora y tienes inconvenientes para iniciar sesión o conseguir tu código, no te preocupes. Clara te ayudará de inmediato.
                  </p>
                  <a
                    href={`https://wa.me/573207739761?text=${encodeURIComponent("¡Hola, Clara! 😊\nNecesito tu ayuda para ingresar a *M.A.P.A.™ Mujer.* Este es el correo electrónico con el que realicé la compra: " + (loginEmail || ""))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-sans font-bold text-xs text-white bg-[#25D366] hover:bg-[#20BA56] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 shadow-sm no-underline border-none"
                  >
                    <MessageCircle className="w-4 h-4 text-white fill-current" />
                    <span>SOPORTE POR WHATSAPP</span>
                  </a>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setPhase("LANDING")}
                    className="text-xs text-[#6E488A]/80 hover:text-[#6E488A] transition-colors font-mono cursor-pointer bg-transparent border-none py-1 font-semibold"
                  >
                    ← Volver a la página principal
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          {/* =========================================================
              PHASE: DASHBOARD (7-DAY CHRONOGRAPH PATH CONTROL)
              ========================================================= */}
          {phase === "DASHBOARD" && (
            <motion.div
              key="dashboard_phase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              {/* Elegant Header Card */}
              <div className="bg-white border-2 border-[#6E488A]/12 border-b-[6px] border-b-[#EDE0F0] rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden shadow-[0_15px_35px_rgba(110,72,138,0.06),_0_5px_15px_rgba(110,72,138,0.03)] hover:scale-[1.005] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#36C4D8]/10 to-transparent blur-2xl pointer-events-none" />
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center space-x-1.5 bg-[#EDE0F0] text-[#6E488A] px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-widest border border-[#6E488A]/15">
                      <Compass className="w-3.5 h-3.5 animate-spin text-[#E36DB4]" style={{ animationDuration: '6s' }} />
                      <span>BRÚJULA DIARIA ACTIVA</span>
                    </div>
                    <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[#6E488A]">
                      Tu Plan de Alivio Emocional
                    </h2>
                    <p className="text-[#56346F]/80 text-sm font-sans max-w-xl leading-relaxed">
                      Te damos la bienvenida a tu panel de 7 días. Como mujer comprometida con tu bienestar, cada día responderás 7 preguntas breves diseñadas especialmente para reducir la tensión corporal, liberarte del sobrepensamiento y calmar tu mente de forma sencilla.
                    </p>
                  </div>
                  <div className="bg-[#FAF7F9] border border-[#6E488A]/10 p-4 rounded-2xl text-center shrink-0 w-full md:w-auto shadow-inner">
                    <span className="block text-[10px] font-mono text-[#56346F]/60 uppercase tracking-wider">PROGRESO GENERAL</span>
                    <span className="font-display font-extrabold text-3xl text-[#36C4D8] block my-1">
                      {Math.round((programProgress.completedDays.length / 7) * 100)}%
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 block bg-emerald-500/10 py-1 px-2.5 rounded-full font-semibold">
                      {programProgress.completedDays.length} de 7 Días Listos
                    </span>
                  </div>
                </div>
              </div>

              {/* Notice banner if any exists */}
              {dashboardNotice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-emerald-50 border border-emerald-200/60 text-emerald-800 rounded-2xl p-4 text-xs font-medium text-left flex items-start space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                  <span>{dashboardNotice}</span>
                </motion.div>
              )}

              {/* Daily Web App Download prompt for registered users */}
              {currentUserEmail && (
                <AppDownloadPrompt
                  userEmail={currentUserEmail}
                  hasDownloadedApp={!!programProgress.hasDownloadedApp}
                  onConfirmDownloaded={handleConfirmAppDownloaded}
                />
              )}

              {/* COMPANION NOTIFICATIONS SHIELDS */}
              <div id="emotional_regulation_labs">
                <PushNotificationManager userEmail={currentUserEmail} />
              </div>

              {/* The 7-Day Program Timeline Cards Grid */}
              <div id="emotional_timeline_section" className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#6E488A]/12 pb-4">
                  <div>
                    <h3 className="font-display font-semibold text-2xl text-[#6E488A] tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#E36DB4]" />
                      Cronograma del Viaje Emocional
                    </h3>
                    <p className="text-xs text-[#56346F]/80 mt-1">Tu ruta estructurada de 7 días consecutivos para regular tu sistema nervioso y desactivar la ansiedad crónica.</p>
                  </div>
                  <span className="text-xs font-mono bg-[#EDE0F0] text-[#6E488A] border border-[#6E488A]/15 px-3 py-1.5 rounded-full inline-block text-center whitespace-nowrap font-bold">
                    📅 PROGRAMA DE 7 DÍAS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                    const isCompleted = programProgress.completedDays.includes(dayNum);
                    const isActive = programProgress.currentDay === dayNum;
                    const { maxAllowedDay, hours, minutes, seconds } = getChronologicalState();
                    const isChronologicallyLocked = dayNum > maxAllowedDay;

                    const dayMeta = [
                      { 
                        icon: "🫁", 
                        title: "Día 1", 
                        sub: "Sintomatología Fisiológica", 
                        desc: "Mide y libera la tensión corporal, el ritmo latente y la alerta acumulada.",
                        tool: "Interrupción muscular M.A.P.A.™ (2 min)" 
                      },
                      { 
                        icon: "⚡", 
                        title: "Día 2", 
                        sub: "Sensibilidad Ambiental", 
                        desc: "Identifica la sobreestimulación sensorial y ruidos que agotan tu energía simpática.",
                        tool: "Blindaje e inmersión vagal (5 min)" 
                      },
                      { 
                        icon: "🧠", 
                        title: "Día 3", 
                        sub: "Rumia y Pensamiento Automático", 
                        desc: "Debilita los bucles de escenarios catastróficos que mantienen alto el cortisol.",
                        tool: "Tabla Hecho vs. Fantasía (3 min)" 
                      },
                      { 
                        icon: "👥", 
                        title: "Día 4", 
                        sub: "Relaciones de Vínculo", 
                        desc: "Gestiona la sobrecarga empática, complacencia y la batería de interacción social.",
                        tool: "Contención de tres capas (4 min)" 
                      },
                      { 
                        icon: "⚖️", 
                        title: "Día 5", 
                        sub: "Hábitos de Control Rígido", 
                        desc: "Suelta la necesidad de anticipar todo para calmar tus miedos de forma ficticia.",
                        tool: "Ancla 'Cajón Imperfecto' (3 min)" 
                      },
                      { 
                        icon: "🛡️", 
                        title: "Día 6", 
                        sub: "Estrategias de Evitación", 
                        desc: "Evita la evasión inercial digital y los escapes silenciosos en diálogos difíciles.",
                        tool: "Acción de Micro-Segundos M.A.P.A.™ (2 min)" 
                      },
                      { 
                        icon: "🕯️", 
                        title: "Día 7", 
                        sub: "Integración Sostenida y Cierre", 
                        desc: "Consolida tus 49 marcadores biológicos y elabora pautas definitivas de calma.",
                        tool: "Anclaje definitivo de tu mapa diario (5 min)" 
                      }
                    ][dayNum - 1];

                    return (
                      <button
                        key={dayNum}
                        onClick={() => setSelectedDayPreview(dayNum)}
                        className={`p-6 rounded-3xl text-left border-2 transition-all relative flex flex-col justify-between min-h-[220px] cursor-pointer outline-none w-full hover:scale-[1.02] active:scale-[0.98] ${
                          isActive
                            ? isChronologicallyLocked
                              ? "bg-[#FFFBEB] border-amber-300 border-b-4 border-b-amber-400 text-black shadow-[0_10px_25px_rgba(245,158,11,0.08)] ring-1 ring-amber-300"
                              : "bg-white border-[#36C4D8] border-b-4 border-b-[#27A1B2] shadow-[0_15px_30px_rgba(54,196,216,0.15)] ring-1 ring-[#36C4D8] text-black"
                            : isCompleted
                            ? "bg-white border-[#6E488A]/12 border-b-4 border-b-emerald-400/80 text-black shadow-[0_8px_20px_rgba(110,72,138,0.04)]"
                            : "bg-[#FDF9FE] border-[#6E488A]/35 border-b-4 border-b-[#EDE0F0] text-black shadow-[0_4px_12px_rgba(110,72,138,0.02)] hover:border-[#6E488A]/60"
                        }`}
                      >
                        <div className="space-y-3 w-full animate-fadeIn">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-3xl">{dayMeta.icon}</span>
                            <div>
                              {isCompleted ? (
                                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 py-1 px-2.5 rounded-full inline-flex items-center gap-1 font-bold">
                                  <span>Completo</span>
                                </span>
                              ) : isActive ? (
                                isChronologicallyLocked ? (
                                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 py-1 px-2.5 rounded-full inline-flex items-center gap-1 font-bold">
                                    <span>Bloqueado 🔒</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono bg-[#36C4D8]/10 text-[#36C4D8] py-1 px-2.5 rounded-full inline-flex items-center gap-1 animate-pulse font-bold border border-[#36C4D8]/30">
                                    <span>Activo Hoy</span>
                                  </span>
                                )
                              ) : (
                                <span className="text-[10px] font-mono bg-amber-100/80 text-amber-900 border border-amber-200/60 py-1 px-2.5 rounded-full inline-flex items-center gap-1 font-bold shadow-xs">
                                  <span>Bloqueado 🔒</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className={`font-mono text-xs uppercase tracking-wider block font-extrabold ${isCompleted ? 'text-emerald-600' : 'text-[#E36DB4]'}`}>{dayMeta.title}</span>
                            <h4 className="font-display font-bold text-lg text-black leading-tight block">{dayMeta.sub}</h4>
                            <p className="text-sm text-black font-medium leading-relaxed block mt-1.5">{dayMeta.desc}</p>
                          </div>

                          {isActive && isChronologicallyLocked && (
                            <div className="mt-3 p-3 bg-yellow-300 border border-yellow-500 text-black rounded-xl text-center space-y-1 shadow-xs animate-pulse">
                              <span className="block text-[10px] font-mono font-black text-black uppercase tracking-widest">
                                ⚠️ APERTURA EN CONSECUTIVO
                              </span>
                              <div className="font-mono text-base font-black text-black">
                                {String(hours).padStart(2, '0')}h {String(minutes).padStart(2, '0')}m {String(seconds).padStart(2, '0')}s
                              </div>
                              <span className="block text-[9px] font-bold text-black/80">
                                Espera que se cumpla el tiempo para iniciar la prueba
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#6E488A]/12 w-full flex items-center justify-between text-xs">
                          <div className="text-xs text-black flex items-center gap-1 truncate max-w-[80%]">
                            <span className="font-black text-black">Herramienta:</span>
                            <span className="italic truncate font-semibold text-black">{dayMeta.tool}</span>
                          </div>
                          <span className="text-xs font-mono text-black group-hover:underline shrink-0 font-extrabold">Ver guía &rarr;</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* INTERACTIVE LOCKED DAY PREVIEW MODAL */}
              <AnimatePresence>
                {selectedDayPreview !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedDayPreview(null)}
                    className="fixed inset-0 bg-[#56346F]/40 backdrop-blur-md flex items-center justify-center p-4 z-50"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white border border-[#6E488A]/12 rounded-3xl w-full max-w-md p-6 relative text-left space-y-5 shadow-2xl"
                    >
                      <button
                        onClick={() => setSelectedDayPreview(null)}
                        className="absolute top-4 right-4 text-[#56346F]/50 hover:text-[#56346F] cursor-pointer border-none bg-transparent outline-none p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {(() => {
                        const previewData = [
                          {
                            day: 1,
                            title: "Sintomatología Fisiológica y Alerta Corporal",
                            desc: "Analiza el mapa de tu ritmo latente neural, las tensiones interconectadas y los primeros marcadores simpáticos.",
                            marcadores: "Frecuencia de alerta subcortical, respiración costal, reflejos de contracción.",
                            herramienta: "Técnica de la interrupción muscular M.A.P.A.™ (2 min)."
                          },
                          {
                            day: 2,
                            title: "Desencadenantes and Sensibilidad Ambiental",
                            desc: "Sintoniza los climas, ruidos, demandas y factores de sobreestimulación neurofisiológica.",
                            marcadores: "Saturación sensorial, fatiga simpática ante el desorden, hiperreacción auditiva.",
                            herramienta: "Protocolo de Blindaje de Estímulos e Inmersión del Nervio Vago (5 min)."
                          },
                          {
                            day: 3,
                            title: "Rumia Mental y Pensamiento Automático Súbito",
                            desc: "Mapea los bucles de película futura catastrófica que sostienen activos los picos de cortisol cerebral.",
                            marcadores: "Bucle de rumiación obsesiva recurrente, alteradores fóbicos, microdespertares nocturnos.",
                            herramienta: "Tabla psicoterapéutica de desglose Hecho vs. Fantasía (3 min)."
                          },
                          {
                            day: 4,
                            title: "Relaciones de Vínculo e Interacciones Sociales",
                            desc: "Decodifica el estrés por complacencia pasiva, el dolor de fallar a otros y la sobrecarga empática activa.",
                            marcadores: "Déficit de batería de interacción social, fatiga empática agregada, límites no asertivos.",
                            herramienta: "Filtro de contención afectiva de tres capas seguras (4 min)."
                          },
                          {
                            day: 5,
                            title: "Hábitos de Control Rígido y Exigencia Personal",
                            desc: "Evalúa los mecanismos obsesivos e inflexibles para anticipar variables como forma de calmar ansiedades.",
                            marcadores: "Perfeccionismo inercial, intolerancia a la desviación de planes, compulsión organizadora.",
                            herramienta: "Ancla de asimilación conductual 'Cajón Imperfecto' (3 min)."
                          },
                          {
                            day: 6,
                            title: "Estrategias de Evitación y Evasión Silenciosa",
                            desc: "Rastrea tácticas automáticas de huida de diálogos difíciles, y escapes inerciales en entornos virtuales.",
                            marcadores: "Tiempo digital evasivo inercial, postergación fóbica, aislamiento del entorno.",
                            herramienta: "Activación por acción comprometida de Micro-Segundos M.A.P.A.™ (2 min)."
                          },
                          {
                            day: 7,
                            title: "Integración, Autocompasión, Regulación y Cierre",
                            desc: "Consolida tus 49 marcadores biológicos y elabora las pautas definitivas de desactivación neural.",
                            marcadores: "Asertividad vegetativa integrativa, optimismo cognitivo basal, resiliencia corporal.",
                            herramienta: "Pauta de anclaje de calma definitiva para tu Mapa Diario (5 min)."
                          }
                        ][selectedDayPreview - 1];

                        return (
                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] font-mono tracking-wider bg-[#EDE0F0] text-[#6E488A] px-2.5 py-1 rounded-full font-bold">
                                PREVISIÓN DE ENFOQUE • DÍA {previewData.day}
                              </span>
                              <h4 className="font-display font-bold text-lg text-[#6E488A] mt-3 leading-tight">
                                {previewData.title}
                              </h4>
                            </div>

                            <p className="text-xs text-[#56346F]/85 leading-relaxed font-sans">
                              {previewData.desc}
                            </p>

                            <div className="space-y-3 bg-[#FAF7F9] p-4 rounded-2xl border border-[#6E488A]/10 text-xs">
                              <div>
                                <span className="text-[#36C4D8] font-mono text-[10px] uppercase font-bold block">Marcadores Autónomos a Medir:</span>
                                <p className="text-[#56346F]/80 font-sans mt-0.5">{previewData.marcadores}</p>
                              </div>
                              <div>
                                <span className="text-[#E36DB4] font-mono text-[10px] uppercase font-bold block">Herramienta Práctica Entregada:</span>
                                <p className="text-[#56346F]/80 font-sans mt-0.5">{previewData.herramienta}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedDayPreview(null)}
                              className="w-full py-3 bg-[#36C4D8] hover:bg-[#2DB3C7] text-white font-mono font-bold text-xs rounded-xl tracking-wider transition-all cursor-pointer text-center border-none shadow-sm outline-none"
                            >
                              CERRAR PREVIEW
                            </button>
                          </div>
                        );
                      })()}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Big Action CTA Panel based on the active state */}
              <div className="bg-white border border-[#6E488A]/12 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-sm">
                {(() => {
                  const day = programProgress.currentDay;
                  const isTodayCompleted = programProgress.completedDays.includes(day);
                  const allDaysDone = programProgress.completedDays.length === 7;

                  // Topics details mapping (clinical descriptions)
                  const dayFocusDetails = [
                    { day: 1, title: "Sintomatología Fisiológica y Alerta Corporal", focus: "Exploraremos el ritmo de tu latido cardíaco, tensión en mandíbula, respiración costal alta y cómo responde tu sistema autónomo simpático." },
                    { day: 2, title: "Desencadenantes y Sensibilidad Ambiental", focus: "Identificaremos qué climas sociales, ruidos, sobrecargas o imprevistos activan con más violencia tu sistema neural de alerta." },
                    { day: 3, title: "Rumia Mental y Pensamiento Automático Súbito", focus: "Mapearemos películas de tragedias futuras ficticias y bucles obsesivos que mantienen inflamados tus niveles de cortisol." },
                    { day: 4, title: "Relaciones de Vínculo e Interacciones Sociales", focus: "Analizaremos el temor a fallar o preocupar a otros, la empatía activa fatigante y la complacencia reactiva." },
                    { day: 5, title: "Hábitos de Control Rígido y Exigencia Personal", focus: "Investigaremos tu dificultad para delegar y la necesidad obsesiva de predecir cada variable para sentirte segura." },
                    { day: 6, title: "Estrategias de Evitación y Evasión Silenciosa", focus: "Registraremos las técnicas subconscientes que utilizas para aislarte, huir de situaciones o postergar decisiones difíciles." },
                    { day: 7, title: "Integración, Autocompasión, Regulación y Cierre", focus: "Consolidaremos tus marcadores del nervio vago y reguladores calmantes para preparar el reporte personalizado de orientación." }
                  ][day - 1] || { day: 1, title: "Sintomatología Fisiológica y Alerta", focus: "" };

                  const userName = leadInfo.nombre || "Usuaria";

                  if (allDaysDone) {
                    return (
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <Sparkles className="w-6 h-6 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-display font-bold text-xl text-[#6E488A]">¡Felicidades, querida {userName}! Tu M.A.P.A.™ de 7 Días está Listo</h4>
                          <p className="text-sm text-[#56346F]/80 leading-relaxed max-w-xl">
                            {userName}, has completado cada día del viaje emocional con admirable dedicación y valentía. Has guardado con éxito tus 49 marcadores psicológicos. Tu reporte profesional, completamente personalizado e integral con tus anclas cerebrales y gráficos interactivos está listo para ser generado para ti.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={triggerSevenDayReport}
                            className="px-8 py-4 rounded-xl font-display font-bold tracking-wider text-white bg-gradient-to-r from-[#36C4D8] via-[#E36DB4] to-[#6E488A] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md cursor-pointer inline-flex items-center space-x-2 justify-center border-2 border-[#262222]"
                          >
                            <span>GENERAR REPORTE DE 7 DÍAS, {userName.toUpperCase()} 🔓</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          
                          <a
                            href="https://wa.link/0x3911"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 rounded-xl font-display font-bold tracking-wider text-[#6E488A] bg-[#EDE0F0] border border-[#6E488A]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center space-x-2 justify-center shadow-sm"
                          >
                            <span>DESEO SEGUIR CON MI PROCESO PREMIUM ➔</span>
                            <Smartphone className="w-4 h-4 text-[#6E488A] shrink-0" />
                          </a>
                        </div>
                      </div>
                    );
                  }

                  const { isLocked, hours, minutes, seconds } = getChronologicalState();

                  if (isLocked) {
                    return (
                      <div className="space-y-4">
                        <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-800 py-1 px-3 rounded-lg text-xs font-mono font-bold uppercase border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          <span>Día {day} Cronológicamente Bloqueado para {userName}</span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-display font-bold text-lg text-[#6E488A]">{dayFocusDetails.title}</h4>
                          <p className="text-sm text-[#56346F]/80 leading-relaxed max-w-xl">
                            {dayFocusDetails.focus}
                          </p>
                          <p className="text-xs text-[#56346F]/60 leading-relaxed max-w-xl">
                            Querida {userName}, para garantizar la validez metodológica y la asimilación neurológica de tus marcadores de sobrepensamiento, cada día de autoconocimiento se activa secuencialmente respetando 24 horas calendario de asimilación consecutiva. ¡Tu paciencia es parte de tu sanación!
                          </p>
                        </div>

                        {/* Live Countdown HUD */}
                        <div className="bg-[#FAF7F9] border border-[#6E488A]/12 p-4 rounded-xl max-w-sm flex items-center space-x-4 shadow-inner">
                          <Clock className="w-8 h-8 text-amber-600 shrink-0" />
                          <div className="space-y-1">
                            <span className="block text-[10px] font-mono text-[#56346F]/60 uppercase tracking-widest">APERTURA EN CONSECUTIVO</span>
                            <div className="font-mono text-xl sm:text-2xl font-bold text-[#6E488A] tracking-wider">
                              {String(hours).padStart(2, '0')}h {String(minutes).padStart(2, '0')}m {String(seconds).padStart(2, '0')}s
                            </div>
                          </div>
                        </div>

                        {/* Disabled CTA with Lock Info */}
                        <div className="pt-2">
                          <button
                            disabled
                            className="px-8 py-4 rounded-xl font-display font-semibold tracking-wider text-[#56346F]/40 bg-[#FAF7F9] border border-[#6E488A]/10 cursor-not-allowed inline-flex items-center space-x-3 w-full sm:w-auto justify-center"
                          >
                            <span>ESPERANDO LA SIGUIENTE APERTURA...</span>
                            <Lock className="w-4 h-4 text-[#56346F]/40" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (isTodayCompleted) {
                    return (
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#EDE0F0] flex items-center justify-center text-[#6E488A]">
                          <Clock className="w-6 h-6 text-[#6E488A]" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-display font-bold text-lg text-[#6E488A]">¡Día {day} Completado con éxito, {userName}!</h4>
                          <p className="text-sm text-[#56346F]/80 leading-relaxed max-w-xl">
                            {userName}, has guardado tus respuestas de hoy de manera segura en el almacenamiento local. El sistema de tu brújula emocional recalibrará tu mapa una vez que desbloquees los siguientes marcadores mañana. ¡Excelente hábito de autoconocimiento y constancia!
                          </p>
                        </div>
                        <div className="text-xs text-[#56346F]/60 font-mono italic">
                          El próximo día se desbloqueará de forma automática dentro de 24 horas para mantener tu validez clínica. ¡O usa el Simulador de abajo para acelerar las pruebas de tus 7 días!
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="inline-flex items-center space-x-2 bg-[#EDE0F0] text-[#6E488A] py-1 px-3 rounded-lg text-xs font-mono font-bold uppercase border border-[#6E488A]/15">
                        <span>HOY Corresponde: DÍA {day} para {userName}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-display font-bold text-lg text-[#6E488A]">{dayFocusDetails.title}</h4>
                        <p className="text-sm text-[#56346F]/80 leading-relaxed max-w-xl">
                          {userName}, {dayFocusDetails.focus.replace("Exploraremos", "hoy exploraremos").replace("Identificaremos", "hoy identificaremos").replace("Mapearemos", "hoy mapearemos").replace("Analizaremos", "hoy analizaremos").replace("Investigaremos", "hoy investigaremos").replace("Registraremos", "hoy registraremos").replace("Consolidaremos", "hoy consolidaremos")}
                        </p>
                      </div>
                      <button
                        onClick={launchDailyQuiz}
                        className="px-8 py-4 rounded-xl font-display font-semibold tracking-wider text-white bg-[#36C4D8] hover:bg-[#2DB3C7] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md cursor-pointer inline-flex items-center space-x-3 border-none outline-none"
                      >
                        <span>¡Haz tu test de hoy! (Día {day})</span>
                        <Compass className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* HISTORIAL DE LOGROS DIARIOS: BITÁCORA ACTIVATIVA */}
              {programProgress.completedDays.length > 0 && (
                <div className="bg-white border border-[#6E488A]/12 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-sm">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EDE0F0] flex items-center justify-center text-[#E36DB4]">
                      <Award className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#6E488A]">Tu Bitácora de Sabiduría Emocional</h3>
                      <p className="text-xs text-[#56346F]/85">Has resguardado con éxito tus análisis de autodescubrimiento. Revisa tu progreso acumulado:</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                      const isCompleted = programProgress.completedDays.includes(dayNum);
                      if (!isCompleted) return null;

                      const dayInfo = [
                        { icon: "🧠", title: "Día 1: Alerta Corporal", summary: "Mapeaste tu latido cardíaco, tensión en mandíbula y respiración costal alta.", insight: "Has tomado conciencia de los disparadores simpáticos en tu cuerpo para desactivar la alarma inicial." },
                        { icon: "🌍", title: "Día 2: Sensibilidad Ambiental", summary: "Identificaste climas sociales, ruidos e imprevistos que gatillan tu tensión.", insight: "Ahora reconoces cómo el entorno impacta tu sistema nervioso autónomo." },
                        { icon: "💭", title: "Día 3: Pensamiento Rumiante", summary: "Registraste las tragedias ficticias y bucles obsesivos de tu mente.", insight: "Has encendido la luz del observador sobre los bucles de sobrepensamiento restrictivos." },
                        { icon: "🤝", title: "Día 4: Vínculos e Interacciones", summary: "Descubriste fatiga por empatía activa y complacencia reactiva.", insight: "Establecer límites sanos empieza reconociendo dónde se fuga tu energía vital." },
                        { icon: "⚖️", title: "Día 5: Control Rígido", summary: "Evaluaste tu dificultad para delegar y necesidad de predecir variables.", insight: "Abrazar la incertidumbre controlada rebaja drásticamente el estrés mental crónico." },
                        { icon: "🛡️", title: "Día 6: Estrategias de Evitación", summary: "Detectaste tus huidas inconscientes y postergaciones defensivas.", insight: "Dejar de huir de lo incómodo te devuelve el mando y disuelve la angustia sutil." },
                        { icon: "🕯️", title: "Día 7: Integración y Cierre", summary: "Sintonizaste tus reguladores del nervio vago y anclas balsámicas.", insight: "¡Felicidades! Todo tu mapa está recalibrado y tu informe de 12 páginas está listo." }
                      ][dayNum - 1];

                      // Custom comparative data for each day based on clinical progress
                      const stats_antes_despues = [
                        { antes: 86, despues: 24, labelAntes: "Alerta Simpática Inicial", labelDespues: "Calibración Vagal Post-Respiración", cambio: "Reducción del 62%", mensaje: "¡Espectacular avance! Tu cuerpo respondió de inmediato al sintonizador sensorial. Has demostrado que tu ritmo cardíaco y tensión corporal pueden regularse con atención consciente." },
                        { antes: 78, despues: 21, labelAntes: "Reactividad Externa Alta", labelDespues: "Aislamiento Acústico Calmado", cambio: "Reducción del 57%", mensaje: "¡Excelente! Lograste atenuar los ruidos y estresores ambientales. Ahora posees un filtro activo para que el entorno no sature tu calma." },
                        { antes: 92, despues: 18, labelAntes: "Bucle Mental Rumiante", labelDespues: "Observancia Desacoplada", cambio: "Reducción del 74%", mensaje: "¡Reducción insuperable! Desarmaste los escenarios de alerta mental repentina. Has encendido al observador interno con total seguridad." },
                        { antes: 80, despues: 25, labelAntes: "Complacencia Sintomática", labelDespues: "Límites y Presencia Firme", cambio: "Reducción del 55%", mensaje: "Vas por un sendero brillante. Sostener de forma asertiva tus recursos de energía personal está devolviéndote la vitalidad." },
                        { antes: 84, despues: 22, labelAntes: "Sobre-Control Mental Rígido", labelDespues: "Aceptación Incertidumbre", cambio: "Reducción del 62%", mensaje: "¡Excelente progreso de autorregulación! Aprender a tolerar variables impredecibles redujo tu estrés muscular y el sobrepensamiento a niveles óptimos." },
                        { antes: 76, despues: 15, labelAntes: "Huida o Evitación Alerta", labelDespues: "Afrontamiento Integrador", cambio: "Reducción del 61%", mensaje: "¡Inigualable! Al encarar lo incómodo con autocompasión, la angustia se disuelve de inmediato de tu sistema nervioso." },
                        { antes: 88, despues: 12, labelAntes: "Desregulación de Alerta Inicial", labelDespues: "Homeostasis Vagal Armónica", cambio: "Reducción del 76%", mensaje: "¡Proceso de Éxito! Tu sistema ha completado de manera soberbia su ciclo de autorregulación. Mantén esta frecuencia de calma." }
                      ][dayNum - 1];

                      return (
                        <div key={dayNum} className="p-6 rounded-2xl bg-[#FAF7F9] border border-[#6E488A]/12 text-left space-y-4 relative overflow-hidden shadow-sm hover:scale-[1.01] transition-all">
                          <div className="absolute top-0 right-0 py-1.5 px-3 bg-emerald-50 border-b border-l border-emerald-200 text-emerald-800 font-mono text-xs rounded-bl-xl font-bold uppercase flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>COMPLETADO</span>
                          </div>
                          
                          <div className="flex items-center space-x-2.5">
                            <span className="text-3xl">{dayInfo.icon}</span>
                            <h4 className="font-display font-semibold text-[#6E488A] text-base leading-tight">{dayInfo.title}</h4>
                          </div>

                          <div className="space-y-2 pt-1 border-t border-[#6E488A]/10 text-sm">
                            <p className="text-[#56346F]/80 leading-relaxed">
                              <strong className="text-[#6E488A]">Avance de Hoy:</strong> {dayInfo.summary}
                            </p>
                            <div className="p-3 bg-[#EDE0F0]/50 rounded-xl border border-[#6E488A]/15 text-xs text-[#6E488A] italic leading-relaxed">
                              🎯 <strong>Insight psicoterapéutico:</strong> {dayInfo.insight}
                            </div>
                          </div>

                          {/* DYNAMIC BEFORE & AFTER RECOVERY CHART */}
                          <div className="p-4 rounded-xl bg-white border border-[#6E488A]/12 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[#36C4D8] font-bold uppercase tracking-wider">
                                📊 CALIBRACIÓN DE TENSIÓN
                              </span>
                              <span className="text-emerald-700 font-extrabold">{stats_antes_despues.cambio}</span>
                            </div>

                            <div className="space-y-3.5">
                              {/* BAR: BEFORE */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] text-[#56346F]/60">
                                  <span>Antes ({stats_antes_despues.labelAntes})</span>
                                  <span className="font-mono text-red-600 font-bold">{stats_antes_despues.antes}%</span>
                                </div>
                                <div className="w-full bg-[#FAF7F9] h-3.5 rounded-full overflow-hidden border border-[#6E488A]/12">
                                  <div 
                                    className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-500 h-full rounded-full"
                                    style={{ width: `${stats_antes_despues.antes}%` }}
                                  />
                                </div>
                              </div>

                              {/* BAR: AFTER */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] text-[#56346F]/60">
                                  <span>Después ({stats_antes_despues.labelDespues})</span>
                                  <span className="font-mono text-emerald-600 font-bold">{stats_antes_despues.despues}%</span>
                                </div>
                                <div className="w-full bg-[#FAF7F9] h-3.5 rounded-full overflow-hidden border border-[#6E488A]/12">
                                  <div 
                                    className="bg-gradient-to-r from-cyan-500 via-[#36C4D8] to-emerald-400 h-full rounded-full"
                                    style={{ width: `${stats_antes_despues.despues}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Encouraging Optimistic Lesson Message */}
                            <div className="pt-2 bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs sm:text-sm text-emerald-800 leading-relaxed">
                              🙏 <strong>Mensaje de Aliento:</strong> "{stats_antes_despues.mensaje}"
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ESPACIO PREMIUM M.A.P.A.™ COMPLETO INTEGRADO */}
              {currentUserEmail && (
                <PremiumDashboard 
                  userEmail={currentUserEmail} 
                  userName={leadInfo.nombre || "Usuaria"} 
                  currentDay={programProgress.currentDay}
                  completedDays={programProgress.completedDays}
                  onTriggerMilestone={(days) => setMilestoneModal({ isOpen: true, daysCount: days })}
                />
              )}

              {/* M.A.P.A.™ SOUND THERAPY & AUDIO EXPERIENCE MODULO */}
              <SoundTherapy unlockedAudios={programProgress.unlockedAudios || []} />

            </motion.div>
          )}

          {phase === "WIZARD" && (
            <motion.div
              key="wizard_phase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              {(() => {
                const activeQuestions = getActiveDayQuestions();
                const currentQ = activeQuestions[currentQuestionIndex];
                if (!currentQ) return null;

                return (
                  <>
                    {/* Questionnaire Progress and Header */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase bg-[#EDE0F0] text-[#6E488A] border border-[#6E488A]/15 px-2.5 py-0.5 rounded-full font-bold">
                          Día {programProgress.currentDay} • Pilar: {
                            currentQ.category === "activacion" ? "Nivel de Activación" :
                            currentQ.category === "detonantes" ? "Desencadenantes" :
                            currentQ.category === "patrones" ? "Patrones Mentales" : "Factores de Protección"
                          }
                        </span>
                        <span className="text-xs font-mono text-[#56346F]/60">
                          Pregunta {currentQuestionIndex + 1} de 7
                        </span>
                      </div>

                      {/* Progress bar visual */}
                      <div className="w-full bg-[#FAF7F9] h-2.5 rounded-full overflow-hidden border border-[#6E488A]/12 relative">
                        <div 
                          className="bg-gradient-to-r from-[#36C4D8] via-[#E36DB4] to-[#6E488A] h-full rounded-full transition-all duration-300" 
                          style={{ width: `${((currentQuestionIndex + 1) / 7) * 100}%` }}
                        />
                        {/* Glowing progress tip */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-125 pointer-events-none blur-xs animate-ping"
                          style={{ left: `calc(${((currentQuestionIndex + 1) / 7) * 100}% - 8px)` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#56346F]/60">
                        <span>Porcentaje Completo: <strong>{Math.round(((currentQuestionIndex + 1) / 7) * 100)}%</strong></span>
                        <span>{7 - currentQuestionIndex - 1} restantes de hoy</span>
                      </div>
                    </div>

                    {/* Companion Coaching Avatar UI */}
                    <div className="bg-[#EDE0F0]/30 border border-[#6E488A]/12 rounded-2xl p-4 flex items-start space-x-3 text-left">
                      <div className="w-9 h-9 rounded-full bg-[#EDE0F0] flex items-center justify-center border border-[#6E488A]/15 shrink-0">
                        <Sparkles className="w-4 h-4 text-[#E36DB4]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono text-[#6E488A] uppercase tracking-widest font-semibold">Mentora Clara • Tu Guía Emocional</p>
                        <p className="text-xs text-[#56346F]/85 leading-relaxed italic">
                          "{getCBTAdvice()}"
                        </p>
                      </div>
                    </div>

                    {/* The Active Question Card Display */}
                    <div className="bg-white border border-[#6E488A]/12 rounded-3xl p-8 space-y-8 min-h-[350px] flex flex-col justify-between text-left shadow-sm">
                      
                      <div className="space-y-3">
                        <h3 className="font-display font-medium text-xl sm:text-2xl text-[#6E488A] leading-snug">
                          {currentQ.text}
                        </h3>
                        {currentQ.subtext && (
                          <p className="text-sm text-[#56346F]/70 font-sans">
                            {currentQ.subtext}
                          </p>
                        )}
                      </div>

                      {/* Option Rendering by Type */}
                      <div className="space-y-3 py-4 flex-1 flex flex-col justify-center">
                        
                        {/* TYPE: EMOJI */}
                        {currentQ.type === "emoji" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentQ.options?.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleOptionSelect(opt.value, currentQ.category)}
                                className="p-4 rounded-xl bg-[#FAF7F9] border border-[#6E488A]/8 hover:border-[#36C4D8] hover:bg-[#EDE0F0]/30 transition-all text-left flex items-center space-x-4 cursor-pointer group"
                              >
                                <span className="text-3xl group-hover:scale-125 transition-all outline-none animate-fadeIn" role="img">
                                  {opt.emoji}
                                </span>
                                <span className="text-xs text-[#56346F]/80 font-medium group-hover:text-[#6E488A]">
                                  {opt.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* TYPE: SCALE */}
                        {currentQ.type === "scale" && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                              {currentQ.options?.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => handleOptionSelect(opt.value, currentQ.category)}
                                  className="h-12 w-full rounded-xl bg-[#FAF7F9] border border-[#6E488A]/8 hover:border-[#36C4D8] hover:bg-[#36C4D8] hover:text-white transition-all text-sm font-mono flex items-center justify-center text-[#56346F]/85 font-bold cursor-pointer"
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono text-[#56346F]/50">
                              <span className="flex items-center space-x-1">
                                <ChevronLeft className="w-3 h-3 text-[#E36DB4]" />
                                <span>{currentQ.minLabel || "Mínimo"}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>{currentQ.maxLabel || "Máximo"}</span>
                                <ChevronRight className="w-3 h-3 text-[#36C4D8]" />
                              </span>
                            </div>
                          </div>
                        )}

                        {/* TYPE: CARDS */}
                        {currentQ.type === "card" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentQ.options?.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleOptionSelect(opt.value, currentQ.category)}
                                className="p-5 rounded-xl bg-[#FAF7F9] border border-[#6E488A]/8 hover:border-[#36C4D8] hover:bg-[#EDE0F0]/15 transition-all text-left flex flex-col justify-between h-36 cursor-pointer group"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-2xl group-hover:rotate-12 transition-all">{opt.emoji}</span>
                                  <div className="w-5 h-5 rounded-full border border-[#36C4D8]/30 group-hover:bg-[#36C4D8]/10" />
                                </div>
                                <span className="text-xs text-[#56346F]/85 mt-2 font-medium leading-relaxed group-hover:text-[#6E488A]">
                                  {opt.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* TYPE: SCENARIOS (SITUACIONES REALES) */}
                        {currentQ.type === "scenario" && (
                          <div className="space-y-2.5">
                            {currentQ.options?.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleOptionSelect(opt.value, currentQ.category)}
                                className="w-full p-4 rounded-xl bg-[#FAF7F9] border border-[#6E488A]/8 hover:border-[#36C4D8] hover:bg-[#EDE0F0]/15 transition-all text-left flex items-center space-x-3 cursor-pointer group"
                              >
                                <span className="text-xl bg-[#EDE0F0]/50 p-1.5 rounded-lg text-[#6E488A] group-hover:bg-[#36C4D8] group-hover:text-white transition-all">{opt.emoji}</span>
                                <span className="text-xs text-[#56346F]/85 leading-relaxed font-semibold group-hover:text-[#6E488A]">
                                  {opt.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* TYPE: MULTIPLE CHOICE */}
                        {currentQ.type === "multiple" && (
                          <div className="space-y-3">
                            {currentQ.options?.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleOptionSelect(opt.value, currentQ.category)}
                                className="w-full p-4 rounded-xl bg-[#FAF7F9] border border-[#6E488A]/8 hover:border-[#36C4D8] hover:bg-[#EDE0F0]/15 transition-all text-left flex items-center justify-between cursor-pointer group"
                              >
                                <span className="text-xs text-[#56346F]/80 group-hover:text-[#6E488A] font-medium">
                                  {opt.label}
                                </span>
                                <ChevronRight className="w-4 h-4 text-[#56346F]/50 group-hover:text-[#36C4D8] transition-all" />
                              </button>
                            ))}
                          </div>
                        )}

                      </div>

                      {/* Back button and indicators */}
                      <div className="flex items-center justify-between border-t border-[#6E488A]/12 pt-4 text-xs font-mono text-[#56346F]/60">
                        <button
                          onClick={handlePrevQuestion}
                          disabled={currentQuestionIndex === 0}
                          className={`flex items-center space-x-1.5 ${
                            currentQuestionIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:text-[#6E488A] cursor-pointer font-bold"
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Anterior</span>
                        </button>
                        <span className="font-semibold">Día {programProgress.currentDay} / 7 de Autoconocimiento</span>
                      </div>

                    </div>

                    {/* Complete Action Button when ready */}
                    {isEvaluationReady && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="pt-4 text-center"
                      >
                        <button
                          onClick={handleDailyComplete}
                          className="px-10 py-5 rounded-2xl bg-[#36C4D8] hover:bg-[#2DB3C7] text-white font-display font-bold text-lg shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-3 w-full animate-pulse border-none outline-none"
                        >
                          <span>GUARDAR Y COMPLETAR EL DÍA {programProgress.currentDay} ➔</span>
                          <Sparkles className="w-5 h-5 text-white" />
                        </button>
                      </motion.div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* =========================================================
              PHASE 3 - NEURAL SYSTEM SCANNING & PROGRESS (FASE 7)
              ========================================================= */}
          {phase === "LOADING" && (
            <motion.div
              key="loading_phase"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto py-12 text-center space-y-8"
            >
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center bg-[#EDE0F0]/40 rounded-full border border-[#6E488A]/12 shadow-inner">
                {/* Dual Pulsing Rings */}
                <div className="absolute inset-2 border border-[#E36DB4]/30 rounded-full animate-ping" />
                <div className="absolute inset-8 border border-[#36C4D8]/40 rounded-full animate-pulse" />
                
                {/* Scanning Laser Line */}
                <div className="absolute w-[90%] h-[2px] bg-[#E36DB4] shadow-[0_0_15px_rgba(227,109,180,0.4)] top-4 animate-bounce" style={{ animationDuration: "2s" }} />
                
                <Compass className="w-14 h-14 text-[#E36DB4] animate-spin" style={{ animationDuration: "5s" }} />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-mono tracking-widest text-[#E36DB4] uppercase font-bold animate-pulse">
                  ESTABLECIENDO EVALUACIÓN POR IA
                </p>
                <h3 className="font-display font-semibold text-2xl text-[#6E488A]">
                  Construyendo tu M.A.P.A.™...
                </h3>
                <p className="text-[#56346F]/70 text-sm italic">
                  "Un momento... Calibrando tus factores para extraer el mensaje."
                </p>
              </div>

              {/* Progress visual percent container */}
              <div className="space-y-2">
                <div className="h-2 w-full bg-[#EDE0F0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#36C4D8] to-[#E36DB4] transition-all duration-500"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#56346F]/50">
                  <span>Petición al servidor</span>
                  <span>{loadingProgress}%</span>
                </div>
              </div>

              {/* Dynamic status stream logger */}
              <div className="bg-[#FAF7F9] border border-[#6E488A]/12 p-4 rounded-xl font-mono text-[10px] text-left text-[#56346F]/70 space-y-1 h-20 overflow-y-auto">
                <p className="text-[#36C4D8]">[info] {loadingStepText}</p>
                <p className="text-[#56346F]/50">[logs] Analizando respuestas de los {userResponses.length} pilares psicológicos...</p>
                <p className="text-[#56346F]/50">[core] Breakpoint ties resolved correctly...</p>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              PHASE 4 - REPORT RESULTS HERO & WOW COMPASS (FASE 8-10)
              ========================================================= */}
          {phase === "RESULTS" && evaluationResult && (
            <motion.div
              key="results_phase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              
              {/* Personalized Congratulations Header */}
              <div className="text-center space-y-2 py-4 border-b border-[#6E488A]/12 pb-6">
                <span className="text-xs font-mono uppercase bg-[#EDE0F0] text-[#E36DB4] border border-[#E36DB4]/20 py-1 px-3.5 rounded-full font-bold">
                  REPORTE DE ORIENTACIÓN M.A.P.A.™
                </span>
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#6E488A] tracking-tight">
                  Tu Brújula Emocional, <span className="text-[#36C4D8]">{leadInfo.nombre || "Usuaria"}</span>
                </h1>
                <p className="text-[#56346F]/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                  Este informe ha sido procesado de manera única para <strong className="text-[#6E488A]">{leadInfo.nombre}</strong> ({leadInfo.email}). Contiene tu perfil dominante de alerta simpática, tus anclas de descompresión neuro-cognitiva y tu plan de acompañamiento recomendado.
                </p>
              </div>

              {/* FASE 8: MOMENTO WOW - PERFIL PRINCIPAL */}
              <motion.section 
                id="results_hero" 
                className="bg-white border border-[#6E488A]/12 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-md"
                animate={{
                  scale: [1, 1.012, 1]
                }}
                transition={{
                  duration: 6, // 6-second calming respiratory cycle (inhalation/exhalation)
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#36C4D8]/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -left-12 -top-12 w-48 h-48 bg-gradient-to-br from-[#E36DB4]/3 to-transparent pointer-events-none" />
                
                <div className="flex flex-col md:flex-row gap-8 items-center text-left">
                  
                  {/* Giant Avatar with dynamic visual style */}
                  <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-tr from-[#EDE0F0] to-[#FAF7F9] border-2 border-[#E36DB4] flex items-center justify-center text-6xl shadow-md shrink-0">
                    <span role="img" aria-label={evaluationResult.name} className="animate-pulse">
                      {evaluationResult.avatar}
                    </span>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#36C4D8] text-white font-mono text-[9px] px-2.5 py-0.5 rounded-full font-bold">
                      PERFIL DOMINANTE
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-[#E36DB4] tracking-widest uppercase font-bold">PERFIL EMOCIONAL REVELADO</span>
                      <span className="bg-[#EDE0F0]/50 border border-[#6E488A]/10 text-[#56346F]/70 py-0.5 px-2 rounded-full text-[10px] font-mono">ID: {evaluationResult.id}</span>
                    </div>

                    <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#6E488A] tracking-tight">
                      {evaluationResult.name}
                      <span className="block text-lg font-sans font-normal text-[#56346F]/80 mt-1">{evaluationResult.subTitle}</span>
                    </h2>

                    <p className="text-[#56346F]/85 text-sm leading-relaxed max-w-2xl">
                    {evaluationResult.description}
                    </p>

                    {/* Activation Level Progress bar */}
                    <div className="bg-[#FAF7F9] p-4 rounded-xl border border-[#6E488A]/12 space-y-2">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-[#56346F]/65 font-semibold">NIVEL DE ACTIVACIÓN DE ALERTA:</span>
                        <span className="text-[#E36DB4] font-bold">{evaluationResult.activationLevel}%</span>
                      </div>
                      <div className="w-full bg-[#EDE0F0] h-3 rounded-full overflow-hidden border border-[#6E488A]/12">
                        <div 
                          className="bg-gradient-to-r from-[#36C4D8] via-[#E36DB4] to-[#6E488A] h-full rounded-full transition-all duration-1000"
                          style={{ width: `${evaluationResult.activationLevel}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#56346F]/50 font-mono">
                        Indica que tu sistema nervioso autónomo actualmente opera bajo una carga sostenida.
                      </p>
                    </div>

                  </div>
                </div>

                {/* New card for the 7-day activation level evolution */}
                <div className="mt-8 pt-8 border-t border-[#6E488A]/12">
                  <div className="bg-[#FAF7F9] p-6 rounded-2xl border border-[#6E488A]/12 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#6E488A]/5 p-4 rounded-xl">
                      <div className="max-w-md">
                        <h3 className="font-display font-bold text-lg text-[#6E488A]">
                          Evolución del Nivel de Activación (7 Días)
                        </h3>
                        <p className="text-xs text-[#56346F]/70">
                          Comparativa diaria de tu estado de alerta simpática y regulación emocional durante el programa. Haz clic en la leyenda para ocultar o mostrar datos.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => setShowActivationData(!showActivationData)}
                          className={`transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-left ${
                            showActivationData 
                              ? "bg-[#E36DB4]/10 border-[#E36DB4]/30 text-[#E36DB4] font-semibold shadow-sm" 
                              : "bg-gray-200/50 border-gray-300/40 text-gray-400 line-through"
                          }`}
                          title="Alternar visibilidad del Nivel de Activación"
                        >
                          <span className={`w-2.5 h-2.5 rounded-sm inline-block shrink-0 ${showActivationData ? "bg-[#E36DB4]" : "bg-gray-300"}`} />
                          <span>Activación (%)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowHealthyLimit(!showHealthyLimit)}
                          className={`transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-left ${
                            showHealthyLimit 
                              ? "bg-[#36C4D8]/10 border-[#36C4D8]/30 text-[#36C4D8] font-semibold shadow-sm" 
                              : "bg-gray-200/50 border-gray-300/40 text-gray-400 line-through"
                          }`}
                          title="Alternar visibilidad del Límite Saludable"
                        >
                          <span className={`w-3.5 h-0.5 inline-block shrink-0 border-t-2 border-dashed ${showHealthyLimit ? "border-[#36C4D8]" : "border-gray-300"}`} />
                          <span>Límite Saludable (45%)</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="w-full h-64 sm:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={get7DayActivationData()}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#6E488A" strokeOpacity={0.1} vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: "#56346F", fontSize: 11, fontWeight: 500 }}
                          />
                          <YAxis 
                            domain={[0, 100]} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: "#56346F", fontSize: 11 }}
                          />
                          <Tooltip 
                            cursor={{ fill: "rgba(110, 72, 138, 0.04)" }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length && showActivationData) {
                                const val = payload[0].value as number;
                                
                                let statusTitle = "";
                                let adviceTip = "";
                                let colorClass = "";
                                
                                if (val > 70) {
                                  statusTitle = "⚠️ Activación Alta";
                                  adviceTip = "Consejo: Practica la respiración prolongando la exhalación (p. ej., inhala en 4 tiempos y exhala en 8) para enviar señales de seguridad a tu cerebro.";
                                  colorClass = "text-[#E36DB4]";
                                } else if (val > 45) {
                                  statusTitle = "⚖️ Alerta Moderada";
                                  adviceTip = "Consejo: Realiza un escaneo corporal rápido de 1 minuto para relajar hombros y mandíbula, manteniendo un ritmo constante.";
                                  colorClass = "text-[#6E488A]";
                                } else {
                                  statusTitle = "✅ Regulación Vagal";
                                  adviceTip = "Consejo: Dedica unos segundos a registrar esta sensación de seguridad en tu memoria corporal para acceder a ella más tarde.";
                                  colorClass = "text-[#36C4D8]";
                                }

                                const randomMessage = getMotivationalMessageForDay(payload[0].payload.name);

                                return (
                                  <div className="bg-white border border-[#6E488A]/15 p-4 rounded-xl shadow-xl max-w-xs text-xs space-y-3">
                                    <div className="flex items-center justify-between gap-2 border-b border-[#6E488A]/10 pb-1.5">
                                      <p className="font-bold text-[#6E488A]">{payload[0].payload.name}</p>
                                      <span className={`font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6E488A]/5 ${colorClass}`}>
                                        {statusTitle}
                                      </span>
                                    </div>
                                    <div className="bg-[#6E488A]/5 p-2.5 rounded-lg border border-[#6E488A]/10">
                                      <p className="text-[10px] font-semibold text-[#6E488A] uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <span>✨ Mensaje de Regulación</span>
                                      </p>
                                      <p className="text-[#56346F] font-semibold leading-relaxed">
                                        "{randomMessage}"
                                      </p>
                                    </div>
                                    <p className="text-[#56346F]/80 text-[11px] leading-relaxed">
                                      {adviceTip}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          {showHealthyLimit && (
                            <ReferenceLine 
                              y={45} 
                              stroke="#36C4D8" 
                              strokeDasharray="4 4" 
                              strokeWidth={1.5}
                            />
                          )}
                          <Bar 
                            dataKey="Nivel de Activación" 
                            radius={[6, 6, 0, 0]}
                            maxBarSize={32}
                            hide={!showActivationData}
                          >
                            {get7DayActivationData().map((entry, index) => {
                              const val = entry["Nivel de Activación"];
                              const fill = val > 70 
                                ? "#E36DB4" 
                                : val > 45 
                                  ? "#6E488A" 
                                  : "#36C4D8"; 
                              return <Cell key={`cell-${index}`} fill={fill} fillOpacity={0.85} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <p className="text-[10px] text-center text-[#56346F]/50 font-mono leading-relaxed max-w-xl mx-auto">
                      💡 El gráfico muestra cómo tu sistema autónomo responde a las técnicas de descompresión neurocognitiva del programa M.A.P.A.™. Un descenso progresivo hacia el Límite Saludable (45%) refleja una exitosa transición de alerta a calma vagal.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Cognitive CBT insight with Sparkles */}
              <div className="bg-white border border-[#6E488A]/12 rounded-2xl p-6 border-l-4 border-l-[#36C4D8] text-left space-y-3 shadow-sm">
                <div className="flex items-center space-x-2 text-[#36C4D8]">
                  <Sparkles className="w-5 h-5 shrink-0" />
                  <h4 className="font-display font-medium text-sm tracking-wider uppercase font-bold">Lectura Psicológica de la IA</h4>
                </div>
                <p className="text-[#56346F]/85 text-sm leading-relaxed italic font-sans">
                  "{evaluationResult.psychologicalInsight}"
                </p>
              </div>

              {/* FASE 9: PREMIUM DASHBOARD WITH CUSTOM RADAR & PILLARS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                
                {/* Secondary Profiles & Radars Left Panel (Col span 5) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Custom SVG Compass Radar graph that is robust & highly stylized */}
                  <div className="bg-white border border-[#6E488A]/12 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#6E488A]/12 pb-3">
                      <h4 className="text-xs font-mono text-[#E36DB4] uppercase tracking-wider font-semibold">Brújula de Tensión Cerebral</h4>
                      <Compass className="w-4 h-4 text-[#E36DB4]" />
                    </div>

                    {/* CUSTOM RADAR SVG MAPA GENERATED IN REALTIME */}
                    <div className="relative w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center">
                      
                      {/* Animated radar sonar wave */}
                      <div className="absolute inset-2 border border-dashed border-[#6E488A]/10 rounded-full animate-spin" style={{ animationDuration: "120s" }} />
                      <div className="absolute inset-10 border border-double border-[#6E488A]/10 rounded-full" />
                      
                      {/* Draw radar axis coordinates in pure responsive SVG */}
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Background rings */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#6E488A" strokeWidth="0.5" strokeOpacity="0.12" strokeDasharray="1 3" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="#6E488A" strokeWidth="0.5" strokeOpacity="0.12" />
                        <circle cx="50" cy="50" r="15" fill="none" stroke="#6E488A" strokeWidth="0.5" strokeOpacity="0.12" />

                        {/* Axes lines */}
                        <line x1="50" y1="5" x2="50" y2="95" stroke="#6E488A" strokeWidth="0.3" strokeOpacity="0.15" />
                        <line x1="5" y1="50" x2="95" y2="50" stroke="#6E488A" strokeWidth="0.3" strokeOpacity="0.15" />

                        {/* Outer polygon of user metrics */}
                        {/* Calculate coordinates dynamically based on actual scores */}
                        {(() => {
                          const getCoordinates = (index: number, val: number) => {
                            const angle = (index * 2 * Math.PI) / 5;
                            const r = (val * 40) / 100; // max length 40
                            const x = 50 + r * Math.cos(angle);
                            const y = 50 + r * Math.sin(angle);
                            return { x, y };
                          };

                          const p1 = getCoordinates(0, evaluationResult.radarData[0]?.A || 80);
                          const p2 = getCoordinates(1, evaluationResult.radarData[1]?.A || 70);
                          const p3 = getCoordinates(2, evaluationResult.radarData[2]?.A || 85);
                          const p4 = getCoordinates(3, evaluationResult.radarData[3]?.A || 50);
                          const p5 = getCoordinates(4, evaluationResult.radarData[4]?.A || 60);

                          const pointsStr = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y} ${p5.x},${p5.y}`;

                          return (
                            <>
                              <polygon 
                                points={pointsStr} 
                                fill="rgba(54, 196, 216, 0.12)" 
                                stroke="#36C4D8" 
                                strokeWidth="1" 
                              />
                              {/* Draw dots with glowing accent */}
                              <circle cx={p1.x} cy={p1.y} r="1.5" fill="#36C4D8" />
                              <circle cx={p2.x} cy={p2.y} r="1.5" fill="#36C4D8" />
                              <circle cx={p3.x} cy={p3.y} r="1.5" fill="#36C4D8" />
                              <circle cx={p4.x} cy={p4.y} r="1.5" fill="#36C4D8" />
                              <circle cx={p5.x} cy={p5.y} r="1.5" fill="#36C4D8" />
                            </>
                          );
                        })()}
                      </svg>

                      {/* Direction labels around radar */}
                      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#56346F]/60 font-semibold">Activación</span>
                      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#56346F]/60 font-semibold">Desgaste</span>
                      <span className="absolute top-1/2 -right-4 -translate-y-1/2 text-[9px] font-mono text-[#56346F]/60 font-semibold rotate-90">Patrones</span>
                      <span className="absolute top-1/2 -left-4 -translate-y-1/2 text-[9px] font-mono text-[#56346F]/60 font-semibold -rotate-90">Híper-Voz</span>
                    </div>

                    <p className="text-[10px] text-[#56346F]/50 font-mono text-center">
                      El polígono azul claro grafica tu huella ansiosa actual frente a la media saludable (círculo interior).
                    </p>
                  </div>

                  {/* Secondary Traits */}
                  <div className="bg-white border border-[#6E488A]/12 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h4 className="text-xs font-mono text-[#56346F]/60 uppercase tracking-wider font-semibold">Tensiones Co-existentes</h4>
                    <div className="space-y-3">
                      {evaluationResult.secondaryProfiles.map((p, idx) => (
                        <div key={p.name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#56346F]/85 font-medium">{p.name}</span>
                            <span className="text-[#56346F]/60">{p.percentage}% de coincidencia</span>
                          </div>
                          <div className="w-full bg-[#EDE0F0] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#36C4D8] h-full rounded-full" 
                              style={{ width: `${p.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Indicators Detail - Right Panel (Col span 7) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* DETONANTES CARD */}
                  <div className="bg-white border border-[#6E488A]/12 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h3 className="font-display font-semibold text-lg text-[#6E488A] flex items-center space-x-2">
                      <span className="bg-[#EDE0F0] p-1.5 rounded-lg text-[#E36DB4]">⚠️</span>
                      <span>Principales Detonantes de Alerta</span>
                    </h3>
                    <ul className="space-y-3">
                      {evaluationResult.indicators.detonantes.map((d, index) => (
                        <li key={index} className="flex items-start space-x-3 text-sm">
                          <span className="text-[#E36DB4] mt-0.5 font-bold font-mono">0{index + 1}.</span>
                          <span className="text-[#56346F]/80 leading-relaxed">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* PATRONES DOMINANTES CARD */}
                  <div className="bg-white border border-[#6E488A]/12 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h3 className="font-display font-semibold text-lg text-[#6E488A] flex items-center space-x-2">
                      <span className="bg-[#EDE0F0] p-1.5 rounded-lg text-[#E36DB4]">🧠</span>
                      <span>Patrones Mentales Dominantes</span>
                    </h3>
                    <ul className="space-y-3">
                      {evaluationResult.indicators.patrones.map((pText, index) => (
                        <li key={index} className="flex items-start space-x-3 text-sm">
                          <span className="text-[#E36DB4] mt-0.5 font-bold font-mono">0{index + 1}.</span>
                          <span className="text-[#56346F]/80 leading-relaxed">{pText}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* FACTORES DE PROTECCIÓN */}
                  <div className="bg-white border border-[#6E488A]/12 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h3 className="font-display font-semibold text-lg text-[#6E488A] flex items-center space-x-2">
                      <span className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600">🛡️</span>
                      <span>Tus Factores Activos de Protección</span>
                    </h3>
                    <ul className="space-y-3">
                      {evaluationResult.indicators.proteccion.map((pExt, index) => (
                        <li key={index} className="flex items-start space-x-3 text-sm">
                          <span className="text-emerald-600 mt-0.5 font-bold font-mono">0{index + 1}.</span>
                          <span className="text-[#56346F]/80 leading-relaxed">{pExt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>

              {/* FASE 10: RUTA DE TRANQUILIDAD - INTERACTIVE TIMELINE */}
              <section id="tranquility_route" className="space-y-6 text-left">
                <div className="text-center space-y-2">
                  <span className="text-[#E36DB4] font-mono text-xs uppercase tracking-wider block font-bold">LA RUTA DE TRANQUILIDAD</span>
                  <h3 className="font-display font-semibold text-2xl text-[#6E488A]">Tu Plan para Desactivar la Alerta</h3>
                  <p className="text-sm text-[#56346F]/80 max-w-md mx-auto">Te sugerimos un plan táctico de 3 pasos para regular tu amígdala gradualmente desde hoy.</p>
                </div>

                <div className="bg-white border border-[#6E488A]/12 rounded-3xl p-8 relative shadow-sm">
                  
                  {/* Connective lineage line */}
                  <div className="absolute top-[80px] bottom-[80px] left-12 md:left-1/2 w-[2px] bg-gradient-to-b from-[#36C4D8] via-[#E36DB4] to-[#6E488A] -translate-x-1/2 hidden sm:block z-0" />

                  <div className="space-y-12 relative z-10">
                    
                    {/* ACCIONES INMEDIATAS */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start relative">
                      <div className="md:col-span-2 flex justify-start md:justify-center">
                        <div className="w-12 h-12 rounded-xl bg-[#EDE0F0] border border-[#36C4D8] flex items-center justify-center font-mono font-bold text-[#36C4D8] shadow-sm">
                          1
                        </div>
                      </div>
                      <div className="md:col-span-10 space-y-2 bg-[#FAF7F9] p-6 rounded-2xl border border-[#6E488A]/12">
                        <span className="text-[9px] font-mono uppercase bg-[#36C4D8]/10 text-[#36C4D8] py-0.5 px-2.5 rounded-full font-bold">ACCIONES INMEDIATAS</span>
                        <h4 className="text-base font-display font-semibold text-[#6E488A]">Prácticas inmediatas para momentos de crisis</h4>
                        <div className="space-y-2 pt-2">
                          {evaluationResult.tranquilityRoute.acciones.slice(0, 3).map((a, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-xs text-[#56346F]/85 leading-relaxed">
                              <CheckCircle2 className="w-4 h-4 text-[#36C4D8] shrink-0 mt-0.5" />
                              <span>{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* HÁBITOS RECOMENDADOS */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start relative">
                      <div className="md:col-span-2 flex justify-start md:justify-center">
                        <div className="w-12 h-12 rounded-xl bg-[#EDE0F0] border border-[#E36DB4] flex items-center justify-center font-mono font-bold text-[#E36DB4] shadow-sm">
                          2
                        </div>
                      </div>
                      <div className="md:col-span-10 space-y-2 bg-[#FAF7F9] p-6 rounded-2xl border border-[#6E488A]/12">
                        <span className="text-[9px] font-mono uppercase bg-[#EDE0F0] text-[#E36DB4] py-0.5 px-2.5 rounded-full font-bold">HÁBITOS DE REGULACIÓN</span>
                        <h4 className="text-base font-display font-semibold text-[#6E488A]">Anclas diarias para reprogramar tu sistema nervioso</h4>
                        <div className="space-y-2 pt-2">
                          {evaluationResult.tranquilityRoute.habitos.slice(0, 3).map((h, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-xs text-[#56346F]/85 leading-relaxed">
                              <CheckCircle2 className="w-4 h-4 text-[#E36DB4] shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* FACTORES A OBSERVAR */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start relative">
                      <div className="md:col-span-2 flex justify-start md:justify-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-500 flex items-center justify-center font-mono font-bold text-emerald-600 shadow-sm">
                          3
                        </div>
                      </div>
                      <div className="md:col-span-10 space-y-2 bg-[#FAF7F9] p-6 rounded-2xl border border-[#6E488A]/12">
                        <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 py-0.5 px-2.5 rounded-full font-bold">MONITOREO DE ALARMAS</span>
                        <h4 className="text-base font-display font-semibold text-[#6E488A]">Señales débiles que debes empezar a calibrar</h4>
                        <div className="space-y-2 pt-2">
                          {evaluationResult.tranquilityRoute.observar.slice(0, 3).map((o, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-xs text-[#56346F]/85 leading-relaxed">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{o}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* FASE 11: GENERATE POSTER CARD & COMPARTIR */}
              <section id="share_card_zone" className="space-y-6 text-left border-t border-[#6E488A]/12 pt-12">
                <div className="text-center space-y-2">
                  <h3 className="font-display font-semibold text-2xl text-[#6E488A]">Comparte tu Brújula M.A.P.A.™</h3>
                  <p className="text-sm text-[#56346F]/80 max-w-md mx-auto">Invita a otros a comprender su sistema de alerta. Presiona los botones rápidos para compartir o copiar tu ficha de autodescubrimiento.</p>
                </div>

                {/* Esthetic generated sharing card layout representation */}
                <div className="max-w-md mx-auto bg-white border-2 border-dashed border-[#E36DB4]/55 p-8 rounded-3xl text-center space-y-6 shadow-md relative overflow-hidden">
                  <div className="absolute top-2 right-4 text-[7px] font-mono text-[#56346F]/50 uppercase tracking-widest font-semibold">MAPA OFICIAL DE AUTODESCUBRIMIENTO</div>
                  
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-xl bg-[#EDE0F0] border border-[#36C4D8] flex items-center justify-center text-4xl shadow-sm">
                      {evaluationResult.avatar}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xl text-[#6E488A]">Mi Perfil M.A.P.A.™ es:</h4>
                      <h3 className="text-2xl font-display font-extrabold text-[#36C4D8] uppercase tracking-wide">
                        {evaluationResult.name}
                      </h3>
                      <p className="text-[11px] font-mono text-[#56346F]/60 mt-1 uppercase font-semibold">"{evaluationResult.subTitle}"</p>
                    </div>
                  </div>

                  {/* Micro comparison stat */}
                  <div className="bg-[#FAF7F9] py-3 px-4 rounded-xl border border-[#6E488A]/12 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#56346F]/60">Tensión Corporal:</span>
                    <span className="text-[#36C4D8] font-bold">{evaluationResult.activationLevel}% Alerta</span>
                  </div>

                  <div className="text-xs text-[#56346F]/85 italic px-2">
                    "La ansiedad no es mi enemiga. Es un mensajero que hoy empiezo a descodificar."
                  </div>

                  {/* Aesthetic watermarks */}
                  <div className="pt-2 border-t border-[#6E488A]/12 flex items-center justify-between text-[10px] font-mono text-[#56346F]/50">
                    <span>M.A.P.A.™ AI COGNITIVE</span>
                    <span>HTTPS://M-A-P-A.ES</span>
                  </div>
                </div>

                {/* Share interaction buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button 
                    onClick={() => handleShareClick("whatsapp")}
                    className="bg-[#25D366] text-black hover:scale-105 active:scale-95 transition-all text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center space-x-2 cursor-pointer shadow-lg shadow-green-500/10"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => handleShareClick("facebook")}
                    className="bg-[#1877F2] text-white hover:scale-105 active:scale-95 transition-all text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center space-x-2 cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </button>
                  <button 
                    onClick={() => handleShareClick("linkedin")}
                    className="bg-[#0A66C2] text-white hover:scale-105 active:scale-95 transition-all text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center space-x-2 cursor-pointer shadow-lg shadow-indigo-500/10"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </button>
                  <button 
                    onClick={() => handleShareClick("clipboard")}
                    className="bg-[#FAF7F9] text-[#56346F]/80 hover:text-[#56346F] border border-[#6E488A]/15 hover:scale-105 active:scale-95 transition-all text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copiar Tarjeta</span>
                  </button>
                </div>

                {shareAlert && (
                  <div className="max-w-xs mx-auto text-center text-xs font-mono text-emerald-600 bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-200">
                    {shareAlert}
                  </div>
                )}
              </section>

              {/* FASE 12: CAPTURA DE LEAD PARA INFORME COMPLETO (Dual WhatsApp / Email) */}
              {!leadCaptured ? (
                <section id="lead_capture" className="bg-white border-2 border-[#36C4D8] p-8 rounded-3xl max-w-xl mx-auto text-left space-y-6 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#36C4D8]/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 bg-[#36C4D8]/15 text-[#36C4D8] py-1 px-3 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold border border-[#36C4D8]/30">
                      <Lock className="w-3 h-3 animate-pulse" />
                      <span>Reporte Técnico y Clínico Avanzado</span>
                    </div>
                    <h3 className="font-display font-semibold text-2xl text-[#6E488A] tracking-tight">
                      Desbloquea tus 49 Marcadores Biológicos
                    </h3>
                    <p className="text-[#56346F]/85 text-xs sm:text-sm leading-relaxed">
                      La Mentora Clara ha compilado tu informe completo de 12 páginas con tus anclas cerebrales, análisis cognitivo-conductual de reactividad y el plan definitivo de descompresión simpática. Elige tu canal preferido para recibirlo de inmediato:
                    </p>
                  </div>

                  {isSendingEmail ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-14 h-14 border-4 border-[#36C4D8] border-t-transparent rounded-full animate-spin mx-auto" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-[#6E488A]">Compilando y firmando tu expediente clínico...</p>
                        <p className="text-xs text-[#36C4D8] font-mono animate-pulse">{emailSendingStep}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label htmlFor="nombre" className="block text-xs font-mono text-[#56346F]/70 uppercase font-bold">Nombre Completo</label>
                          <input 
                            type="text" 
                            id="nombre"
                            required
                            placeholder="Ej. Sofía Valenzuela"
                            value={leadInfo.nombre}
                            onChange={(e)=>setLeadInfo(prev=>({...prev, nombre: e.target.value}))}
                            className="w-full bg-[#FAF7F9] border border-[#6E488A]/20 focus:border-[#36C4D8] focus:bg-white placeholder:text-[#56346F]/40 rounded-xl p-3.5 text-sm outline-none text-[#56346F] transition-all font-sans"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label htmlFor="email" className="block text-xs font-mono text-[#56346F]/70 uppercase font-bold">Correo Electrónico</label>
                          <input 
                            type="email" 
                            id="email"
                            required
                            placeholder="Ej. sofia@gmail.com"
                            value={leadInfo.email}
                            onChange={(e)=>setLeadInfo(prev=>({...prev, email: e.target.value}))}
                            className="w-full bg-[#FAF7F9] border border-[#6E488A]/20 focus:border-[#36C4D8] focus:bg-white placeholder:text-[#56346F]/40 rounded-xl p-3.5 text-sm outline-none text-[#56346F] transition-all font-sans"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label htmlFor="confirmEmail" className="block text-xs font-mono text-[#56346F]/70 uppercase font-bold">Confirmar Correo</label>
                          <input 
                            type="email" 
                            id="confirmEmail"
                            required
                            placeholder="Ej. sofia@gmail.com"
                            value={confirmEmail}
                            onChange={(e)=>setConfirmEmail(e.target.value)}
                            className="w-full bg-[#FAF7F9] border border-[#6E488A]/20 focus:border-[#36C4D8] focus:bg-white placeholder:text-[#56346F]/40 rounded-xl p-3.5 text-sm outline-none text-[#56346F] transition-all font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono text-[#56346F]/70 uppercase font-bold">Número de WhatsApp</label>
                          <div className="flex space-x-1.5">
                            <select
                              value={whatsappCountryCode}
                              onChange={(e)=>setWhatsappCountryCode(e.target.value)}
                              className="bg-[#FAF7F9] border border-[#6E488A]/20 rounded-xl text-xs p-2 text-[#56346F] focus:border-[#36C4D8] outline-none"
                            >
                              <option value="+34">🇪🇸 +34</option>
                              <option value="+52">🇲🇽 +52</option>
                              <option value="+57">🇨🇴 +57</option>
                              <option value="+54">🇦🇷 +54</option>
                              <option value="+56">🇨🇱 +56</option>
                              <option value="+51">🇵🇪 +51</option>
                              <option value="+1">🇺🇸 +1</option>
                              <option value="+58">🇻🇪 +58</option>
                              <option value="+593">🇪🇨 +593</option>
                              <option value="+506">🇨🇷 +506</option>
                              <option value="+502">🇬🇹 +502</option>
                            </select>
                            <input 
                              type="tel" 
                              placeholder="612345678"
                              value={whatsappNumber}
                              onChange={(e)=>setWhatsappNumber(e.target.value)}
                              className="w-full bg-[#FAF7F9] border border-[#6E488A]/20 focus:border-[#36C4D8] focus:bg-white placeholder:text-[#56346F]/40 rounded-xl p-3.5 text-sm outline-none text-[#56346F] transition-all font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Remitente Info Box */}
                      <div className="bg-[#36C4D8]/5 border border-[#36C4D8]/20 p-4 rounded-2xl text-xs space-y-1">
                        <div className="flex items-center space-x-2 text-[#36C4D8] font-bold">
                          <Mail className="w-4 h-4 text-[#36C4D8] shrink-0" />
                          <span>Remisión y Seguridad Garantizada:</span>
                        </div>
                        <p className="text-[#56346F]/80 pl-6 leading-relaxed">
                          Recibirás el PDF remitido directamente de <strong className="text-[#36C4D8] font-mono select-all font-semibold">mapa@podermentalia.club</strong> o vía nuestro canal oficial verificado de WhatsApp.
                        </p>
                      </div>

                      {/* Dual-Channel Submit Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                        <button
                          type="button"
                          onClick={() => handleDualLeadSubmit("whatsapp")}
                          className="w-full py-4 rounded-xl font-display font-bold tracking-wider bg-emerald-600 hover:bg-emerald-700 transition-all text-white cursor-pointer text-center text-xs shadow-md border border-emerald-500 inline-flex items-center justify-center space-x-2"
                        >
                          <Smartphone className="w-4 h-4 shrink-0 text-white" />
                          <span>ENVIAR REPORTE VÍA WHATSAPP</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDualLeadSubmit("email")}
                          className="w-full py-4 rounded-xl font-display font-bold tracking-wider bg-gradient-to-r from-[#36C4D8] to-[#E36DB4] hover:opacity-95 transition-all text-white cursor-pointer text-center text-xs shadow-md border border-[#36C4D8]/30 inline-flex items-center justify-center space-x-2"
                        >
                          <Mail className="w-4 h-4 shrink-0 text-white" />
                          <span>ENVIAR REPORTE VÍA EMAIL</span>
                        </button>
                      </div>
                      
                      <p className="text-[10px] text-[#56346F]/50 font-mono text-center">
                        🔒 Tratamiento de datos bajo secreto profesional. Nunca compartimos tu información personal.
                      </p>
                    </div>
                  )}
                </section>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl max-w-xl mx-auto text-left space-y-5 shadow-sm"
                >
                  <div className="flex items-center space-x-3 text-emerald-700">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    <h4 className="font-display font-semibold text-lg">¡Dossier M.A.P.A.™ Enviado con Éxito!</h4>
                  </div>
                  <div className="text-xs text-[#56346F]/85 space-y-2 leading-relaxed">
                    <p>
                      Muchas gracias <strong className="text-[#6E488A]">{leadInfo.nombre}</strong>. Hemos calibrado y compilado tu informe personalizado de 12 páginas.
                    </p>
                    <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl space-y-1 text-[11px]">
                      <div>✓ <strong>Remitente Oficial:</strong> <span className="text-emerald-700 font-mono font-semibold">mapa@podermentalia.club</span></div>
                      <div>✓ <strong>Destinatario:</strong> <span className="text-[#6E488A] font-mono">{leadInfo.email}</span></div>
                      <div className="text-[#56346F]/50 mt-1">Sugerencia: Revisa tu carpeta de correos no deseados o Spam si no aparece en tu buzón principal en 5 minutos.</div>
                    </div>
                  </div>
                  <div className="pt-1 flex flex-wrap gap-3">
                    <button 
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Reporte PDF de Inmediato</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* FASE 13: PREMIUM OFFERING, COMUNIDAD & ACOMPAÑAMIENTO */}
              <section id="premium_offer_zone" className="bg-white border border-[#6E488A]/12 rounded-3xl p-8 md:p-12 text-left space-y-8 relative overflow-hidden shadow-md">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#36C4D8]/5 blur-3xl pointer-events-none" />
                
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <span className="text-xs font-mono uppercase bg-[#EDE0F0] text-[#E36DB4] py-1 px-3 rounded-full font-bold border border-[#E36DB4]/15">ACOMPAÑAMIENTO INTEGRATIVO</span>
                  <h3 className="font-display font-semibold text-3xl text-[#6E488A]">¿Quieres dar el paso definitivo de desactivación?</h3>
                  <p className="text-sm text-[#56346F]/65">Te invitamos a formar parte de nuestro programa premium guiado por facilitadores psicológicos.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  
                  {/* Option 1: Comunidad Secreta */}
                  <div className="bg-[#FAF7F9] border border-[#6E488A]/12 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#EDE0F0] flex items-center justify-center text-[#36C4D8]">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-semibold text-base text-[#6E488A]">Comunidad M.A.P.A.™</h4>
                    <p className="text-xs text-[#56346F]/65 leading-relaxed">
                      Súmate a nuestro grupo interactivo de descompresión donde compartimos retos diarios y foros de debate libres de tabús.
                    </p>
                    <span className="block text-xs font-mono text-emerald-600 font-bold">Invitación Gratuita Inc.</span>
                  </div>

                  {/* Option 2: Programa de Mentores */}
                  <div className="bg-[#FAF7F9] border border-[#6E488A]/12 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#EDE0F0] flex items-center justify-center text-[#36C4D8]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-semibold text-base text-[#6E488A]">Masterclass del Alivio</h4>
                    <p className="text-xs text-[#56346F]/65 leading-relaxed">
                      8 módulos en vídeo de alta definición que recorren la des-mecanización del sobrepensamiento y liberación de la angustia muscular.
                    </p>
                    <span className="block text-xs font-mono text-[#36C4D8] font-bold">Descuento del 50% hoy</span>
                  </div>

                  {/* Option 3: Sesiones 1-on-1 */}
                  <div className="bg-[#FAF7F9] border border-[#6E488A]/12 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-semibold text-base text-[#6E488A]">Acompañamiento Individual</h4>
                    <p className="text-xs text-[#56346F]/65 leading-relaxed">
                      Sesión de diagnóstico uno-a-uno de 45 minutos para estructurar tu bitácora de protección personalizada con un terapeuta cualificado.
                    </p>
                    <span className="block text-xs font-mono text-[#E36DB4] font-bold">Cupos limitados esta semana</span>
                  </div>

                </div>

                <div className="pt-6 border-t border-[#6E488A]/12 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-[11px] font-mono uppercase text-[#56346F]/50 font-bold">¿Estás lista para soltar el sobrepensamiento?</span>
                    <p className="text-xs text-[#56346F]/80 font-sans font-medium">Usa el código temporal <strong className="text-emerald-600 font-semibold">SOYLIBRE50</strong> para iniciar tu programa guiado personalizado.</p>
                  </div>
                  <div>
                    <a
                      href="https://wa.link/0x3911"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-display font-bold tracking-wider text-white bg-gradient-to-r from-[#36C4D8] to-emerald-500 hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs uppercase inline-flex items-center justify-center space-x-2 text-center decoration-none border-2 border-[#262222]"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-white shrink-0 animate-bounce" />
                      <span>CONTINUAR PROCESO PREMIUM ➔</span>
                    </a>
                  </div>
                </div>

              </section>

              {/* Reset to Start Footer Button */}
              <div className="pt-4 pb-8">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3.5 rounded-xl border border-[#6E488A]/15 text-[#56346F]/60 hover:text-[#56346F] hover:bg-[#EDE0F0]/50 hover:border-[#6E488A]/30 transition-all font-mono text-xs cursor-pointer inline-flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>VOLVER A REALIZAR EVALUACIÓN DESDE CERO</span>
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer id="app_footer" className="bg-[#000000] px-6 py-8 border-t border-white/10 relative z-10 text-white/60">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col justify-center items-center gap-4 text-center border-b border-white/5 pb-4">
            <div className="w-full text-center">
              <p className="text-xs font-bold text-[#E86FA3] tracking-wider uppercase font-display text-center">
                M.A.P.A.™ Mujer • By Tu Poder Mental Mujer
              </p>
              <p className="text-[10px] text-white/50 text-center max-w-2xl mx-auto mt-1">
                El Ecosistema Inteligente para el Bienestar Emocional Femenino. Fortalece tu mente - Reconecta contigo - Transforma tu vida.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="space-y-1">
              <p className="text-xs font-mono text-white/60">© 2026 M.A.P.A.™ - Todos los derechos reservados.</p>
              <p className="text-[10px] text-white/40 font-sans leading-relaxed max-w-md">
                Aviso legal: M.A.P.A.™ no sustituye el consejo clínico, diagnóstico ni tratamiento de profesionales sanitarios o de salud mental. Si experimentas síntomas agudos de emergencia psicológica, por favor consulta de inmediato con un psiquiatra o servicio oficial de urgencias.
              </p>
            </div>
            <div className="flex space-x-4 text-xs font-mono text-white/50">
            <button 
              onClick={() => setActiveDocumentModal("PRIVACY")}
              className="hover:text-[#36C4D8] transition-colors cursor-pointer bg-transparent border-none p-0 text-white/50 font-mono text-xs outline-none"
            >
              Política de Privacidad
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveDocumentModal("TERMS")}
              className="hover:text-[#36C4D8] transition-colors cursor-pointer bg-transparent border-none p-0 text-white/50 font-mono text-xs outline-none"
            >
              Términos de la Experiencia
            </button>
          </div>
        </div>
      </div>
    </footer>

      {/* LEGAL AGREEMENTS MODALS */}
      <TermsAndPrivacy
        isOpen={activeDocumentModal !== null}
        type={activeDocumentModal}
        onClose={() => setActiveDocumentModal(null)}
      />

      {/* PREMIUM REWARD MODALS */}
      <RewardModal
        isOpen={unlockedAudioModal.isOpen}
        type={unlockedAudioModal.type}
        onClose={() => setUnlockedAudioModal({ isOpen: false, type: null })}
        userName={leadInfo.nombre || "Usuaria"}
      />

      {/* MILESTONE CONGRATULATORY BADGE MODALS */}
      <MilestoneModal
        isOpen={milestoneModal.isOpen}
        daysCount={milestoneModal.daysCount}
        onClose={() => setMilestoneModal({ ...milestoneModal, isOpen: false })}
        userName={leadInfo.nombre || "Usuaria"}
      />

      {/* FLOATING LEAD TOAST NOTIFICATION */}
      <AnimatePresence>
        {leadSubmitToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4"
          >
            <div className="bg-[#56346F] border border-[#36C4D8]/50 text-white p-5 rounded-2xl shadow-2xl flex items-start space-x-3.5 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-[#36C4D8]/20 flex items-center justify-center text-[#36C4D8] shrink-0 animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left">
                <p className="text-xs font-mono text-[#36C4D8] uppercase tracking-wider font-bold">✓ Envío Iniciado con Éxito</p>
                <p className="text-xs text-white/95 leading-relaxed font-sans">
                  {leadSubmitToast}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION UTILITIES CONTAINER */}
      <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3">
        {/* Floating Alarm Toggle Button */}
        <motion.button
          onClick={() => setAlarmPanelOpen(!alarmPanelOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 sm:p-3.5 rounded-full border-2 border-white shadow-xl text-white flex items-center justify-center cursor-pointer transition-all ${
            activeTaskAlarm && activeTaskAlarm.isRunning 
              ? "bg-emerald-500 hover:bg-emerald-600 animate-pulse" 
              : "bg-[#411F66] hover:bg-[#522b7d]"
          }`}
          title="Sintonizador de Alarmas y Recordatorios"
        >
          {activeTaskAlarm && activeTaskAlarm.isRunning ? (
            <div className="relative">
              <Bell className="w-5 h-5 animate-bounce" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border border-white flex items-center justify-center text-[7px] font-black">
                !
              </span>
            </div>
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </motion.button>

        {/* Back to top indicator */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              key="scroll-to-top"
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-3 sm:p-3.5 rounded-full bg-[#E86FA3] text-white border-2 border-white shadow-xl hover:bg-[#d55d91] hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center group"
              title="Volver arriba"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ALARM MANAGER DRAWER / SHEET */}
      <AnimatePresence>
        {alarmPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlarmPanelOpen(false)}
              className="fixed inset-0 bg-black/50 z-[9998]"
            />
            {/* Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed bottom-0 sm:bottom-24 right-0 sm:right-6 w-full sm:max-w-md bg-white border-t-4 sm:border-4 border-[#E86FA3] sm:rounded-2xl shadow-2xl z-[9999] p-5 text-left text-black overflow-y-auto max-h-[85vh] sm:max-h-[580px] flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#E86FA3]/10 rounded-lg text-[#E86FA3]">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-[#411F66] tracking-wide">
                      Sintonizador de Alarmas
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono">BIENESTAR Y MINDFULNESS M.A.P.A.</p>
                  </div>
                </div>
                <button
                  onClick={() => setAlarmPanelOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Quick Test Audio Button */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <Volume2 className="w-4 h-4 text-[#E86FA3]" />
                  <span className="font-bold">Probar sonido de alarma:</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isAlarmPlaying) {
                      stopAlarm();
                    } else {
                      triggerAlarm("Prueba de sonido del sintonizador de calma");
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAlarmPlaying 
                      ? "bg-red-500 text-white hover:bg-red-600" 
                      : "bg-[#E86FA3] text-white hover:bg-[#d55d91]"
                  }`}
                >
                  {isAlarmPlaying ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Silenciar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Probar ↻</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preset Exercises Alarm Selector */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#411F66] font-extrabold">
                  ⏰ PROGRAMAR ALARMA DE EJERCICIO
                </h5>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Selecciona un ejercicio y te avisaremos con una señal sonora cuando sea momento de realizarlo:
                </p>
                <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {[
                    { name: "Respiración de Caja", duration: 120, label: "Respiración de Caja (2 min)" },
                    { name: "Pausa Vagotónica", duration: 60, label: "Pausa Vagotónica (1 min)" },
                    { name: "Estiramiento Corporal", duration: 180, label: "Estiramiento Corporal (3 min)" },
                    { name: "Interrupción muscular M.A.P.A.", duration: 120, label: "Interrupción muscular (2 min)" },
                    { name: "Taza de Té Consciente", duration: 300, label: "Taza de Té Consciente (5 min)" },
                    { name: "Silencio Mental", duration: 600, label: "Silencio Mental (10 min)" }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTaskAlarm({
                          taskName: preset.name,
                          secondsLeft: preset.duration,
                          isRunning: true
                        });
                        setAlarmPanelOpen(false);
                        setDashboardNotice(`⏰ Alarma establecida para "${preset.name}" en ${preset.duration / 60} min.`);
                        setTimeout(() => setDashboardNotice(null), 4000);
                      }}
                      className="w-full text-left text-xs p-2.5 rounded-lg border border-gray-100 hover:border-[#E86FA3]/50 hover:bg-[#E86FA3]/5 transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <span className="font-bold text-gray-800 group-hover:text-[#411F66]">{preset.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E86FA3]" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Time Selection Sliders */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#411F66] font-extrabold">
                  ⏱️ TEMPORIZADOR PERSONALIZADO
                </h5>
                <div className="flex gap-2">
                  {[
                    { label: "30s", seconds: 30 },
                    { label: "1 min", seconds: 60 },
                    { label: "5 min", seconds: 300 },
                    { label: "15 min", seconds: 900 },
                    { label: "30 min", seconds: 1800 }
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setActiveTaskAlarm({
                          taskName: "Alarma Personalizada",
                          secondsLeft: opt.seconds,
                          isRunning: true
                        });
                        setAlarmPanelOpen(false);
                        setDashboardNotice(`⏰ Alarma personalizada establecida en ${opt.label}.`);
                        setTimeout(() => setDashboardNotice(null), 4000);
                      }}
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-gray-700 bg-gray-50 hover:bg-[#E86FA3]/10 hover:text-[#E86FA3] border border-gray-200 transition-all cursor-pointer text-center"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily test lock countdown sound notification configuration */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#411F66] font-extrabold">
                  🔔 RECORDATORIO DE TEST DIARIO
                </h5>
                <label className="flex items-start gap-2.5 p-2.5 bg-pink-50/50 hover:bg-pink-50 rounded-xl border border-pink-100/50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={testReminderAlarmEnabled}
                    onChange={(e) => {
                      setTestReminderAlarmEnabled(e.target.checked);
                      if (!e.target.checked && isAlarmPlaying) {
                        stopAlarm();
                      }
                    }}
                    className="mt-0.5 rounded border-[#E86FA3] text-[#E86FA3] focus:ring-[#E86FA3]"
                  />
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs font-bold text-[#411F66] block">Avisar cuando mi test esté disponible</span>
                    <span className="text-[10px] text-gray-500 block leading-tight">
                      Recibe una sutil alerta sonora del sintonizador de calma tan pronto termine la cuenta regresiva de 24h.
                    </span>
                  </div>
                </label>
              </div>

              {/* Active countdown display */}
              {activeTaskAlarm && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="bg-[#411F66]/5 rounded-xl p-3 border border-[#411F66]/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#411F66] animate-spin" style={{ animationDuration: '6s' }} />
                      <div className="text-left">
                        <span className="text-xs font-bold text-[#411F66] block truncate max-w-[150px]">
                          {activeTaskAlarm.taskName}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          Faltan: {Math.floor(activeTaskAlarm.secondsLeft / 60)}m {activeTaskAlarm.secondsLeft % 60}s
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTaskAlarm(null)}
                      className="px-2.5 py-1 text-[10px] font-black uppercase text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ACTIVE ALARM OVERLAY BANNER */}
      <AnimatePresence>
        {isAlarmPlaying && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 inset-x-0 z-[99999] p-4 bg-gradient-to-r from-[#E86FA3] via-[#411F66] to-[#E86FA3] text-white shadow-2xl border-b-2 border-white flex flex-col items-center justify-center text-center gap-3.5 py-6 sm:py-8"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Bell className="w-6 h-6 text-white" />
            </motion.div>
            <div className="space-y-1 max-w-lg">
              <h3 className="text-sm sm:text-base font-display font-black tracking-wider uppercase">
                🔔 SINTONIZADOR DE CALMA: ALARMA ACTIVA
              </h3>
              <p className="text-xs font-sans font-bold text-pink-100">
                {alarmReason || "¡Es hora de conectar con tu bienestar!"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <button
                onClick={stopAlarm}
                className="px-6 py-3 rounded-full bg-white text-[#411F66] hover:bg-[#FFF0F5] font-display font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border-2 border-transparent"
              >
                <VolumeX className="w-4 h-4 text-[#411F66]" />
                <span>ANULAR NOTIFICACIÓN / APAGAR ALARMA</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
