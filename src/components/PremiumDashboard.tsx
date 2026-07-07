import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  MessageSquare,
  Activity,
  Award,
  Trophy,
  Shield,
  Heart,
  Send,
  Check,
  Share2,
  Clock,
  RotateCcw,
  Zap,
  Info,
  CheckCircle,
  Volume2,
  Smile,
  AlertTriangle,
  ArrowRight,
  User,
  HeartHandshake,
  Mail,
  Brain,
  BookOpen,
  Download
} from "lucide-react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "motion/react";
import { PeaceGarden } from "./PeaceGarden";
import { COACH_CATEGORIES, analyzeUserMessage, GENERIC_SUPPORT_RESPONSE } from "../data/coachData";
import { useWhatsAppShare } from "../utils/useWhatsAppShare";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface PremiumDashboardProps {
  userEmail: string;
  userName: string;
  onAudioSelect?: (themeType: string) => void;
  currentDay?: number;
  completedDays?: number[];
  onTriggerMilestone?: (days: number) => void;
}

interface ChatMessage {
  role: "user" | "coach";
  content: string;
  timestamp: string;
}

interface Challenge {
  id: string;
  dayNum: number;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  userInputRequired?: boolean;
  placeholderText?: string;
}

// Beautiful pool of dynamic challenges representing different dimensions of wellness
const ALL_CHALLENGES_POOL: Challenge[] = [
  {
    id: "pool_1",
    dayNum: 1,
    title: "Respiración Consciente Guiada",
    description: "Realiza 2 minutos de respiración guiada mediante el módulo de Botón de Pánico o usa la técnica 4-7-8.",
    xpReward: 50,
    completed: false
  },
  {
    id: "pool_2",
    dayNum: 1,
    title: "Frasco de Agradecimiento",
    description: "Escribe 3 cosas positivas que hayan sucedido hoy de las que te sientas agradecido.",
    xpReward: 50,
    completed: false,
    userInputRequired: true,
    placeholderText: "1. Hoy logré...  2. Mi familia...   3. El clima estuvo..."
  },
  {
    id: "pool_3",
    dayNum: 1,
    title: "Desconexión Digital Saludable",
    description: "Pasa al menos 10 minutos enteros caminando al aire libre o descansando sin revisar tu teléfono móvil.",
    xpReward: 50,
    completed: false
  },
  {
    id: "pool_4",
    dayNum: 1,
    title: "Conexión de Soporte Social",
    description: "Llama, escribe o conversa en persona con alguien importante en tu vida, compartiendo cómo estás auténticamente.",
    xpReward: 50,
    completed: false
  },
  {
    id: "pool_5",
    dayNum: 1,
    title: "Análisis de Pensamientos de Ansiedad",
    description: "Identifica un pensamiento de preocupación actual y escríbelo. Luego responde: ¿Cuento con evidencia real e indiscutible que valide que ocurrirá de esa forma?",
    xpReward: 75,
    completed: false,
    userInputRequired: true,
    placeholderText: "Escribe tu pensamiento reactivo y tu cuestionamiento racional aquí..."
  },
  {
    id: "pool_6",
    dayNum: 1,
    title: "Escaneo Corporal Somático",
    description: "Dedica 3 minutos a cerrar los ojos y recorrer mentalmente tu cuerpo desde la coronilla hasta los pies, soltando tensiones.",
    xpReward: 50,
    completed: false
  },
  {
    id: "pool_7",
    dayNum: 1,
    title: "Escribir y Soltar Rumiaciones",
    description: "Pon por escrito de forma libre tus preocupaciones repetitivas durante 2 minutos. Luego respira hondo y visualiza cómo las dejas ir.",
    xpReward: 60,
    completed: false,
    userInputRequired: true,
    placeholderText: "Escribe libremente todo lo que está saturando tu mente en este momento..."
  },
  {
    id: "pool_8",
    dayNum: 1,
    title: "Caminata de Consciencia Sensorial",
    description: "Camina un trayecto corto prestando atención exclusiva a 5 cosas que puedas ver, 4 que puedas tocar, 3 que escuches y 2 que huelas.",
    xpReward: 55,
    completed: false
  },
  {
    id: "pool_9",
    dayNum: 1,
    title: "Anclaje de Autocompasión",
    description: "Escríbete una breve nota de aliento amable a ti mismo, tratándote como lo harías con tu mejor amigo en un momento difícil.",
    xpReward: 65,
    completed: false,
    userInputRequired: true,
    placeholderText: "Yo sé que hoy te sientes... pero recuerda que..."
  },
  {
    id: "pool_10",
    dayNum: 1,
    title: "Estiramiento Somático de Mandíbula y Hombros",
    description: "Inhala elevando tus hombros hacia las orejas, y exhala dejándolos caer de golpe. Abre tu mandíbula de lado a lado para liberar tensión acumulada.",
    xpReward: 50,
    completed: false
  },
  {
    id: "pool_11",
    dayNum: 1,
    title: "Establecer un Límite Saludable",
    description: "Reflexiona sobre tu día e identifica una situación donde pusiste un límite claro o decidiste priorizar tu propia calma mental.",
    xpReward: 60,
    completed: false,
    userInputRequired: true,
    placeholderText: "Hoy decidí cuidar mi energía diciendo o haciendo..."
  },
  {
    id: "pool_12",
    dayNum: 1,
    title: "Alimentación Consciente",
    description: "Durante tu próxima comida, mastica lentamente los primeros 5 bocados de forma exclusiva, saboreando texturas, temperaturas y sabores.",
    xpReward: 50,
    completed: false
  }
];

// Generates 4 unique challenges per day based on calendar date seed so that the daily challenges are renewed every day!
const getDailyChallenges = (): Challenge[] => {
  const dateObj = new Date();
  const daySeed = dateObj.getDate() + (dateObj.getMonth() * 31) + dateObj.getFullYear();
  const selected: Challenge[] = [];
  const indices = new Set<number>();
  
  let index = daySeed % ALL_CHALLENGES_POOL.length;
  while (selected.length < 4) {
    if (!indices.has(index)) {
      indices.add(index);
      const ch = ALL_CHALLENGES_POOL[index];
      selected.push({
        ...ch,
        dayNum: selected.length + 1
      });
    }
    index = (index + 1) % ALL_CHALLENGES_POOL.length;
  }
  return selected;
};

interface EvolutionData {
  activacion: number;
  ansiedad: number;
  rumiacion: number;
  sueno: number;
}

interface DiaryEntry {
  date: string;
  note: string;
  mood?: string;
  xpEarned?: number;
}

interface PremiumData {
  points: number;
  coachHistory: ChatMessage[];
  completedChallenges: string[]; // ids
  challengeAnswers: { [key: string]: string };
  evolutionLogs: { date: string; value: EvolutionData }[];
  diaryEntries?: DiaryEntry[];
}

const getDayThemeMessage = (day: number, name: string) => {
  const themes = [
    `Día 1: Tu cuerpo es el mapa, querida ${name}. Hoy nos enfocamos en desactivar la alarma física y recuperar la calma corporal.`,
    `Día 2: Blindar tus sentidos, querida ${name}. Hoy protegemos tu sistema nervioso del ruido ambiental y de la sobreestimulación de estímulos.`,
    `Día 3: Desarmar la mente inquieta, querida ${name}. Hoy desmontamos esos pensamientos futuros catastróficos que agotan tu energía de paz.`,
    `Día 4: Límites con amor y ternura, querida ${name}. Hoy cuidamos tu empatía para evitar la sobrecarga y la complacencia reactiva con otros.`,
    `Día 5: Soltar el control ríspido, querida ${name}. Aprendemos a delegar y permitimos que la vida fluya sin exigir perfección.`,
    `Día 6: Acciones de microsegundos, querida ${name}. Hoy desafiamos la evitación digital o inercial con pequeños pasos comprometidos de valentía.`,
    `Día 7: Integración y autogestión de por vida, querida ${name}. Hoy consolidamos tus 49 marcadores biológicos de calma y celebramos tu resiliencia.`
  ];
  return themes[day - 1] || `Querida ${name}, este es tu espacio personalizado de 7 días. Sigue avanzando a tu propio ritmo con absoluto cariño.`;
};

export const PremiumDashboard: React.FC<PremiumDashboardProps> = ({
  userEmail,
  userName,
  onAudioSelect,
  currentDay,
  completedDays,
  onTriggerMilestone
}) => {
  const { getShareText, shareToWhatsApp, shareWithFallback } = useWhatsAppShare();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"coach" | "garden" | "challenges" | "evolution" | "share" | "milestones" | "diary">("coach");
  const [geminiActive, setGeminiActive] = useState<boolean>(false);
  const [lastMatchedCategory, setLastMatchedCategory] = useState<any | null>(null);

  // Premium State with default fallback for absolute resilience
  const [premiumData, setPremiumData] = useState<PremiumData>({
    points: 80,
    coachHistory: [
      {
        role: "coach",
        content: `Hola, querida ${userName || "amiga"}, bienvenida a tu espacio seguro de bienestar en M.A.P.A.™. Yo soy tu Mentora Clara, tu guía en este ecosistema By Tu Poder Mental Mujer. He analizado con detalle tu perfil emocional y estoy aquí con absoluto cariño para escucharte, protegerte y guiarte en cada paso de tu proceso de 7 días. Este es tu refugio sagrado, libre de todo juicio. ¿Cómo te sientes en este preciso instante, querida ${userName || "amiga"}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    completedChallenges: [],
    challengeAnswers: {},
    evolutionLogs: [
      { date: "Lunes", value: { activacion: 75, ansiedad: 68, rumiacion: 80, sueno: 50 } },
      { date: "Martes", value: { activacion: 65, ansiedad: 58, rumiacion: 72, sueno: 55 } },
      { date: "Miércoles", value: { activacion: 68, ansiedad: 60, rumiacion: 65, sueno: 60 } },
      { date: "Jueves", value: { activacion: 55, ansiedad: 48, rumiacion: 50, sueno: 70 } },
      { date: "Viernes", value: { activacion: 48, ansiedad: 42, rumiacion: 45, sueno: 75 } },
      { date: "Sábado", value: { activacion: 40, ansiedad: 35, rumiacion: 38, sueno: 80 } },
      { date: "Domingo", value: { activacion: 35, ansiedad: 30, rumiacion: 28, sueno: 85 } }
    ],
    diaryEntries: [
      {
        date: "Sábado, 27 de junio, 10:14 p.m.",
        note: "Hoy sentí una fuerte presión en el pecho al revisar mis correos pendientes. Activé el protocolo de respiración de rescate rítmica y la técnica de grounding 5-4-3-2-1. Logré disminuir las palpitaciones y entender que mi cuerpo solo estaba reaccionando a un viejo patrón de sobreesfuerzo. Me siento liberada.",
        mood: "Aliviada",
        xpEarned: 25
      },
      {
        date: "Viernes, 26 de junio, 08:30 a.m.",
        note: "Primera sesión completada con mi Mentora Clara. Me di cuenta de lo mucho que me exijo a mí misma controlar cada pequeña variable del día. Hoy decido soltar las expectativas irreales y permitirme un minuto de calma.",
        mood: "En Paz",
        xpEarned: 15
      }
    ]
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sysError, setSysError] = useState<string | null>(null);

  // Coach inputs
  const [coachInput, setCoachInput] = useState<string>("");
  const [isCoachSending, setIsCoachSending] = useState<boolean>(false);
  const coachBottomRef = useRef<HTMLDivElement>(null);

  // Emergency Calm Mode (🚨 Botón de Pánico)
  const [calmModeActive, setCalmModeActive] = useState<boolean>(false);
  const [calmPhase, setCalmPhase] = useState<"intro" | "breathing" | "techniques" | "concluding">("intro");
  const [calmBreathingCycle, setCalmBreathingCycle] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [calmSecondsLeft, setCalmSecondsLeft] = useState<number>(120); // 2 mins total
  const [calmDiaryNote, setCalmDiaryNote] = useState<string>("");
  const [calmDiaryMood, setCalmDiaryMood] = useState<string>("En Paz");
  const calmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const calmCycleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Marketing Logros feedback
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Dynamic Daily Challenges (renewed and updated every day!)
  const [challenges, setChallenges] = useState<Challenge[]>(() => getDailyChallenges());

  // Current Challenges Temporary Inputs
  const [challengeTexts, setChallengeTexts] = useState<{ [key: string]: string }>({});

  // Level determination computed dynamically from XP points
  // 1-99: Explorador, 100-199: Observador, 200-299: Constructor, 300-399: Fortalecedor, 400+: Transformador
  const getLevelInfo = (xp: number) => {
    if (xp < 100) {
      return {
        level: 1,
        title: "Explorador Mental™",
        color: "from-sky-500 to-indigo-500",
        bg: "bg-sky-500/10 border-sky-500/30",
        nextXP: 100,
        progress: (xp / 100) * 100
      };
    } else if (xp < 200) {
      return {
        level: 2,
        title: "Observador Consciente™",
        color: "from-purple-500 to-indigo-500",
        bg: "bg-purple-500/10 border-purple-500/30",
        nextXP: 200,
        progress: ((xp - 100) / 100) * 100
      };
    } else if (xp < 300) {
      return {
        level: 3,
        title: "Constructor de Calma™",
        color: "from-fuchsia-500 to-pink-500",
        bg: "bg-fuchsia-500/10 border-fuchsia-500/30",
        nextXP: 300,
        progress: ((xp - 200) / 100) * 100
      };
    } else if (xp < 400) {
      return {
        level: 4,
        title: "Fortalecedor Mental™",
        color: "from-cyan-500 to-emerald-500",
        bg: "bg-cyan-500/10 border-cyan-500/30",
        nextXP: 400,
        progress: ((xp - 300) / 100) * 100
      };
    } else {
      return {
        level: 5,
        title: "Transformador™",
        color: "from-amber-400 to-amber-600",
        bg: "bg-amber-500/10 border-amber-500/30",
        nextXP: 1000,
        progress: Math.min(100, ((xp - 400) / 600) * 100)
      };
    }
  };

  const levelInfo = getLevelInfo(premiumData.points);

  // Sync state with backend database on load
  const fetchUserData = async () => {
    setIsLoading(true);
    setSysError(null);
    try {
      const response = await fetch(`/api/premium/user-data?email=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(userName)}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("MAPA_ACCESS_TOKEN") || ""}`
        }
      });
      const resData = await response.json();
      if (response.ok && resData.premiumData) {
        // Hydrate from DB
        const serverData: PremiumData = resData.premiumData;
        
        if (resData.geminiActive !== undefined) {
          setGeminiActive(!!resData.geminiActive);
        }

        // Ensure standard fields exist
        const validatedData: PremiumData = {
          points: serverData.points || 80,
          coachHistory: Array.isArray(serverData.coachHistory) && serverData.coachHistory.length > 0
            ? serverData.coachHistory 
            : premiumData.coachHistory,
          completedChallenges: Array.isArray(serverData.completedChallenges) 
            ? serverData.completedChallenges 
            : [],
          challengeAnswers: serverData.challengeAnswers || {},
          evolutionLogs: Array.isArray(serverData.evolutionLogs) && serverData.evolutionLogs.length > 0
            ? serverData.evolutionLogs
            : premiumData.evolutionLogs,
          diaryEntries: Array.isArray(serverData.diaryEntries)
            ? serverData.diaryEntries
            : (premiumData.diaryEntries || [])
        };

        setPremiumData(validatedData);

        // Update local challenges completed state
        setChallenges(prev => prev.map(ch => ({
          ...ch,
          completed: validatedData.completedChallenges.includes(ch.id)
        })));

        if (validatedData.challengeAnswers) {
          setChallengeTexts(validatedData.challengeAnswers);
        }

      } else {
        // Fallback to localStorage data if any
        loadLocalFallback();
      }
    } catch (err) {
      console.warn("Error connecting to server premium schema, enabling high-performance localStorage fallback offline:", err);
      loadLocalFallback();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalFallback = () => {
    const key = `MAPA_OFFLINE_PREMIUM_${userEmail.toLowerCase().trim()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPremiumData(parsed);
        setChallenges(prev => prev.map(ch => ({
          ...ch,
          completed: (parsed.completedChallenges || []).includes(ch.id)
        })));
        if (parsed.challengeAnswers) {
          setChallengeTexts(parsed.challengeAnswers);
        }
      } catch (e) {
        console.error("Error parsing local fallback data:", e);
      }
    }
  };

  const savePremiumState = async (updated: PremiumData) => {
    setPremiumData(updated);
    // 1. Save locally for instantaneous zero-latency access
    const key = `MAPA_OFFLINE_PREMIUM_${userEmail.toLowerCase().trim()}`;
    localStorage.setItem(key, JSON.stringify(updated));

    // 2. Save on server with silent non-blocking fetch to eliminate user-perceived delays
    try {
      await fetch("/api/premium/save-data", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("MAPA_ACCESS_TOKEN") || ""}`
        },
        body: JSON.stringify({
          email: userEmail,
          premiumData: updated
        })
      });
    } catch (err) {
      console.warn("Background server backup failed temporarily, state is fully preserved locally:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userEmail]);

  useEffect(() => {
    coachBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [premiumData.coachHistory, activeTab]);

  // Coach chat mechanism
  const sendCoachMessage = async () => {
    if (!coachInput.trim() || isCoachSending) return;
    const userMsgText = coachInput.trim();
    setCoachInput("");
    setIsCoachSending(true);

    const userMsg: ChatMessage = {
      role: "user",
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Incremental points for active communication
    const addedPoints = premiumData.points + 15;

    const interimHistory = [...premiumData.coachHistory, userMsg];
    setPremiumData(prev => ({
      ...prev,
      points: addedPoints,
      coachHistory: interimHistory
    }));

    try {
       const response = await fetch("/api/premium/coach-chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("MAPA_ACCESS_TOKEN") || ""}`
        },
        body: JSON.stringify({
          email: userEmail,
          message: userMsgText
        })
      });

      const resData = await response.json();
      if (response.ok && resData.reply) {
        const coachMsg: ChatMessage = {
          role: "coach",
          content: resData.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const finalHistory = [...interimHistory, coachMsg];
        setPremiumData(prev => ({
          ...prev,
          points: resData.points || addedPoints,
          coachHistory: finalHistory
        }));
        if (resData.matchedCategory) {
          setLastMatchedCategory(resData.matchedCategory);
        } else {
          const localMatch = analyzeUserMessage(userMsgText);
          setLastMatchedCategory(localMatch || null);
        }
      } else {
        // Exquisite backup AI behavior
        triggerLocalCoachResponse(userMsgText, interimHistory, addedPoints);
      }
    } catch (err) {
      triggerLocalCoachResponse(userMsgText, interimHistory, addedPoints);
    } finally {
      setIsCoachSending(false);
    }
  };

  const triggerLocalCoachResponse = (userText: string, updatedHistory: ChatMessage[], basePoints: number) => {
    const matched = analyzeUserMessage(userText);
    setLastMatchedCategory(matched || null);

    let reply = "";
    const name = userName || "amiga";
    if (matched) {
      const intros = [
        `Querida ${name}, `,
        `Entiendo perfectamente lo que estás transitando, ${name}. `,
        `Gracias por abrir tu corazón conmigo, ${name}. `,
        `Estoy aquí para acompañarte, ${name}. `,
        `${name}, lo que sientes en este momento es muy real y válido. `
      ];
      const randomIntro = intros[Math.floor(Math.random() * intros.length)];
      reply = `[Categoría identificada: ${matched.name}]\n\n${randomIntro}${matched.response.charAt(0).toLowerCase()}${matched.response.slice(1)}`;
    } else {
      reply = `Querida ${name}, te agradezco de todo corazón que te permitas expresar libremente lo que estás transitando. En nuestra filosofía M.A.P.A.™ sostenemos que 'Comprender es el primer paso para transformar'. Sigue liberando tu sentir; cada palabra escrita disminuye la carga acumulada en tu sistema nervioso y te ayuda a regular tus emociones de forma segura, sintiéndote siempre escuchada, cuidada y tenida en cuenta en todo momento.`;
    }

    setTimeout(() => {
      const coachMsg: ChatMessage = {
        role: "coach",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setPremiumData(prev => ({
        ...prev,
        points: basePoints,
        coachHistory: [...updatedHistory, coachMsg]
      }));
    }, 800);
  };

  // Challenge completion action
  const completeChallenge = (id: string) => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge || challenge.completed) return;

    if (challenge.userInputRequired && !challengeTexts[id]?.trim()) {
      alert("Por favor, ingresa los datos correspondientes en el espacio de texto para poder guardar tu reto completado.");
      return;
    }

    // Mark as completed in state and awards XP points
    const updatedChallenges = challenges.map(ch => {
      if (ch.id === id) {
        return { ...ch, completed: true };
      }
      return ch;
    });

    setChallenges(updatedChallenges);

    const updatedCompletedIds = [...premiumData.completedChallenges, id];
    const newPoints = premiumData.points + challenge.xpReward;

    savePremiumState({
      ...premiumData,
      points: newPoints,
      completedChallenges: updatedCompletedIds,
      challengeAnswers: {
        ...premiumData.challengeAnswers,
        ...challengeTexts
      }
    });

    // Award alert or feedback
    alert(`🎉 ¡Reto Completado! Has ganado +${challenge.xpReward} XP. Tu mente lo agradece.`);
  };

  // Emergency Calm (Panic button loops)
  const startCalmMode = () => {
    setCalmModeActive(true);
    setCalmPhase("intro");
    setCalmSecondsLeft(120);
    setCalmBreathingCycle("inhale");

    // Start 2 minutes countdown
    if (calmIntervalRef.current) clearInterval(calmIntervalRef.current);
    calmIntervalRef.current = setInterval(() => {
      setCalmSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(calmIntervalRef.current!);
          setCalmPhase("concluding");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Setup breathing cycle indicator
    if (calmCycleIntervalRef.current) clearInterval(calmCycleIntervalRef.current);
    let durationCounter = 0;
    calmCycleIntervalRef.current = setInterval(() => {
      durationCounter++;
      // simple 4-4-4 cycle
      const phaseNum = durationCounter % 12;
      if (phaseNum < 4) {
        setCalmBreathingCycle("inhale");
      } else if (phaseNum < 8) {
        setCalmBreathingCycle("hold");
      } else {
        setCalmBreathingCycle("exhale");
      }
    }, 1000);
  };

  const endCalmMode = () => {
    setCalmModeActive(false);
    if (calmIntervalRef.current) clearInterval(calmIntervalRef.current);
    if (calmCycleIntervalRef.current) clearInterval(calmCycleIntervalRef.current);

    // Create a new emotional diary entry
    const entryText = calmDiaryNote.trim() || "Sesión de calma de rescate completada con éxito para reestablecer homeostasis vagal.";
    const newEntry: DiaryEntry = {
      date: new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      }),
      note: entryText,
      mood: calmDiaryMood || "En Paz",
      xpEarned: 25
    };

    // Reward for completing calm rescue session
    const finalPoints = premiumData.points + 25;
    const updatedEntries = [newEntry, ...(premiumData.diaryEntries || [])];

    savePremiumState({
      ...premiumData,
      points: finalPoints,
      diaryEntries: updatedEntries
    });

    // Reset fields for future usage
    setCalmDiaryNote("");
    setCalmDiaryMood("En Paz");

    alert("¡Sesión culminada con éxito! Tu nota ha sido guardada en tu Diario de Emociones. Has ganado +25 XP.");
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2500);
  };

  const exportDiaryToPDF = () => {
    const entries = premiumData.diaryEntries || [];
    if (entries.length === 0) {
      alert("No tienes anotaciones en tu diario de emociones para exportar.");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      let yPos = 25;

      // Header decoration
      doc.setFillColor(110, 72, 138); // #6E488A
      doc.rect(margin, yPos, contentWidth, 2, "F");
      yPos += 8;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(110, 72, 138); // #6E488A
      doc.text("M.A.P.A. Mujer", margin, yPos);
      yPos += 7;

      // Subtitle
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.setTextColor(86, 52, 111); // #56346F
      doc.text("Diario de Emociones y Descubrimiento Emocional", margin, yPos);
      yPos += 6;

      // Tagline
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(110, 72, 138);
      doc.text("Comprender es el primer paso para transformar.", margin, yPos);
      yPos += 10;

      // Export Metadata
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha de exportación: ${new Date().toLocaleDateString("es-ES")}`, margin, yPos);
      doc.text(`Total de anotaciones: ${entries.length}`, margin + 100, yPos);
      yPos += 8;

      // Divider line
      doc.setDrawColor(230, 220, 235);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 12;

      // Loop over entries
      entries.forEach((entry) => {
        const headerText = `${entry.date}  |  Estado: ${entry.mood || "En Paz"}`;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const splitLines = doc.splitTextToSize(entry.note, contentWidth - 10);
        const entryHeight = 6 + 6 + (splitLines.length * 5) + 10;

        // Check page overflow
        if (yPos + entryHeight > pageHeight - margin) {
          doc.addPage();
          yPos = 25;
          doc.setFillColor(110, 72, 138);
          doc.rect(margin, yPos, contentWidth, 1, "F");
          yPos += 8;
        }

        // Draw entry background
        doc.setFillColor(250, 247, 252); // #FAF7FC
        doc.roundedRect(margin, yPos, contentWidth, 6 + 6 + (splitLines.length * 5) + 4, 3, 3, "F");

        // Left accent block
        doc.setFillColor(110, 72, 138);
        doc.rect(margin, yPos, 1.5, 6 + 6 + (splitLines.length * 5) + 4, "F");

        // Header text inside block
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(110, 72, 138);
        doc.text(headerText, margin + 5, yPos + 6);

        // Content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        
        let textY = yPos + 12;
        splitLines.forEach((line: string) => {
          doc.text(line, margin + 5, textY);
          textY += 5;
        });

        yPos = textY + 8;
      });

      doc.save(`MAPA_Mujer_Diario_Emociones_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error al exportar PDF: ", error);
      alert("Ocurrió un error al generar el PDF. Por favor intenta de nuevo.");
    }
  };

  // Marketing shares
  const shareAssets = [
    {
      title: "Desafío Mental Completado",
      text: `🏆 ¡He escalado con éxito al nivel de "${levelInfo.title}" con M.A.P.A.™! He aprendido a comprender mejor mis emociones y desarrollar hábitos más saludables.\n\nTú también puedes iniciar tu proceso de sanación mental personalizado hoy mismo.\n\n🧠 Fortalece Tu Mente. Transforma Tu Vida.\n👉 https://quizmapa.tupodermental.club/\n\n#PoderMentalIA #MAPA #Ansiedad #BienestarMental`
    },
    {
      title: "Rescate del Botón de Pánico",
      text: getShareText({ variant: "boton_panico" })
    },
    {
      title: "Hábito Saludable de Conexión",
      text: getShareText({ variant: "reto_premium" })
    }
  ];

  return (
    <div id="premium_dashboard_container" className="bg-white/95 border-2 border-[#6E488A]/20 border-b-[6px] border-b-[#6E488A]/30 rounded-3xl p-6 md:p-8 text-[#56346F] shadow-[0_20px_50px_rgba(110,72,138,0.1),_0_10px_20px_rgba(110,72,138,0.05)] space-y-8 relative overflow-hidden mb-8">
      
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#36C4D8]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E36DB4]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#6E488A]/12 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs uppercase font-black tracking-widest text-[#E36DB4] bg-[#EDE0F0] border border-[#E36DB4]/25 rounded-full shadow-sm">
              ✨ MIEMBRO PREMIUM ACTIVO
            </span>
            <div className="flex items-center gap-1.5 text-[#6E488A]/70 text-sm font-mono font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#36C4D8] animate-pulse" />
              Sincronizado con M.A.P.A.™
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#6E488A] flex items-center gap-2.5">
            Espacio Premium M.A.P.A.™ <Sparkles className="w-6 h-6 text-[#36C4D8] animate-pulse" />
          </h2>
          <p className="text-base text-[#56346F]/80">
            Bienvenida, <strong className="text-[#6E488A] font-extrabold">{userName}</strong>. Tu programa personalizado de regulación e intercepción neural está activo y optimizado.
          </p>
          {currentDay && (
            <div className="mt-3 bg-gradient-to-r from-[#EDE0F0] to-[#E36DB4]/10 border-l-4 border-[#E36DB4] p-3.5 rounded-r-2xl text-left shadow-sm animate-fadeIn">
              <span className="text-[10px] font-mono uppercase text-[#6E488A] tracking-wider font-extrabold block mb-1">
                📅 RUTA DE 7 DÍAS CONSECUTIVOS • ENFOQUE DE HOY
              </span>
              <p className="text-xs sm:text-sm text-[#56346F] leading-relaxed font-bold">
                {getDayThemeMessage(currentDay, userName)}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#56346F]/70 font-semibold font-mono">
                <span>Días completados: </span>
                <span className="px-1.5 py-0.5 rounded bg-[#EDE0F0] text-[#6E488A] font-extrabold">
                  {completedDays?.length || 0} de 7
                </span>
                <span>• Cada paso que das te devuelve el control de tu vida. ¡Estamos contigo!</span>
              </div>
            </div>
          )}
        </div>

        {/* 🚨 BOTÓN DE PÁNICO: Siempre disponible y destacado en color de urgencia */}
        <div>
          <button
            id="emergency_panic_button"
            onClick={startCalmMode}
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-extrabold text-base border-b-4 border-red-700 shadow-[0_8px_16px_rgba(239,68,68,0.25)] hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-[4px] hover:shadow-[0_4px_8px_rgba(239,68,68,0.25)] transition-all cursor-pointer group"
          >
            <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
            <span>NECESITO CALMARME AHORA</span>
            <span className="text-xs bg-red-950/20 px-2 py-0.5 rounded border border-white/30">SOS</span>
          </button>
        </div>
      </div>

      {/* Gamificación: Sistema de Niveles */}
      <div className="p-5 rounded-2xl border-2 border-[#6E488A]/20 border-b-4 border-b-[#6E488A]/30 bg-[#EDE0F0]/30 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 shadow-[0_8px_20px_rgba(110,72,138,0.04)] hover:scale-[1.005] hover:shadow-[0_12px_24px_rgba(110,72,138,0.06)]">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6E488A] to-[#E36DB4] flex items-center justify-center text-white font-black text-2xl shadow-md relative shrink-0">
            {levelInfo.level}
            <Trophy className="absolute -bottom-1 -right-1 w-4 h-4 text-amber-300 drop-shadow" />
          </div>
          <div className="space-y-1 w-full text-left">
            <span className="text-[10px] tracking-wider text-[#56346F]/70 uppercase font-mono block font-bold">Nivel de Regulación</span>
            <div className="text-lg font-extrabold text-[#6E488A] leading-tight flex items-center gap-2">
              {levelInfo.title}
              <span className="text-xs text-[#E36DB4] font-mono">({premiumData.points} XP)</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full md:w-64 h-2 bg-[#EDE0F0] rounded-full overflow-hidden border border-[#6E488A]/10">
              <div 
                className="h-full bg-gradient-to-r from-[#36C4D8] to-[#E36DB4] transition-all duration-500"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            <span className="text-[10px] text-[#56346F]/70 block font-medium">
              Próximo nivel al alcanzar los {levelInfo.nextXP} XP
            </span>
          </div>
        </div>

        {/* Level description & dynamic stats */}
        <div className="flex items-center gap-6 text-center md:text-right shrink-0">
          <div>
            <div className="text-2xl font-black text-[#6E488A] font-mono">{challenges.filter(c => c.completed).length}/5</div>
            <span className="text-[10px] text-[#56346F]/70 uppercase tracking-widest block font-bold">Retos Diarios</span>
          </div>
          <div className="w-px h-8 bg-[#6E488A]/20" />
          <div>
            <div className="text-2xl font-black text-[#6E488A] font-mono">{premiumData.coachHistory.filter(m => m.role === "user").length}</div>
            <span className="text-[10px] text-[#56346F]/70 uppercase tracking-widest block font-bold">Interacciones IA</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-[#6E488A]/12 pb-4">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("coach")}
          className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "coach"
              ? "bg-[#EDE0F0] border-2 border-[#6E488A] text-[#6E488A] shadow-sm"
              : "hover:bg-[#EDE0F0]/50 border border-transparent text-[#56346F]/80 hover:text-[#6E488A]"
          }`}
        >
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[#36C4D8]" />
          <span>🧠 Mentora Clara</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("garden")}
          className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "garden"
              ? "bg-[#EDE0F0]/70 border-2 border-[#36C4D8] text-[#36C4D8] shadow-sm"
              : "hover:bg-[#EDE0F0]/50 border border-transparent text-[#56346F]/80 hover:text-[#6E488A]"
          }`}
        >
          <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-[#36C4D8]" />
          <span>🌿 Jardín de Paz</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("challenges")}
          className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "challenges"
              ? "bg-[#EDE0F0]/70 border-2 border-[#E36DB4] text-[#E36DB4] shadow-sm"
              : "hover:bg-[#EDE0F0]/50 border border-transparent text-[#56346F]/80 hover:text-[#6E488A]"
          }`}
        >
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#E36DB4]" />
          <span>🎯 Retos Activos™</span>
          {challenges.filter(c => !c.completed).length > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-[#EDE0F0] border border-[#E36DB4]/30 text-[10px] sm:text-xs font-mono font-black text-[#E36DB4]">
              {challenges.filter(c => !c.completed).length}
            </span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("evolution")}
          className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "evolution"
              ? "bg-[#EDE0F0] border-2 border-[#6E488A] text-[#6E488A] shadow-sm"
              : "hover:bg-[#EDE0F0]/50 border border-transparent text-[#56346F]/80 hover:text-[#6E488A]"
          }`}
        >
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#36C4D8]" />
          <span>📈 Mi Evolución™</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("diary")}
          className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "diary"
              ? "bg-[#EDE0F0] border-2 border-purple-500 text-[#6E488A] shadow-sm"
              : "hover:bg-[#EDE0F0]/50 border border-transparent text-[#56346F]/80 hover:text-[#6E488A]"
          }`}
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          <span>📖 Diario</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("share")}
          className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "share"
              ? "bg-[#EDE0F0]/70 border-2 border-[#36C4D8] text-[#36C4D8] shadow-sm"
              : "hover:bg-[#EDE0F0]/50 border border-transparent text-[#56346F]/80 hover:text-[#6E488A]"
          }`}
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#36C4D8]" />
          <span>🏆 Compartir</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("milestones")}
          className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "milestones"
              ? "bg-[#EDE0F0]/75 border-2 border-amber-500 text-amber-600 shadow-sm"
              : "hover:bg-[#EDE0F0]/50 border border-transparent text-[#56346F]/80 hover:text-[#6E488A]"
          }`}
          id="tab-milestones-btn"
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" />
          <span>🏅 Mis Logros</span>
        </motion.button>
      </div>

      {/* Main Tab Contents */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono">Conectando con base de datos premium...</p>
        </div>
      ) : (
        <div className="min-h-[350px]">
          
          {/* PESTAÑA: MENTOR M.A.P.A.™ */}
          {activeTab === "coach" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header/Disclaimer banner */}
              <div className="bg-[#EDE0F0]/50 border border-[#6E488A]/20 p-6 rounded-2xl flex flex-col md:flex-row gap-5 shadow-sm items-start md:items-center">
                <div className="w-12 h-12 rounded-full bg-white border border-[#6E488A]/20 flex items-center justify-center shrink-0 shadow-sm">
                  <Brain className="w-6 h-6 text-[#36C4D8] animate-pulse" />
                </div>
                <div className="space-y-1.5 flex-1 text-left">
                  <h4 className="font-display font-black text-base text-[#6E488A] uppercase tracking-wider flex flex-wrap items-center gap-2">
                    MENTORA CLARA • M.A.P.A.™ <span className="text-xs px-2 py-0.5 rounded bg-[#EDE0F0] border border-[#6E488A]/25 text-[#6E488A] font-bold">BY TU PODER MENTAL MUJER™</span>
                  </h4>
                  <p className="text-[#56346F]/90 text-sm leading-relaxed font-medium">
                    Soporte inmediato basado en reglas y análisis de palabras clave. Aquí comprendemos tus emociones para transformarlas sin realizar juicios, diagnósticos clínicos, ni sustituir la atención médica o de un especialista psicológico.
                  </p>
                  <p className="text-xs text-[#E36DB4] font-mono italic font-semibold">
                    Filosofía M.A.P.A.™: "Comprender es el primer paso para transformar."
                  </p>
                </div>
              </div>

              {/* Main 2-column layout: Chat on left, Interactive recommendations on right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Column 1: Interactive Chat Window (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-5 md:p-6 border-2 border-[#6E488A]/15 border-b-4 border-b-[#EDE0F0] shadow-[0_12px_24px_rgba(110,72,138,0.04)] flex flex-col h-[520px] justify-between space-y-4">
                  
                  {/* Message History area */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {premiumData.coachHistory.map((msg, idx) => {
                      const isCoach = msg.role === "coach";
                      return (
                        <div
                          key={idx}
                          className={`flex gap-3 max-w-[85%] text-left ${
                            isCoach ? "mr-auto" : "ml-auto flex-row-reverse"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-black border ${
                            isCoach 
                              ? "bg-[#EDE0F0] text-[#6E488A] border-[#6E488A]/20"
                              : "bg-[#EDE0F0] text-[#36C4D8] border-[#36C4D8]/20"
                          }`}>
                            {isCoach ? "🧠" : "👤"}
                          </div>
                          
                          <div className="space-y-1">
                            <div className={`p-4 rounded-2xl whitespace-pre-line ${
                              isCoach 
                                ? "bg-[#EDE0F0]/50 border border-[#6E488A]/12 text-[#56346F] rounded-tl-none text-base sm:text-lg font-semibold leading-relaxed sm:leading-loose shadow-sm" 
                                : "bg-[#36C4D8]/10 border border-[#36C4D8]/20 text-[#56346F] rounded-tr-none text-sm sm:text-base font-medium leading-relaxed"
                            }`}>
                              {msg.content}
                            </div>
                            <span className="text-[10px] font-mono text-[#56346F]/60 block px-1">
                              {msg.timestamp || "Hace un momento"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {isCoachSending && (
                      <div className="flex gap-3 max-w-[80%] mr-auto">
                        <div className="w-8 h-8 rounded-full shrink-0 bg-[#EDE0F0] text-[#6E488A] border border-[#6E488A]/20 flex items-center justify-center animate-spin">
                          🌀
                        </div>
                        <div className="p-4 rounded-2xl bg-[#EDE0F0]/30 border border-[#6E488A]/10 text-[#6E488A]/80 text-base sm:text-lg rounded-tl-none font-semibold">
                          La Mentora Clara está sintonizando con tu sentir...
                        </div>
                      </div>
                    )}
                    <div ref={coachBottomRef} />
                  </div>

                  {/* Input form */}
                  <div className="pt-2 border-t border-[#6E488A]/12 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coachInput}
                        onChange={(e) => setCoachInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") sendCoachMessage();
                        }}
                        placeholder="Describe cómo te sientes hoy... (ej: 'siento mucha ansiedad', 'no puedo dormir', 'tengo palpitaciones')"
                        className="flex-1 bg-white border border-[#6E488A]/15 focus:border-[#36C4D8] rounded-xl px-4 py-3 text-sm text-[#56346F] placeholder-gray-400 focus:outline-none transition-colors font-medium font-sans"
                      />
                      <button
                        onClick={sendCoachMessage}
                        disabled={isCoachSending || !coachInput.trim()}
                        className="p-3 bg-gradient-to-r from-[#36C4D8] to-[#7BE3E8] text-slate-950 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer shrink-0"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 p-3 bg-[#EDE0F0]/15 rounded-2xl border border-[#6E488A]/10">
                      <span className="text-xs font-mono font-bold text-[#6E488A] flex items-center gap-1.5">
                        <span>🏷️</span> Selecciona una emoción para que el Mentor la analice:
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {COACH_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setCoachInput(`Me siento con un estado de ${cat.name.toLowerCase()}`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EDE0F0]/50 text-[#6E488A] hover:text-[#56346F] text-xs font-bold border border-[#6E488A]/15 hover:border-[#36C4D8] transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            ● {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Interactive Recommendations Bento-box (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Dynamic context advice container */}
                  <div className="bg-white rounded-3xl p-6 border border-[#6E488A]/15 shadow-md space-y-6 text-left">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-[#36C4D8] uppercase tracking-widest font-black block">
                        ANÁLISIS DE AUTORREGULACIÓN
                      </span>
                      <h3 className="font-display font-black text-xl text-[#6E488A]">
                        {lastMatchedCategory ? `Módulo Activo: ${lastMatchedCategory.name}` : "Anclajes de Soporte"}
                      </h3>
                      <p className="text-xs text-[#56346F]/80 leading-relaxed font-medium">
                        Acciones sugeridas por la Mentora Clara M.A.P.A.™ basadas en tu estado emocional para ayudarte a sintonizar tu sistema simpático.
                      </p>
                    </div>

                    {lastMatchedCategory ? (
                      <div className="space-y-4 animate-fadeIn">
                        
                        {/* 1. Recommended Challenge */}
                        <div className="p-4 rounded-xl bg-[#EDE0F0]/30 border border-[#6E488A]/10 space-y-2">
                          <span className="text-[10px] font-mono font-black text-[#6E488A] uppercase tracking-widest block">
                            🎯 RETO RECOMENDADO
                          </span>
                          <p className="text-sm text-[#56346F] font-extrabold">
                            {lastMatchedCategory.recommendedChallenge}
                          </p>
                          <button
                            onClick={() => {
                              setActiveTab("challenges");
                            }}
                            className="text-xs font-mono font-black text-[#36C4D8] hover:text-[#36C4D8]/80 flex items-center gap-1.5 mt-1 hover:underline cursor-pointer"
                          >
                            Ir a Retos Diarios para registrarlo <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 2. Recommended Sound */}
                        <div className="p-4 rounded-xl bg-[#EDE0F0]/30 border border-[#6E488A]/10 space-y-2">
                          <span className="text-[10px] font-mono font-black text-[#36C4D8] uppercase tracking-widest block">
                            🌿 FRECUENCIA DE SONIDO RECOMENDADA
                          </span>
                          <p className="text-sm text-[#56346F] font-extrabold">
                            {lastMatchedCategory.recommendedSound}
                          </p>
                          <button
                            onClick={() => {
                              setActiveTab("garden");
                            }}
                            className="text-xs font-mono font-black text-[#E36DB4] hover:text-[#E36DB4]/80 flex items-center gap-1.5 mt-1 hover:underline cursor-pointer"
                          >
                            Ir al Jardín de Paz para reproducir <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 3. Recommended Reflection */}
                        <div className="p-4 rounded-xl bg-[#EDE0F0]/30 border border-[#6E488A]/10 space-y-2">
                          <span className="text-[10px] font-mono font-black text-[#6E488A] uppercase tracking-widest block">
                            ✨ REFLEXIÓN RECOMENDADA
                          </span>
                          <p className="text-sm text-[#56346F] font-medium italic">
                            "{lastMatchedCategory.recommendedReflection}"
                          </p>
                          <button
                            onClick={() => {
                              alert("¡Reflexión copiada en memoria! Puedes escribirla como tu pensamiento anclaje del día en tu Jardín de Paz.");
                              navigator.clipboard.writeText(lastMatchedCategory.recommendedReflection);
                            }}
                            className="text-xs font-mono font-black text-[#36C4D8] hover:text-white flex items-center gap-1.5 mt-1 hover:underline cursor-pointer animate-pulse"
                          >
                            Copiar reflexión para usarla como anclaje <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    ) : (
                      <div className="p-6 rounded-xl bg-[#EDE0F0]/20 border border-dashed border-[#6E488A]/30 text-center space-y-3">
                        <span className="text-3xl block animate-bounce">💡</span>
                        <p className="text-xs text-[#56346F]/80 leading-relaxed font-medium">
                          Escribe en la ventana del chat cómo te sientes en este momento. El sistema de Tu Poder Mental Mujer™ analizará tus palabras y activará las mejores recomendaciones terapéuticas M.A.P.A.™ para ti.
                        </p>
                        <div className="pt-2">
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#EDE0F0] text-[#6E488A] border border-[#6E488A]/15 font-bold">
                            Esperando Entrada Emocional...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>



                </div>

              </div>

            </div>
          )}

          {/* PESTAÑA: JARDÍN DE PAZ */}
          {activeTab === "garden" && (
            <PeaceGarden userName={userName} />
          )}

          {/* PESTAÑA: RETOS ACTIVOS */}
          {activeTab === "challenges" && (
            <div className="space-y-4">
              <div className="bg-[#EDE0F0]/50 rounded-2xl p-5 border border-[#6E488A]/15 text-left shadow-sm">
                <h4 className="text-sm font-extrabold text-[#6E488A] mb-1 flex items-center gap-2">
                  Retos Diarios de Fortificación Neural
                </h4>
                <p className="text-xs text-[#56346F]/80 leading-relaxed font-medium">
                  Desarrollar consistencia es clave para modular la respuesta emocional automática. Completa estas acciones para registrar tu progreso y escalar tu nivel de regulación de fortaleza mental.
                </p>
              </div>

              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      challenge.completed
                        ? "bg-[#EDE0F0]/20 border-[#6E488A]/10 opacity-70"
                        : "bg-white border-[#6E488A]/15 hover:border-[#36C4D8] shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          challenge.completed 
                            ? "bg-[#36C4D8]/10 text-[#36C4D8]" 
                            : "bg-[#EDE0F0] text-[#6E488A]"
                        }`}>
                          <span className="font-mono text-sm font-bold">{challenge.dayNum}</span>
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-extrabold text-[#6E488A] text-sm flex flex-wrap items-center gap-2">
                            {challenge.title}
                            <span className="px-2 py-0.5 rounded bg-[#EDE0F0] text-[#E36DB4] text-[9px] font-mono font-bold border border-[#E36DB4]/15">
                              +{challenge.xpReward} XP
                            </span>
                          </h5>
                          <p className="text-xs text-[#56346F]/80 leading-relaxed font-medium">{challenge.description}</p>
                        </div>
                      </div>

                      <div className="self-start sm:self-auto">
                        {challenge.completed ? (
                          <span className="flex items-center gap-1.5 text-xs text-[#36C4D8] font-bold px-2.5 py-1.5 rounded bg-[#36C4D8]/10 border border-[#36C4D8]/20">
                            <Check className="w-3.5 h-3.5" /> Completado
                          </span>
                        ) : (
                          <button
                            onClick={() => completeChallenge(challenge.id)}
                            className="bg-gradient-to-r from-[#6E488A] to-[#E36DB4] hover:opacity-90 text-white font-extrabold text-xs py-1.5 px-3 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
                          >
                            Registrar Desafío
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Exquisite contextual inputs */}
                    {challenge.userInputRequired && !challenge.completed && (
                      <div className="mt-3 pl-11 space-y-2">
                        <textarea
                          placeholder={challenge.placeholderText || "Escribe tu respuesta reflexiva diaria..."}
                          rows={2}
                          value={challengeTexts[challenge.id] || ""}
                          onChange={(e) => setChallengeTexts({ ...challengeTexts, [challenge.id]: e.target.value })}
                          className="w-full bg-white border border-[#6E488A]/15 focus:border-[#36C4D8] rounded-lg p-2.5 text-xs text-[#56346F] focus:outline-none placeholder-gray-400 font-sans font-medium"
                        />
                      </div>
                    )}

                    {challenge.userInputRequired && challenge.completed && premiumData.challengeAnswers[challenge.id] && (
                      <div className="mt-3 pl-11 bg-[#EDE0F0]/20 p-2.5 rounded-lg border border-[#6E488A]/10 text-xs italic text-[#56346F]/80 whitespace-pre-line">
                        <strong>Tu anotación terapéutica:</strong><br />
                        {premiumData.challengeAnswers[challenge.id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PESTAÑA: MI EVOLUCIÓN */}
          {activeTab === "evolution" && (
            <div className="space-y-6">
              
              {/* RESUMEN DE BIENESTAR: ÚLTIMOS 3 DÍAS */}
              <div id="resumen_bienestar_section" className="bg-gradient-to-br from-[#EDE0F0]/40 via-[#EDE0F0]/10 to-white border-2 border-[#6E488A]/15 border-b-[6px] border-b-[#6E488A]/25 rounded-3xl p-5 sm:p-6 text-left space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#6E488A]/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E86FA3]/15 flex items-center justify-center">
                      <Sparkles className="w-4.5 h-4.5 text-[#E86FA3] animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-base text-[#411F66]">Resumen de Bienestar (Últimos 3 Días)</h4>
                      <p className="text-[11px] text-[#0B152B]/75 font-semibold">Trazado sintonizado de tus últimos 3 días de autogestión</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#36C4D8]/10 text-[#27A1B2] font-mono uppercase tracking-widest font-black px-3 py-1 rounded-full border border-[#36C4D8]/20 self-start sm:self-auto">
                    Sincronizado con IA
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {premiumData.evolutionLogs.slice(-3).map((log, index) => {
                    const { activacion, ansiedad, rumiacion, sueno } = log.value;
                    const realIndex = premiumData.evolutionLogs.length - 3 + index + 1;
                    return (
                      <div 
                        key={log.date}
                        className="bg-white border-2 border-[#6E488A]/10 border-b-4 border-b-[#EDE0F0] rounded-2xl p-4 space-y-4 hover:scale-[1.01] hover:border-[#E86FA3]/30 transition-all duration-300 shadow-sm relative overflow-hidden"
                      >
                        {/* Decorative subtle background icon / number */}
                        <div className="absolute -right-4 -bottom-4 text-6xl font-black text-[#6E488A]/5 select-none pointer-events-none">
                          {realIndex}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono font-black text-[#E86FA3] uppercase tracking-wider bg-[#EDE0F0]/40 px-2.5 py-1 rounded-lg">
                            Día {realIndex} • {log.date}
                          </span>
                          <span className="text-[10px] font-bold text-[#0B152B]/50">M.A.P.A. Activo</span>
                        </div>

                        {/* Indicators Grid */}
                        <div className="space-y-2.5 relative z-10">
                          {/* Indicator 1 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-[#411F66]">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E86FA3]" />
                                Activación Emocional
                              </span>
                              <span className="font-mono text-[#E86FA3]">{activacion}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#EDE0F0]/50 rounded-full overflow-hidden">
                              <div className="h-full bg-[#E86FA3] rounded-full" style={{ width: `${activacion}%` }} />
                            </div>
                          </div>

                          {/* Indicator 2 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-[#411F66]">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#36C4D8]" />
                                Ansiedad Interceptiva
                              </span>
                              <span className="font-mono text-[#36C4D8]">{ansiedad}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#EDE0F0]/50 rounded-full overflow-hidden">
                              <div className="h-full bg-[#36C4D8] rounded-full" style={{ width: `${ansiedad}%` }} />
                            </div>
                          </div>

                          {/* Indicator 3 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-[#411F66]">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6E488A]" />
                                Rumiación Mental
                              </span>
                              <span className="font-mono text-[#6E488A]">{rumiacion}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#EDE0F0]/50 rounded-full overflow-hidden">
                              <div className="h-full bg-[#6E488A] rounded-full" style={{ width: `${rumiacion}%` }} />
                            </div>
                          </div>

                          {/* Indicator 4 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-[#411F66]">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Calidad del Sueño
                              </span>
                              <span className="font-mono text-emerald-500">{sueno}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#EDE0F0]/50 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${sueno}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Status tag */}
                        <div className="text-[9px] font-semibold text-[#0B152B]/60 italic pt-1.5 border-t border-[#6E488A]/5 text-right">
                          {sueno >= 70 ? "✨ Nivel óptimo de recuperación" : "⚠️ Requiere sintonización de calma"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1 */}
                <div className="bg-white p-5 rounded-2xl border-2 border-[#E86FA3]/20 border-b-4 border-b-[#E86FA3]/35 text-left shadow-[0_8px_20px_rgba(232,111,163,0.06)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_24px_rgba(232,111,163,0.12)] hover:border-[#E86FA3]">
                  <div className="text-[#0B152B]/75 text-[10px] tracking-wide uppercase font-mono mb-1 font-bold">
                    Activación Emocional
                  </div>
                  <div className="text-2xl font-black text-[#E86FA3] font-mono">Disminuyó 40%</div>
                  <div className="w-full h-1.5 bg-[#EDE0F0] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#E86FA3] to-[#F58BC8] w-[60%]" />
                  </div>
                  <span className="text-[9px] text-[#0B152B]/60 block mt-1 font-bold">Simulación neural acumulativa</span>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-5 rounded-2xl border-2 border-[#36C4D8]/20 border-b-4 border-b-[#36C4D8]/35 text-left shadow-[0_8px_20px_rgba(54,196,216,0.06)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_24px_rgba(54,196,216,0.12)] hover:border-[#36C4D8]">
                  <div className="text-[#0B152B]/75 text-[10px] tracking-wide uppercase font-mono mb-1 font-bold">
                    Ansiedad Interceptiva
                  </div>
                  <div className="text-2xl font-black text-[#36C4D8] font-mono">Reducida en un 38%</div>
                  <div className="w-full h-1.5 bg-[#EDE0F0] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#36C4D8] to-[#45B2B6] w-[62%]" />
                  </div>
                  <span className="text-[9px] text-[#0B152B]/60 block mt-1 font-bold">Intercepción de reflejos de pánico</span>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-5 rounded-2xl border-2 border-[#411F66]/15 border-b-4 border-b-[#411F66]/30 text-left shadow-[0_8px_20px_rgba(65,31,102,0.04)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_24px_rgba(65,31,102,0.08)] hover:border-[#411F66]/30">
                  <div className="text-[#0B152B]/75 text-[10px] tracking-wide uppercase font-mono mb-1 font-bold">
                    Rumiación Mental
                  </div>
                  <div className="text-2xl font-black text-[#411F66] font-mono">-52% Ciclos</div>
                  <div className="w-full h-1.5 bg-[#EDE0F0] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#411F66] w-[48%]" />
                  </div>
                  <span className="text-[9px] text-[#0B152B]/60 block mt-1 font-bold">Cuestionamientos cognitivos realizados</span>
                </div>

                {/* Stat 4 */}
                <div className="bg-white p-5 rounded-2xl border-2 border-[#36C4D8]/20 border-b-4 border-b-[#36C4D8]/35 text-left shadow-[0_8px_20px_rgba(54,196,216,0.06)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_24px_rgba(54,196,216,0.12)] hover:border-[#36C4D8]">
                  <div className="text-[#0B152B]/75 text-[10px] tracking-wide uppercase font-mono mb-1 font-bold">
                    Calidad del Sueño
                  </div>
                  <div className="text-2xl font-black text-[#36C4D8] font-mono">+70% Eficacia</div>
                  <div className="w-full h-1.5 bg-[#EDE0F0] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#36C4D8] to-[#45B2B6] w-[70%]" />
                  </div>
                  <span className="text-[9px] text-[#0B152B]/60 block mt-1 font-bold">Sintonización cerebral nocturna</span>
                </div>

              </div>

              {/* Chart Visualizer */}
              <div className="bg-white border-2 border-[#36C4D8]/20 border-b-4 border-b-[#36C4D8]/30 rounded-2xl p-5 text-left shadow-[0_12px_24px_rgba(54,196,216,0.04)] hover:scale-[1.002] transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h5 className="font-extrabold text-[#411F66] text-sm">Trayectoria del Retorno Cognitivo</h5>
                    <p className="text-[11px] text-[#0B152B]/85 font-semibold">Control semanal de reducción de Ansiedad y Elevación de Calma</p>
                  </div>
                  <div className="flex gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#E86FA3]" />Ansiedad</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#36C4D8]" />Sueño</span>
                  </div>
                </div>

                {/* Line chart */}
                <div className="w-full h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={premiumData.evolutionLogs}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#411F66" opacity={0.1} />
                      <XAxis dataKey="date" stroke="#411F66" fontSize={10} fontWeight="bold" />
                      <YAxis stroke="#411F66" fontSize={10} fontWeight="bold" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#411F66', borderRadius: '12px', color: '#0B152B', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        labelStyle={{ color: '#411F66', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="value.ansiedad" stroke="#E86FA3" strokeWidth={3} dot={{ r: 4 }} name="Nivel Ansiedad" />
                      <Line type="monotone" dataKey="value.sueno" stroke="#36C4D8" strokeWidth={3} dot={{ r: 4 }} name="Calidad Sueño" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA: COMPARTIR LOGROS */}
          {activeTab === "share" && (
            <div className="space-y-4">
              <div className="bg-[#EDE0F0]/50 rounded-2xl p-5 border border-[#6E488A]/15 text-xs flex gap-3 text-left shadow-sm">
                <Smile className="w-5 h-5 text-[#36C4D8] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-[#6E488A]">ESTRATEGIA DE BIENESTAR COMPARTIDO</p>
                  <p className="text-[#56346F]/80 leading-relaxed font-medium">
                    Comparte tu maravilloso camino de sanación personal. Inspira a tus seres queridos y de paso ayuda a extender la herramienta con enlaces directos para su desarrollo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shareAssets.map((asset, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border-2 border-[#6E488A]/15 border-b-4 border-b-[#6E488A]/25 flex flex-col justify-between space-y-4 shadow-[0_4px_12px_rgba(110,72,138,0.02)] text-left hover:scale-[1.01] transition-all hover:border-[#6E488A]/30">
                    <div>
                      <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#6E488A] mb-2 font-mono">
                        {asset.title}
                      </h5>
                      <p className="text-xs text-[#56346F]/90 italic line-clamp-6 leading-relaxed bg-[#EDE0F0]/20 p-2.5 rounded-lg border border-[#6E488A]/10 font-medium">
                        "{asset.text}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => copyToClipboard(asset.text, index)}
                        className={`w-full py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          copiedIndex === index
                            ? "bg-[#36C4D8]/10 text-[#36C4D8] border border-[#36C4D8]/20"
                            : "bg-gradient-to-r from-[#6E488A] to-[#E36DB4] hover:opacity-90 text-white shadow-sm"
                        }`}
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> ¡Copiado con Éxito!
                          </>
                        ) : (
                          <>
                            Copiar para Compartir 📋
                          </>
                        )}
                      </button>

                      {/* Social media direct icons helpers */}
                      <div className="flex gap-2 justify-center">
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(asset.text)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-[#36C4D8]/10 hover:bg-[#36C4D8]/20 border border-[#36C4D8]/25 text-[#36C4D8] rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          Compartir WhatsApp 📱
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PESTAÑA: MIS HITOS / INSIGNIAS */}
          {activeTab === "milestones" && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="bg-gradient-to-r from-[#EDE0F0] to-[#E36DB4]/10 rounded-2xl p-6 border border-[#6E488A]/15 shadow-sm">
                <h4 className="font-display font-black text-lg text-[#6E488A] uppercase tracking-wider mb-1 flex items-center gap-2">
                  🏆 VITRINA DE INSIGNIAS M.A.P.A.™
                </h4>
                <p className="text-[#56346F]/90 text-sm leading-relaxed font-medium">
                  Tu constancia es la fuerza que transforma tu fisiología. A medida que avanzas e integras tus registros, desbloquearás insignias interactivas que conmemoran la calibración de tu nervio vago y la disolución de tu estado de hiperalerta.
                </p>
                <div className="mt-3 text-xs text-[#E36DB4] font-mono font-bold">
                  Días completados actualmente: <span className="bg-white px-2.5 py-1 rounded-full border border-[#E36DB4]/20 text-[#6E488A] ml-1">{(completedDays || []).length} de 7 días</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* MILESTONE 1: DÍA 3 */}
                {(() => {
                  const isUnlocked = (completedDays || []).length >= 3;
                  return (
                    <div 
                      className={`relative rounded-2xl border-2 p-5 flex flex-col justify-between h-[360px] transition-all duration-300 shadow-sm ${
                        isUnlocked 
                          ? "bg-gradient-to-b from-white to-amber-50/20 border-amber-500/30 shadow-amber-500/5 hover:scale-[1.02] hover:shadow-md" 
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                      id="badge-card-3"
                    >
                      {/* Top ribbon banner */}
                      <div className="absolute -top-3 right-4 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                        HITO DE BRONCE
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-center pt-2">
                          <div className={`w-18 h-18 rounded-full flex items-center justify-center border-4 ${
                            isUnlocked 
                              ? "bg-gradient-to-tr from-amber-600 to-amber-400 border-amber-200 text-white shadow-lg animate-pulse" 
                              : "bg-gray-200 border-gray-300 text-gray-400"
                          }`} style={{ animationDuration: "3s" }}>
                            <Award className="w-9 h-9" />
                          </div>
                        </div>

                        <div className="text-center space-y-1">
                          <h5 className="font-display font-black text-sm text-[#411F66] uppercase tracking-wide">
                            El Vigilante Consciente
                          </h5>
                          <p className="text-[10px] font-mono font-bold text-amber-600 uppercase">Día 3 Completado</p>
                          <p className="text-xs text-[#56346F]/80 leading-relaxed font-medium line-clamp-4 pt-1">
                            Conmemora tu entrada en el tercer día de registro somático. Has encendido el observador sobre tus respuestas adaptativas corporales primarias.
                          </p>
                        </div>
                      </div>

                      <div>
                        {isUnlocked ? (
                          <button
                            onClick={() => onTriggerMilestone?.(3)}
                            className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:opacity-90 shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            id="view-badge-3-btn"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ver Celebración 🌟</span>
                          </button>
                        ) : (
                          <div className="w-full py-2.5 rounded-xl text-xs font-bold uppercase text-center bg-gray-200 text-gray-500 border border-gray-300">
                            🔒 Requiere 3 Días Listos
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* MILESTONE 2: DÍA 5 */}
                {(() => {
                  const isUnlocked = (completedDays || []).length >= 5;
                  return (
                    <div 
                      className={`relative rounded-2xl border-2 p-5 flex flex-col justify-between h-[360px] transition-all duration-300 shadow-sm ${
                        isUnlocked 
                          ? "bg-gradient-to-b from-white to-slate-50/20 border-slate-400/30 shadow-slate-400/5 hover:scale-[1.02] hover:shadow-md" 
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                      id="badge-card-5"
                    >
                      {/* Top ribbon banner */}
                      <div className="absolute -top-3 right-4 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 border border-slate-300">
                        HITO DE PLATA
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-center pt-2">
                          <div className={`w-18 h-18 rounded-full flex items-center justify-center border-4 ${
                            isUnlocked 
                              ? "bg-gradient-to-tr from-slate-500 to-slate-300 border-slate-200 text-white shadow-lg animate-pulse" 
                              : "bg-gray-200 border-gray-300 text-gray-400"
                          }`} style={{ animationDuration: "4s" }}>
                            <Shield className="w-9 h-9" />
                          </div>
                        </div>

                        <div className="text-center space-y-1">
                          <h5 className="font-display font-black text-sm text-[#411F66] uppercase tracking-wide">
                            Centinela de la Calma
                          </h5>
                          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">Día 5 Completado</p>
                          <p className="text-xs text-[#56346F]/80 leading-relaxed font-medium line-clamp-4 pt-1">
                            Honra la constancia de sostener el registro de sobrepensamiento, control relacional y rumiación. La hipervigilancia simpática ha comenzado a retroceder de verdad.
                          </p>
                        </div>
                      </div>

                      <div>
                        {isUnlocked ? (
                          <button
                            onClick={() => onTriggerMilestone?.(5)}
                            className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-slate-500 to-slate-400 hover:opacity-90 shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            id="view-badge-5-btn"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ver Celebración 🌟</span>
                          </button>
                        ) : (
                          <div className="w-full py-2.5 rounded-xl text-xs font-bold uppercase text-center bg-gray-200 text-gray-500 border border-gray-300">
                            🔒 Requiere 5 Días Listos
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* MILESTONE 3: DÍA 7 */}
                {(() => {
                  const isUnlocked = (completedDays || []).length >= 7;
                  return (
                    <div 
                      className={`relative rounded-2xl border-2 p-5 flex flex-col justify-between h-[360px] transition-all duration-300 shadow-sm ${
                        isUnlocked 
                          ? "bg-gradient-to-b from-white to-pink-50/20 border-pink-500/30 shadow-pink-500/5 hover:scale-[1.02] hover:shadow-md" 
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                      id="badge-card-7"
                    >
                      {/* Top ribbon banner */}
                      <div className="absolute -top-3 right-4 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-pink-100 text-pink-800 border border-pink-200">
                        MAESTRÍA VAGAL
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-center pt-2">
                          <div className={`w-18 h-18 rounded-full flex items-center justify-center border-4 ${
                            isUnlocked 
                              ? "bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 border-purple-200 text-white shadow-lg animate-pulse" 
                              : "bg-gray-200 border-gray-300 text-gray-400"
                          }`} style={{ animationDuration: "2s" }}>
                            <Trophy className="w-9 h-9" />
                          </div>
                        </div>

                        <div className="text-center space-y-1">
                          <h5 className="font-display font-black text-sm text-[#411F66] uppercase tracking-wide">
                            Maestría Vagal M.A.P.A.™
                          </h5>
                          <p className="text-[10px] font-mono font-bold text-pink-500 uppercase">Día 7 Completado</p>
                          <p className="text-xs text-[#56346F]/80 leading-relaxed font-medium line-clamp-4 pt-1">
                            ¡Graduación Suprema! Has completado la brújula total de autoconocimiento de 7 días continuos. Tu mapa fisiológico, cognitivo y de anclas de calma se ha integrado.
                          </p>
                        </div>
                      </div>

                      <div>
                        {isUnlocked ? (
                          <button
                            onClick={() => onTriggerMilestone?.(7)}
                            className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            id="view-badge-7-btn"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ver Celebración 🌟</span>
                          </button>
                        ) : (
                          <div className="w-full py-2.5 rounded-xl text-xs font-bold uppercase text-center bg-gray-200 text-gray-500 border border-gray-300">
                            🔒 Requiere 7 Días Listos
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* PESTAÑA: DIARIO DE EMOCIONES */}
          {activeTab === "diary" && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="bg-gradient-to-r from-[#EDE0F0] to-purple-500/10 rounded-2xl p-6 border border-[#6E488A]/15 shadow-sm">
                <h4 className="font-display font-black text-lg text-[#6E488A] uppercase tracking-wider mb-1 flex items-center gap-2">
                  📖 DIARIO DE EMOCIONES M.A.P.A.™
                </h4>
                <p className="text-[#56346F]/90 text-sm leading-relaxed font-medium">
                  El registro escrito de tus estados corporales y emocionales estimula la corteza prefrontal de tu cerebro, ayudándote a salir de la reactividad del miedo. Escribe notas espontáneas o al terminar tus ejercicios de calma para crear tu mapa histórico de bienestar.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lado Izquierdo: Crear nueva entrada espontánea */}
                <div className="lg:col-span-1 bg-white border border-[#6E488A]/15 rounded-2xl p-5 space-y-4 shadow-sm self-start">
                  <h5 className="font-extrabold text-[#6E488A] text-sm uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E36DB4]" />
                    Nota Emocional de Hoy
                  </h5>
                  <p className="text-xs text-[#56346F]/70 font-medium leading-relaxed">
                    Registra cómo te sientes en este instante. ¿Hay tensión, alivio, pensamientos acelerados? Escríbelo con absoluta compasión.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono text-[#6E488A] uppercase tracking-wider font-bold">¿Cómo te sientes?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "En Paz", emoji: "🍃" },
                        { label: "Aliviada", emoji: "✨" },
                        { label: "Conectada", emoji: "🌸" },
                        { label: "Con Ansiedad", emoji: "📈" }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setCalmDiaryMood(item.label)}
                          className={`py-2 px-2 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition-all font-bold cursor-pointer ${
                            calmDiaryMood === item.label
                              ? "bg-[#EDE0F0] border-[#6E488A] text-[#6E488A]"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <span>{item.emoji}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-[#6E488A] uppercase tracking-wider font-bold">Tu anotación:</label>
                    <textarea
                      placeholder="Hoy me di cuenta de que mi cuerpo guardaba tensión en los hombros... pero respiré con calma y logré soltar..."
                      rows={4}
                      value={calmDiaryNote}
                      onChange={(e) => setCalmDiaryNote(e.target.value)}
                      className="w-full bg-white border border-[#6E488A]/15 focus:border-[#36C4D8] rounded-xl p-3 text-xs text-[#56346F] focus:outline-none placeholder-gray-400 font-sans font-medium resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!calmDiaryNote.trim()) {
                        alert("Por favor, escribe algo en tu diario de emociones.");
                        return;
                      }
                      const newDiaryEntry = {
                        date: new Date().toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                        note: calmDiaryNote.trim(),
                        mood: calmDiaryMood,
                        xpEarned: 15
                      };
                      const updatedEntries = [newDiaryEntry, ...(premiumData.diaryEntries || [])];
                      savePremiumState({
                        ...premiumData,
                        points: premiumData.points + 15,
                        diaryEntries: updatedEntries
                      });
                      setCalmDiaryNote("");
                      setCalmDiaryMood("En Paz");
                      alert("📝 ¡Anotación de diario guardada con éxito! Has ganado +15 XP.");
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#6E488A] to-[#E36DB4] hover:opacity-95 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 border-none"
                  >
                    <span>Guardar en mi Diario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Lado Derecho: Listado de notas */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FAF7FC]/40 border border-[#6E488A]/10 rounded-2xl p-4 shadow-xs">
                    <h5 className="font-extrabold text-[#6E488A] text-sm uppercase tracking-wide flex items-center gap-2 m-0">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      Mis Anotaciones Históricas ({ (premiumData.diaryEntries || []).length })
                    </h5>
                    
                    {(premiumData.diaryEntries || []).length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportDiaryToPDF}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-[#6E488A] rounded-xl cursor-pointer hover:shadow-md transition-all border-none shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar PDF</span>
                      </motion.button>
                    )}
                  </div>

                  {(premiumData.diaryEntries || []).length === 0 ? (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center space-y-2">
                      <BookOpen className="w-10 h-10 text-gray-300 mx-auto animate-pulse" />
                      <p className="text-sm font-bold text-gray-400 uppercase">Aún no hay anotaciones</p>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                        Completa un ejercicio diario de calma SOS o redacta una nota espontánea a la izquierda para ver tus registros históricos de bienestar aquí.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {(premiumData.diaryEntries || []).map((entry, idx) => (
                        <div key={idx} className="bg-white border border-[#6E488A]/10 rounded-xl p-4 space-y-3 text-left shadow-xs hover:border-[#36C4D8]/30 transition-all">
                          <div className="flex justify-between items-start gap-3">
                            <span className="text-[10px] text-gray-400 font-mono font-medium block capitalize">
                              {entry.date}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center gap-1">
                                <span>🌿</span>
                                <span>{entry.mood || "En Paz"}</span>
                              </span>
                              {entry.xpEarned && (
                                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[9px] font-mono font-bold border border-amber-200">
                                  +{entry.xpEarned} XP
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-[#56346F]/90 leading-relaxed whitespace-pre-line font-medium">
                            {entry.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA: GMAIL MINDFUL REMOVED */}

        </div>
      )}

      {/* EMERGENCY MODE PANIC MODAL PORTAL (🚨 Botón de pánico interactivo inmersivo) */}
      <AnimatePresence>
        {calmModeActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#56346F]/30 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full bg-white border-2 border-red-500/30 border-b-8 border-b-red-500 rounded-3xl p-6 md:p-8 text-center space-y-6 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(220,38,38,0.25)]">
              
              {/* Decorative SOS warning circle glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

              {/* Top Banner Alert */}
              <div className="flex items-center justify-center gap-2 text-red-600 font-black tracking-widest text-xs uppercase animate-pulse">
                <AlertTriangle className="w-5 h-5 animate-bounce" /> RESPIRACIÓN DE RESCATE E INTERCEPCIÓN EN PROCESO
              </div>

              {/* Progress and countdown indicator */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-mono text-red-600 font-extrabold shadow-inner">
                TIEMPO PARO DE ANSIEDAD: {Math.floor(calmSecondsLeft / 60)}:{(calmSecondsLeft % 60).toString().padStart(2, '0')}
              </div>

              {/* Main content slider according to Calm Phase */}
              <div className="min-h-[220px] flex flex-col justify-center items-center">
                {calmPhase === "intro" && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4 max-w-lg text-center"
                  >
                    <h3 className="text-xl md:text-2xl font-black text-[#6E488A] uppercase tracking-tight">
                      Tu cuerpo está activando una falsa alarma
                    </h3>
                    <p className="text-[#56346F]/90 text-sm md:text-base leading-relaxed font-medium">
                      "Esto que sientes es solo adrenalina transitoria. No significa que exista un peligro biológico real. Vamos a modular la excitación de tu amígdala cerebral con 2 minutos de respiración guiada."
                    </p>
                    <button
                      onClick={() => setCalmPhase("breathing")}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      Iniciar Respiración de Rescate Rítmica
                    </button>
                  </motion.div>
                )}

                {calmPhase === "breathing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 w-full flex flex-col items-center"
                  >
                    {/* Visual breathing bellows/circle animation with direct scaling */}
                    <div className="relative flex items-center justify-center">
                      <motion.div 
                        animate={{
                          scale: calmBreathingCycle === "inhale" ? 1.4 : calmBreathingCycle === "hold" ? 1.4 : 0.9,
                          opacity: calmBreathingCycle === "inhale" ? 0.8 : calmBreathingCycle === "hold" ? 0.9 : 0.4
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="w-24 h-24 rounded-full bg-red-500/15 absolute blur-md"
                      />
                      <motion.div 
                        animate={{
                          scale: calmBreathingCycle === "inhale" ? 1.3 : calmBreathingCycle === "hold" ? 1.3 : 0.9,
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white text-3xl font-black shadow-lg relative"
                      >
                        {calmBreathingCycle === "inhale" && <Smile className="w-10 h-10 animate-pulse" />}
                        {calmBreathingCycle === "hold" && <Clock className="w-10 h-10 animate-spin" style={{ animationDuration: '8s' }} />}
                        {calmBreathingCycle === "exhale" && <Volume2 className="w-10 h-10" />}
                      </motion.div>
                    </div>

                    <div className="space-y-2 text-center">
                      <h4 className="text-2xl font-black text-[#6E488A] uppercase tracking-widest font-mono">
                        {calmBreathingCycle === "inhale" && "Inhala Suavemente..."}
                        {calmBreathingCycle === "hold" && "Mantén el Aire..."}
                        {calmBreathingCycle === "exhale" && "Exhala Científicamente..."}
                      </h4>
                      <p className="text-xs text-[#56346F]/80 max-w-sm mx-auto font-medium">
                        {calmBreathingCycle === "inhale" && "Llena tu abdomen gradualmente. Siente el aire fresco."}
                        {calmBreathingCycle === "hold" && "Permite que tu sistema nervioso asimile el volumen."}
                        {calmBreathingCycle === "exhale" && "Suelta despacio, relajando hombros y mandíbula."}
                      </p>
                    </div>

                    <button
                      onClick={() => setCalmPhase("techniques")}
                      className="text-xs font-bold text-[#56346F]/70 hover:text-red-500 underline cursor-pointer"
                    >
                      Saltar a Técnicas Sensoriales 5-4-3-2-1
                    </button>
                  </motion.div>
                )}

                {calmPhase === "techniques" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 max-w-lg text-center"
                  >
                    <h3 className="text-lg font-black text-red-600 uppercase">
                      Técnica de Conexión Sensorial 5 - 4 - 3 - 2 - 1
                    </h3>
                    <p className="text-[#56346F]/90 text-xs md:text-sm leading-relaxed font-medium">
                      Regresa tu mente pensante aquí y ahora haciendo foco absoluto en tu entorno actual:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      <div className="bg-[#EDE0F0]/30 p-3 rounded-xl border border-[#6E488A]/10 text-xs font-medium">
                        <strong className="text-[#E36DB4] text-sm block font-mono font-bold">5 Cosas que veas</strong>
                        Identifica detalles de tu entorno (ej. un tornillo, una sombra).
                      </div>
                      <div className="bg-[#EDE0F0]/30 p-3 rounded-xl border border-[#6E488A]/10 text-xs font-medium">
                        <strong className="text-[#36C4D8] text-sm block font-mono font-bold">4 Cosas físicas</strong>
                        Siente tus pies tocando el firme suelo y el aire rozando tu piel.
                      </div>
                      <div className="bg-[#EDE0F0]/30 p-3 rounded-xl border border-[#6E488A]/10 text-xs font-medium">
                        <strong className="text-[#6E488A] text-sm block font-mono font-bold">3 Sonidos auditivos</strong>
                        Escucha los carros, la brisa o el motor del refrigerador.
                      </div>
                      <div className="bg-[#EDE0F0]/30 p-3 rounded-xl border border-[#6E488A]/10 text-xs font-medium">
                        <strong className="text-red-500 text-sm block font-mono font-bold">2 Olores olfativos</strong>
                        Inhala profundamente de tu ropa o del clima ambiental.
                      </div>
                    </div>
                    <button
                      onClick={() => setCalmPhase("concluding")}
                      className="px-6 py-2.5 bg-[#6E488A] hover:opacity-90 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Entendido, me siento mucho mejor
                    </button>
                  </motion.div>
                )}

                {calmPhase === "concluding" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 max-w-md text-center animate-fadeIn w-full"
                  >
                    <div className="inline-flex w-14 h-14 bg-emerald-50 text-[#36C4D8] items-center justify-center rounded-full border border-[#36C4D8]/20 mb-1 shadow-sm">
                      <CheckCircle className="w-8 h-8 animate-bounce" />
                    </div>
                    <h3 className="text-lg font-black text-emerald-600 uppercase leading-none">
                      ¡Amígdala Cerebral Regulada!
                    </h3>
                    <p className="text-[#56346F]/90 text-xs leading-relaxed font-medium">
                      Excelente labor de contención bio-cognitiva. Registrar tu respuesta rítmica enseña a tu cerebro reptil que estás a salvo.
                    </p>

                    {/* NEW: Diario de Emociones Form at end of Calm Exercise */}
                    <div className="bg-[#FAF7FC] border border-[#6E488A]/10 p-4 rounded-xl text-left space-y-3">
                      <h4 className="text-xs font-extrabold text-[#6E488A] uppercase tracking-wide flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        Anotar en mi Diario de Emociones
                      </h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                        Escribe una breve nota sobre cómo se siente tu cuerpo y mente tras este ejercicio de calma para guardarlo junto con los resultados de hoy.
                      </p>

                      <div className="space-y-2">
                        <label className="block text-[9px] font-mono text-[#6E488A] uppercase tracking-wider font-bold">Estado actual:</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {["En Paz", "Aliviada", "Conectada"].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setCalmDiaryMood(status)}
                              className={`py-1 px-1.5 text-[10px] font-bold rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                calmDiaryMood === status
                                  ? "bg-purple-100 border-[#6E488A] text-[#6E488A]"
                                  : "bg-white border-gray-150 text-gray-600 hover:border-gray-200"
                              }`}
                            >
                              <span>{status}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <textarea
                          placeholder="Escribe una breve frase reflexiva sobre tu experiencia de calma de hoy..."
                          rows={2}
                          value={calmDiaryNote}
                          onChange={(e) => setCalmDiaryNote(e.target.value)}
                          className="w-full bg-white border border-[#6E488A]/15 focus:border-[#36C4D8] rounded-lg p-2 text-xs text-[#56346F] focus:outline-none placeholder-gray-400 font-sans font-medium resize-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={endCalmMode}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-black text-xs rounded-xl cursor-pointer shadow-sm border-none uppercase tracking-wider"
                    >
                      Guardar en Diario y Retornar al Diagnóstico
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Close Button / abort salvage */}
              <div className="border-t border-[#6E488A]/12 pt-4 flex justify-between items-center text-[11px] text-[#56346F]/70 font-medium">
                <span>Tu proceso está totalmente protegido científicamente</span>
                <button
                  onClick={() => {
                    if (confirm("¿Estás seguro de que deseas salir del protocolo de calma anticipadamente?")) {
                      endCalmMode();
                    }
                  }}
                  className="hover:text-red-600 transition-colors cursor-pointer font-bold"
                >
                  Salir de Emergencia SOS
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
