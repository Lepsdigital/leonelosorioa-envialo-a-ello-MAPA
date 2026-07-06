import { Question } from "./types";

export const QUESTIONS: Question[] = [
  // ==========================================
  // DÍA 1: SINTOMATOLOGÍA FISIOLÓGICA Y ALERTA (Preguntas 1-7)
  // ==========================================
  {
    id: 1,
    category: "activacion",
    type: "emoji",
    text: "[Día 1 - Q1] Cuando notas tensión corporal o inquietud, ¿cómo se expresa principalmente en ti?",
    subtext: "Selecciona el emoji que mejor represente tu respuesta física más frecuente.",
    options: [
      { value: "palpitaciones", label: "Nudo en el estómago u opresión en el pecho", emoji: "🤢", scoreWeight: { vigilante: 3, anticipador: 2 } },
      { value: "mente_acelerada", label: "Mente hiperactiva que no puede parar", emoji: "🤯", scoreWeight: { anticipador: 4, hipercontrolador: 1 } },
      { value: "tension_muscular", label: "Hombros tensos, mandíbula apretada", emoji: "🦷", scoreWeight: { hipercontrolador: 3, sobrecargado: 2 } },
      { value: "cansancio_extremo", label: "Agotamiento físico y mental profundo", emoji: "🥱", scoreWeight: { sobrecargado: 4, protectorSilencioso: 2 } },
      { value: "bloqueo", label: "Sensación de parálisis o desconexión", emoji: "😶", scoreWeight: { protectorSilencioso: 4, vigilante: 2 } }
    ]
  },
  {
    id: 2,
    category: "patrones",
    type: "scale",
    text: "[Día 1 - Q2] ¿Con qué frecuencia revisas cosas (mensajes, pendientes, puertas, noticias) de manera compulsiva?",
    subtext: "1 es 'Casi nunca' y 10 es 'Constantemente con mucha inquietud'.",
    minLabel: "Paz total",
    maxLabel: "Alerta máxima",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: { protectorSilencioso: 1 } },
      { value: "4", label: "4", scoreWeight: { protectorSilencioso: 2 } },
      { value: "5", label: "5", scoreWeight: { sobrecargado: 2 } },
      { value: "6", label: "6", scoreWeight: { sobrecargado: 3, hipercontrolador: 1 } },
      { value: "7", label: "7", scoreWeight: { hipercontrolador: 3 } },
      { value: "8", label: "8", scoreWeight: { hipercontrolador: 4, vigilante: 1 } },
      { value: "9", label: "9", scoreWeight: { vigilante: 4, anticipador: 1 } },
      { value: "10", label: "10", scoreWeight: { vigilante: 5, anticipador: 3 } }
    ]
  },
  {
    id: 3,
    category: "detonantes",
    type: "scenario",
    text: "[Día 1 - Q3] Un amigo cercano lleva horas sin responder un mensaje importante tuyo. ¿Cuál es tu reacción?",
    subtext: "Haz clic sobre el escenario mental que más resuene contigo.",
    options: [
      { value: "accidente", label: "Pienso que le pasó algo malo o tuvo una emergencia.", emoji: "🚓", scoreWeight: { anticipador: 4, vigilante: 3 } },
      { value: "enojo", label: "Creo que se molestó conmigo o hice algo indebido pasivamente.", emoji: "👤", scoreWeight: { protectorSilencioso: 4, sobrecargado: 1 } },
      { value: "control", label: "Insisto llamando o buscando otra vía de verificar.", emoji: "📱", scoreWeight: { hipercontrolador: 4 } },
      { value: "ocupado", label: "Me enfoco en mis cosas, asumiendo racionalmente que está ocupado.", emoji: "🧘", scoreWeight: { protectorSilencioso: 1 } }
    ]
  },
  {
    id: 4,
    category: "patrones",
    type: "card",
    text: "[Día 1 - Q4] Para ti, delegar una tarea importante o dejar que alguien más se encargue se siente como...",
    subtext: "Elige la tarjeta que mejor ilustre tu nivel de comodidad.",
    options: [
      { value: "alivio", label: "Un gran alivio y oportunidad para descansar.", emoji: "🌴", scoreWeight: { protectorSilencioso: 3 } },
      { value: "ansiedad_control", label: "Incomodidad crítica; siento que no quedará bien hecho.", emoji: "🔎", scoreWeight: { hipercontrolador: 5, vigilante: 1 } },
      { value: "culpa", label: "Culpa por no hacerme cargo yo misma.", emoji: "😔", scoreWeight: { sobrecargado: 4 } },
      { value: "desconfianza", label: "Incertidumbre; prefiero observar de cerca para evitar errores.", emoji: "👀", scoreWeight: { vigilante: 3, anticipador: 2 } }
    ]
  },
  {
    id: 5,
    category: "activacion",
    type: "emoji",
    text: "[Día 1 - Q5] ¿Cuál es tu nivel de energía tras interactuar socialmente en días intensos?",
    subtext: "Marca cómo queda tu reserva de batería interna.",
    options: [
      { value: "full", label: "Estable, disfruto conectar con personas", emoji: "🔋", scoreWeight: { protectorSilencioso: 2 } },
      { value: "baja_lenta", label: "Un poco desgastado pero manejo la calma", emoji: "📉", scoreWeight: { sobrecargado: 1 } },
      { value: "alerta", label: "Sobrecargado de estímulos, sigo pensando en lo que dije", emoji: "⚠️", scoreWeight: { protectorSilencioso: 4, anticipador: 2 } },
      { value: "vacio", label: "Totalmente agotado, necesito aislarme en silencio", emoji: "📴", scoreWeight: { vigilante: 3, sobrecargado: 4 } }
    ]
  },
  {
    id: 6,
    category: "detonantes",
    type: "multiple",
    text: "[Día 1 - Q6] Cuando surge un cambio imprevisto de planes de última hora...",
    options: [
      { value: "bloqueo", label: "Mi mente se paraliza buscando qué salió mal", scoreWeight: { vigilante: 3 } },
      { value: "catastrofe", label: "Preveo inmediatamente todas las nuevas complicaciones", scoreWeight: { anticipador: 4 } },
      { value: "recalcular", label: "Me enojo o me frustro por perder el orden planificado", scoreWeight: { hipercontrolador: 4 } },
      { value: "adaptacion", label: "Me causa cansancio, pero lo asumo sin tormento interno", scoreWeight: { sobrecargado: 2 } }
    ]
  },
  {
    id: 7,
    category: "patrones",
    type: "card",
    text: "[Día 1 - Q7] En tus relaciones, decir que 'NO' se siente habitualmente como...",
    subtext: "Analiza tu pauta de límites emocionales.",
    options: [
      { value: "imposible", label: "Imposible. Temo generar rechazo o decepcionar.", emoji: "🥹", scoreWeight: { sobrecargado: 4, protectorSilencioso: 3 } },
      { value: "agotador", label: "Un conflicto. Digo que no pero luego sobrepienso de más.", emoji: "💬", scoreWeight: { anticipador: 3, protectorSilencioso: 2 } },
      { value: "control_limites", label: "Necesario para no perder el control de mis propios tiempos.", emoji: "🛡️", scoreWeight: { hipercontrolador: 2 } },
      { value: "comodo", label: "Fácil. Establezco mis límites con asertividad y calma.", emoji: "🍃", scoreWeight: {} }
    ]
  },

  // ==========================================
  // DÍA 2: DESENCADENANTES Y SENSIBILIDAD INDIVIDUAL (Preguntas 8-14)
  // ==========================================
  {
    id: 8,
    category: "detonantes",
    type: "scale",
    text: "[Día 2 - Q1] ¿Qué tanto te influye el desorden o el caos en tus espacios físicos (casa, oficina)?",
    subtext: "1 es 'Me da igual, convivo bien con el caos' y 10 es 'Me causa agobio severo'.",
    minLabel: "Insensible",
    maxLabel: "Hiper-sensible",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: {} },
      { value: "4", label: "4", scoreWeight: { sobrecargado: 1 } },
      { value: "5", label: "5", scoreWeight: { sobrecargado: 2 } },
      { value: "6", label: "6", scoreWeight: { protectorSilencioso: 2 } },
      { value: "7", label: "7", scoreWeight: { vigilante: 2 } },
      { value: "8", label: "8", scoreWeight: { anticipador: 2, hipercontrolador: 2 } },
      { value: "9", label: "9", scoreWeight: { hipercontrolador: 4, vigilante: 2 } },
      { value: "10", label: "10", scoreWeight: { hipercontrolador: 5, vigilante: 3 } }
    ]
  },
  {
    id: 9,
    category: "patrones",
    type: "scenario",
    text: "[Día 2 - Q2] Cuando recuerdas una discusión o error tonto de hace días o semanas...",
    subtext: "Elige la descripción que mejor refleje tu hábito de rumia.",
    options: [
      { value: "bucle", label: "Repito la conversación buscando qué debí haber contestado.", emoji: "🔁", scoreWeight: { anticipador: 3, protectorSilencioso: 3 } },
      { value: "castigo", label: "Siento vergüenza inmediata como si estuviera ocurriendo de nuevo.", emoji: "🫣", scoreWeight: { vigilante: 2, sobrecargado: 2 } },
      { value: "reparar", label: "Busco maneras de justificar, arreglar o disculparme de nuevo.", emoji: "🔧", scoreWeight: { hipercontrolador: 3, sobrecargado: 3 } },
      { value: "soltar", label: "Lo reconozco como pasado, me sonrío y lo dejo ir.", emoji: "🎈", scoreWeight: {} }
    ]
  },
  {
    id: 10,
    category: "proteccion",
    type: "multiple",
    text: "[Día 2 - Q3] ¿Cuál es tu vía recurrente para recuperar la serenidad cuando estás bajo mucha presión?",
    options: [
      { value: "aislamiento", label: "Desconectarme de todos, ponerme audífonos y no hablar", scoreWeight: { protectorSilencioso: 3 } },
      { value: "rutina", label: "Limpiar, ordenar, organizar listas de pendientes", scoreWeight: { hipercontrolador: 3 } },
      { value: "distraccion", label: "Hacer ejercicio, ver videos o buscar estímulos constantes", scoreWeight: { sobrecargado: 2, anticipador: 1 } },
      { value: "respiracion", label: "Hacer pausas conscientes de respiración o meditar", scoreWeight: { vigilante: 1 } }
    ]
  },
  {
    id: 11,
    category: "detonantes",
    type: "emoji",
    text: "[Día 2 - Q4] Si sientes que el ambiente en tu casa o trabajo está tenso, ¿qué ocurre en ti?",
    subtext: "Elige tu receptor del clima emocional del espacio.",
    options: [
      { value: "escarabajo", label: "Me pongo en guardia para evitar conflictos o mediar", emoji: "🛡️", scoreWeight: { protectorSilencioso: 4, sobrecargado: 2 } },
      { value: "escaner", label: "Analizo gestos detalladamente para ver si es culpa mía", emoji: "🧐", scoreWeight: { vigilante: 4, anticipador: 1 } },
      { value: "muro", label: "Me cierro emocionalmente y actúo distante", emoji: "🧱", scoreWeight: { protectorSilencioso: 3, hipercontrolador: 1 } },
      { value: "escape", label: "Siento ganas físicas de huir de ese lugar", emoji: "🏃", scoreWeight: { vigilante: 3, anticipador: 2 } }
    ]
  },
  {
    id: 12,
    category: "patrones",
    type: "multiple",
    text: "[Día 2 - Q5] Tus pensamientos sobre metas, proyectos o el futuro suelen estar guiados por...",
    options: [
      { value: "miedo_fallar", label: "La imperiosa necesidad de prever lo que pueda salir mal", scoreWeight: { anticipador: 4, vigilante: 1 } },
      { value: "perfeccionismo", label: "El estándar riguroso de que debe salir perfecto o será un desastre", scoreWeight: { hipercontrolador: 4, sobrecargado: 2 } },
      { value: "esfuerzo", label: "La sensación de que si no lo hago yo solo, nadie lo hará bien", scoreWeight: { sobrecargado: 4 } },
      { value: "optimismo", label: "Compromiso entusiasta, asumiendo desafíos naturales", scoreWeight: { protectorSilencioso: 1 } }
    ]
  },
  {
    id: 13,
    category: "activacion",
    type: "scale",
    text: "[Día 2 - Q6] ¿Qué tanto tiendes a camuflar tu ansiedad ante los demás con un semblante alegre?",
    subtext: "1 es 'Me muestro tal cual soy' y 10 es 'Nadie se imagina la agitación interna que vivo'.",
    minLabel: "Transparente",
    maxLabel: "Máscara perfecta",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: {} },
      { value: "4", label: "4", scoreWeight: { vigilante: 1 } },
      { value: "5", label: "5", scoreWeight: { sobrecargado: 1 } },
      { value: "6", label: "6", scoreWeight: { hipercontrolador: 1 } },
      { value: "7", label: "7", scoreWeight: { sobrecargado: 3, protectorSilencioso: 2 } },
      { value: "8", label: "8", scoreWeight: { protectorSilencioso: 3, vigilante: 2 } },
      { value: "9", label: "9", scoreWeight: { protectorSilencioso: 4, anticipador: 1 } },
      { value: "10", label: "10", scoreWeight: { protectorSilencioso: 5, sobrecargado: 3 } }
    ]
  },
  {
    id: 14,
    category: "activacion",
    type: "scale",
    text: "[Día 2 - Q7] ¿Qué tan conectada te sientes con tus señales corporales biológicas tempranas?",
    subtext: "1 es 'Conexión baja, me entero al explotar' y 10 es 'Siento cualquier variación ínfima'.",
    minLabel: "Anestesiada",
    maxLabel: "Hiper-radar",
    options: [
      { value: "1", label: "1", scoreWeight: { protectorSilencioso: 4 } },
      { value: "2", label: "2", scoreWeight: { protectorSilencioso: 3 } },
      { value: "3", label: "3", scoreWeight: { sobrecargado: 3 } },
      { value: "4", label: "4", scoreWeight: { sobrecargado: 2 } },
      { value: "5", label: "5", scoreWeight: { hipercontrolador: 1 } },
      { value: "6", label: "6", scoreWeight: { hipercontrolador: 2 } },
      { value: "7", label: "7", scoreWeight: { anticipador: 2 } },
      { value: "8", label: "8", scoreWeight: { anticipador: 3 } },
      { value: "9", label: "9", scoreWeight: { vigilante: 4 } },
      { value: "10", label: "10", scoreWeight: { vigilante: 5 } }
    ]
  },

  // ==========================================
  // DÍA 3: RUMIA MENTAL Y PENSAMIENTO AUTOMÁTICO (Preguntas 15-21)
  // ==========================================
  {
    id: 15,
    category: "proteccion",
    type: "card",
    text: "[Día 3 - Q1] De los siguientes recursos tranquilizadores, ¿cuál te produce un alivio inmediato?",
    subtext: "Elige la fuente de distensión idónea para tu sistema nervioso.",
    options: [
      { value: "naturaleza", label: "Caminar al aire libre, ver plantas o sentir el sol.", emoji: "🌲", scoreWeight: { vigilante: 1, sobrecargado: 1 } },
      { value: "silencio", label: "Cuarto oscuro, silencio absoluto y sin notificaciones.", emoji: "🕯️", scoreWeight: { protectorSilencioso: 4, vigilante: 1 } },
      { value: "expresion", label: "Escribir libremente lo que siento o desahogarme con alguien.", emoji: "✍️", scoreWeight: { anticipador: 2, sobrecargado: 2 } },
      { value: "orden", label: "Limpiar y organizar un armario o agenda minuciosamente.", emoji: "🗃️", scoreWeight: { hipercontrolador: 4 } }
    ]
  },
  {
    id: 16,
    category: "patrones",
    type: "scenario",
    text: "[Día 3 - Q2] Si cometes un pequeño error en un entorno laboral o social, tu diálogo interno es...",
    subtext: "Identifica tu arquetipo de autocrítica.",
    options: [
      { value: "catastrofista", label: "'Ya dañé mi imagen. Todos estarán murmurando o juzgándome.'", emoji: "📉", scoreWeight: { anticipador: 4, vigilante: 2 } },
      { value: "perfeccionista", label: "'Inaceptable. Debí haberme preparado el triple.'", emoji: "🫵", scoreWeight: { hipercontrolador: 4, sobrecargado: 1 } },
      { value: "ocultador", label: "Muestro una sonrisa impasible, pero por dentro me consume la vergüenza.", emoji: "🎭", scoreWeight: { protectorSilencioso: 4, sobrecargado: 2 } },
      { value: "humor", label: "Hago una broma espontánea y sigo adelante sin drama.", emoji: "🃏", scoreWeight: {} }
    ]
  },
  {
    id: 17,
    category: "patrones",
    type: "scale",
    text: "[Día 3 - Q3] ¿Qué tanto sientes que cargas en tus hombros con los problemas ajenos?",
    subtext: "1 es 'Soy independiente de lo que les pasa a otros' y 10 es 'Suelgo resolverles la vida antes'.",
    minLabel: "Centrada",
    maxLabel: "Atlante Emocional",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: {} },
      { value: "4", label: "4", scoreWeight: {} },
      { value: "5", label: "5", scoreWeight: { protectorSilencioso: 1 } },
      { value: "6", label: "6", scoreWeight: { protectorSilencioso: 2 } },
      { value: "7", label: "7", scoreWeight: { vigilante: 1 } },
      { value: "8", label: "8", scoreWeight: { sobrecargado: 3, hipercontrolador: 1 } },
      { value: "9", label: "9", scoreWeight: { sobrecargado: 4, anticipador: 1 } },
      { value: "10", label: "10", scoreWeight: { sobrecargado: 5, protectorSilencioso: 2 } }
    ]
  },
  {
    id: 18,
    category: "detonantes",
    type: "multiple",
    text: "[Día 3 - Q4] Esa sensación de que 'siempre falta algo por hacer' o de que 'no merezco descansar' se te presenta...",
    options: [
      { value: "siempre", label: "Casi todos los días, incluso en mis tiempos libres", scoreWeight: { sobrecargado: 4, hipercontrolador: 2 } },
      { value: "noches", label: "Por las noches, afectando la conciliación del sueño", scoreWeight: { anticipador: 4, vigilante: 2 } },
      { value: "laboral", label: "Únicamente en picos de trabajo o proyectos intensos", scoreWeight: { hipercontrolador: 3 } },
      { value: "ocasional", label: "Muy rara vez; al terminar mis cosas me desconecto feliz", scoreWeight: {} }
    ]
  },
  {
    id: 19,
    category: "proteccion",
    type: "multiple",
    text: "[Día 3 - Q5] ¿Tienes a alguien cercano con quien puedas llorar o confesar tu ansiedad sin filtros?",
    options: [
      { value: "si_completo", label: "Sí, tengo un puerto seguro incondicional", scoreWeight: { vigilante: -1, protectorSilencioso: -1 } },
      { value: "parcial", label: "Sí, pero evito agobiarlos para no ser una carga pesada", scoreWeight: { sobrecargado: 3, protectorSilencioso: 2 } },
      { value: "no", label: "No, prefiero asimilar mis problemas en absoluta soledad", scoreWeight: { protectorSilencioso: 5, vigilante: 2 } }
    ]
  },
  {
    id: 20,
    category: "detonantes",
    type: "emoji",
    text: "[Día 3 - Q6] Si tuvieras que resumir tu relación actual con la ansiedad hoy mismo, dirías que es...",
    subtext: "Identifica el rol inconsciente que le otorgas.",
    options: [
      { value: "combate", label: "Una batalla diaria desgastante que me deja exhausta", emoji: "⚔️", scoreWeight: { vigilante: 3, sobrecargado: 3 } },
      { value: "bloqueo", label: "Un fantasma misterioso que aparece y me paraliza", emoji: "👻", scoreWeight: { protectorSilencioso: 4, vigilante: 1 } },
      { value: "sabor", label: "Un reloj implacable que me recuerda el futuro de continuo", emoji: "⏳", scoreWeight: { anticipador: 5, hipercontrolador: 2 } },
      { value: "desafortunado", label: "Un ruido de estática de fondo que intento ignorar", emoji: "🔇", scoreWeight: { sobrecargado: 4, protectorSilencioso: 2 } }
    ]
  },
  {
    id: 21,
    category: "activacion",
    type: "emoji",
    text: "[Día 3 - Q7] ¿Cómo se comporta tu digestión o estómago durante temporadas de alta demanda emocional?",
    subtext: "Tu segundo cerebro en el intestino suele enviarte reflejos claros.",
    options: [
      { value: "espasmos", label: "Presión o espasmos estomacales agudos", emoji: "⚡", scoreWeight: { vigilante: 3, hipercontrolador: 2 } },
      { value: "inapetencia", label: "El estómago se cierra por completo, no tolero comida", emoji: "🤐", scoreWeight: { anticipador: 4, protectorSilencioso: 2 } },
      { value: "ansia_dulce", label: "Atracción impulsiva por azúcares o comida rápida", emoji: "🍩", scoreWeight: { sobrecargado: 4 } },
      { value: "estable", label: "Se mantiene relativamente normativo y estable", emoji: "🥗", scoreWeight: {} }
    ]
  },

  // ==========================================
  // DÍA 4: RELACIONES E INTERACCIONES SOCIALES (Preguntas 22-28)
  // ==========================================
  {
    id: 22,
    category: "detonantes",
    type: "scenario",
    text: "[Día 4 - Q1] Tienes que dar una opinión contraria a la de tu grupo o jefes. ¿Qué experimentas?",
    subtext: "Detecta tus patrones de conformismo o aprensión.",
    options: [
      { value: "miedo_rechazo", label: "Prefiero callarme por temor a generar disonancia o rechazo.", emoji: "🤐", scoreWeight: { protectorSilencioso: 4, sobrecargado: 2 } },
      { value: "sobrepreparacion", label: "Estudio mil veces el argumento para blindar mi postura y no fallar.", emoji: "📚", scoreWeight: { hipercontrolador: 4, anticipador: 2 } },
      { value: "palpitaciones_hablar", label: "Lo digo pero con temblor de voz y culpa posterior.", emoji: "💔", scoreWeight: { vigilante: 4, sobrecargado: 2 } },
      { value: "fluidez", label: "Expreso mi desacuerdo de forma neutral y directa.", emoji: "🙌", scoreWeight: {} }
    ]
  },
  {
    id: 23,
    category: "patrones",
    type: "scale",
    text: "[Día 4 - Q2] ¿Con qué frecuencia sobrepiensas tus interacciones sociales después de que terminan?",
    subtext: "Analizando si dijiste algo inapropiado, si se rieron de ti o si caíste bien.",
    minLabel: "Cero rumia",
    maxLabel: "Escrutinio extremo",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: { protectorSilencioso: 1 } },
      { value: "4", label: "4", scoreWeight: { protectorSilencioso: 2 } },
      { value: "5", label: "5", scoreWeight: { sobrecargado: 1 } },
      { value: "6", label: "6", scoreWeight: { sobrecargado: 3 } },
      { value: "7", label: "7", scoreWeight: { anticipador: 3, vigilante: 1 } },
      { value: "8", label: "8", scoreWeight: { vigilante: 3, anticipador: 2 } },
      { value: "9", label: "9", scoreWeight: { vigilante: 5, protectorSilencioso: 2 } },
      { value: "10", label: "10", scoreWeight: { vigilante: 5, anticipador: 4 } }
    ]
  },
  {
    id: 24,
    category: "activacion",
    type: "card",
    text: "[Día 4 - Q3] El cansancio acumulado tras lidiar con conflictos ajenos se siente principalmente en ti como...",
    subtext: "Reconoce cómo resuena el cansancio empático.",
    options: [
      { value: "pesadez_cerebro", label: "Falta de claridad mental, como una nube pesada sobre el cerebro.", emoji: "☁️", scoreWeight: { sobrecargado: 4, protectorSilencioso: 2 } },
      { value: "irritabilidad", label: "Irritabilidad o poca paciencia hacia pequeños detalles diarios.", emoji: "🔥", scoreWeight: { hipercontrolador: 4, vigilante: 2 } },
      { value: "somatizacion", label: "Dolor u opresión en los trapecios, cuello o espalda baja.", emoji: "📐", scoreWeight: { sobrecargado: 4, hipercontrolador: 2 } },
      { value: "huida", label: "Deseo irresistible de desaparecer, apagar el teléfono y dormir.", emoji: "🚪", scoreWeight: { protectorSilencioso: 5, vigilante: 2 } }
    ]
  },
  {
    id: 25,
    category: "detonantes",
    type: "multiple",
    text: "[Día 4 - Q4] ¿Qué comportamiento de tus seres queridos activa con mayor facilidad tu amígdala?",
    options: [
      { value: "distanciamiento", label: "Cuando los noto callados, distantes o cortantes en sus respuestas.", scoreWeight: { vigilante: 4, protectorSilencioso: 2 } },
      { value: "desorden_interno", label: "Cuando ignoran mis directrices o actúan con desorganización total.", scoreWeight: { hipercontrolador: 4 } },
      { value: "quejas", label: "Cuando se quejan continuamente esperando que yo les resuelva la vida.", scoreWeight: { sobrecargado: 5 } },
      { value: "silencio_comodo", label: "No me afecta en exceso; tolero bien sus estados de ánimo cambiantes.", scoreWeight: {} }
    ]
  },
  {
    id: 26,
    category: "proteccion",
    type: "card",
    text: "[Día 4 - Q5] Para recargar tu energía relacional, prefieres dinámicas enfocadas en...",
    subtext: "Tus anclas de nutrición socio-emocional.",
    options: [
      { value: "conversacion_uno", label: "Una charla profunda uno-a-uno con un amigo de verdad, sin prisas.", emoji: "☕", scoreWeight: { protectorSilencioso: 3, sobrecargado: 2 } },
      { value: "soledad_activa", label: "Hacer actividades en solitario (leer, cocinar, pasear) sin interactuar.", emoji: "🧘", scoreWeight: { vigilante: 3, protectorSilencioso: 2 } },
      { value: "grupo_ligero", label: "Un encuentro social ruidoso y alegre pero sin temas de índole personal.", emoji: "🎉", scoreWeight: { sobrecargado: 2 } },
      { value: "ordenar_agenda", label: "Reunirme a planificar estructuradamente un proyecto común.", emoji: "📈", scoreWeight: { hipercontrolador: 3 } }
    ]
  },
  {
    id: 27,
    category: "patrones",
    type: "multiple",
    text: "[Día 4 - Q6] ¿Cómo respondes cuando alguien te elogia de forma sincera y pública?",
    options: [
      { value: "incredulidad", label: "Me incomodo, siento que no es para tanto o que exagera.", scoreWeight: { protectorSilencioso: 4, sobrecargado: 2 } },
      { value: "perfeccion_exigente", label: "Pienso inmediatamente en todo lo que podría haber salido mejor.", scoreWeight: { hipercontrolador: 4 } },
      { value: "mas_presion", label: "Me da pavor porque siento que aumenta la expectativa a futuro.", scoreWeight: { anticipador: 4, vigilante: 2 } },
      { value: "gratitud", label: "Lo recibo con alegría y agradezco amablemente.", scoreWeight: {} }
    ]
  },
  {
    id: 28,
    category: "activacion",
    type: "scale",
    text: "[Día 4 - Q7] ¿Qué tanta rigidez experimentas en tu mirada o mandíbula tras interactuar en público?",
    subtext: "La tensión facial es un marcador de esfuerzo por mantener el control.",
    minLabel: "Suelta",
    maxLabel: "Piedra tallada",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: { protectorSilencioso: 1 } },
      { value: "4", label: "4", scoreWeight: { sobrecargado: 1 } },
      { value: "5", label: "5", scoreWeight: { sobrecargado: 2 } },
      { value: "6", label: "6", scoreWeight: { hipercontrolador: 2 } },
      { value: "7", label: "7", scoreWeight: { hipercontrolador: 3 } },
      { value: "8", label: "8", scoreWeight: { vigilante: 3, anticipador: 1 } },
      { value: "9", label: "9", scoreWeight: { vigilante: 4, sobrecargado: 3 } },
      { value: "10", label: "10", scoreWeight: { vigilante: 5, protectorSilencioso: 3 } }
    ]
  },

  // ==========================================
  // DÍA 5: HÁBITOS DE CONTROL Y EXIGENCIA PERMANENTE (Preguntas 29-35)
  // ==========================================
  {
    id: 29,
    category: "patrones",
    type: "scenario",
    text: "[Día 5 - Q1] Si una plan o rutina no sale exactamente como lo habías organizado en tu mente...",
    subtext: "Examina tu nivel de tolerancia a la frustración.",
    options: [
      { value: "enojo_agudo", label: "Me enojo intensamente y culpo al desorden del entorno.", emoji: "🤬", scoreWeight: { hipercontrolador: 4 } },
      { value: "miedo_catastrofe", label: "Me da pánico pensar que todo el resto de la jornada se arruinará.", emoji: "🧯", scoreWeight: { anticipador: 4, vigilante: 2 } },
      { value: "resignacion_triste", label: "Siento desánimo absoluto y ganas de abandonar la tarea.", emoji: "🌧️", scoreWeight: { sobrecargado: 4, protectorSilencioso: 2 } },
      { value: "fluir_calma", label: "Acepto el imprevisto con soltura y rediseño en el momento.", emoji: "🧩", scoreWeight: {} }
    ]
  },
  {
    id: 30,
    category: "detonantes",
    type: "scale",
    text: "[Día 5 - Q2] ¿Cómo evalúas tu nivel de autoexigencia y perfeccionismo diario?",
    subtext: "1 es 'Me trato con mucha compasión y ligereza' y 10 es 'Soy un juez implacable conmigo'.",
    minLabel: "Auto-compasiva",
    maxLabel: "Inquisidor interno",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: {} },
      { value: "4", label: "4", scoreWeight: { protectorSilencioso: 1 } },
      { value: "5", label: "5", scoreWeight: { sobrecargado: 1 } },
      { value: "6", label: "6", scoreWeight: { sobrecargado: 2 } },
      { value: "7", label: "7", scoreWeight: { vigilante: 2 } },
      { value: "8", label: "8", scoreWeight: { anticipador: 2, hipercontrolador: 2 } },
      { value: "9", label: "9", scoreWeight: { hipercontrolador: 4, anticipador: 3 } },
      { value: "10", label: "10", scoreWeight: { hipercontrolador: 5, sobrecargado: 4 } }
    ]
  },
  {
    id: 31,
    category: "activacion",
    type: "emoji",
    text: "[Día 5 - Q3] ¿Qué tan difícil te resulta desconectarte de correos o notificaciones de trabajo los fines de semana?",
    subtext: "El hipervínculo digital suele ser un mecanismo de alerta camuflado.",
    options: [
      { value: "chequeo_constante", label: "Imposible. Reviso la pantalla cada 20 minutos por inercia nerviosa.", emoji: "📲", scoreWeight: { vigilante: 4, hipercontrolador: 3 } },
      { value: "fantasia_emergencia", label: "Reviso varias veces temiendo que haya ocurrido una emergencia grave.", emoji: "🚨", scoreWeight: { anticipador: 5 } },
      { value: "culpa_ocio", label: "Reviso porque me siento inútil o culpable si solo descanso.", emoji: "😓", scoreWeight: { sobrecargado: 4 } },
      { value: "desconexion", label: "Apago todo con absoluta tranquilidad mental.", emoji: "🛌", scoreWeight: { protectorSilencioso: 2 } }
    ]
  },
  {
    id: 32,
    category: "proteccion",
    type: "multiple",
    text: "[Día 5 - Q4] Para calmar eficazmente una mente hiperactiva que no para de diseñar listas, necesitas...",
    options: [
      { value: "ritual_cierre", label: "Escribir un ritual de cierre anotando que todo quedó cubierto por hoy.", scoreWeight: { hipercontrolador: 4 } },
      { value: "ejercicio_fuerte", label: "Hacer ejercicio físico vigoroso que baje la energía mental al cuerpo.", scoreWeight: { sobrecargado: 3, anticipador: 1 } },
      { value: "detox_digital", label: "Guardar bajo llave el móvil y mirar un paisaje natural.", scoreWeight: { vigilante: 3, protectorSilencioso: 1 } },
      { value: "meditacion_vacia", label: "Escuchar una meditación guiada o música binaural en penumbras.", scoreWeight: { protectorSilencioso: 3 } }
    ]
  },
  {
    id: 33,
    category: "detonantes",
    type: "card",
    text: "[Día 5 - Q5] Soportar el ritmo de aprendizaje de un compañero lento o desorganizado se siente como...",
    subtext: "Observa tu relación con el control y la paciencia.",
    options: [
      { value: "hacerlo_yo", label: "Una tortura mental. Prefiero arrebatárselo y resolverlo yo.", emoji: "🌪️", scoreWeight: { hipercontrolador: 5 } },
      { value: "agobio_silencioso", label: "Una sobrecarga silenciosa. Le ayudo aguantando mi estrés interno.", emoji: "😶", scoreWeight: { sobrecargado: 4, protectorSilencioso: 2 } },
      { value: "temor_fallo", label: "Pánico de que su lentitud haga que todo el equipo sea penalizado.", emoji: "📉", scoreWeight: { anticipador: 4, vigilante: 2 } },
      { value: "empatia_natural", label: "Comprensión. Le acompaño en su ritmo sin perder la dulzura.", emoji: "🌱", scoreWeight: {} }
    ]
  },
  {
    id: 34,
    category: "patrones",
    type: "multiple",
    text: "[Día 5 - Q6] ¿Cuál de estas frases define de mejor manera tu diálogo autocrítico dominante?",
    options: [
      { value: "debes_prever", label: "'Debiste haber previsto esto para evitar el impacto.'", scoreWeight: { anticipador: 4, vigilante: 2 } },
      { value: "debes_impecable", label: "'Tienes que ser impecable; fallar en esto muestra tu debilidad.'", scoreWeight: { hipercontrolador: 4, protectorSilencioso: 2 } },
      { value: "no_ayudas", label: "'Eres egoísta si no estás disponible para resolver sus problemas.'", scoreWeight: { sobrecargado: 4 } },
      { value: "comprension_amorosa", label: "'Hiciste lo mejor que pudiste con el conocimiento que tenías.'", scoreWeight: {} }
    ]
  },
  {
    id: 35,
    category: "activacion",
    type: "scale",
    text: "[Día 5 - Q7] ¿Qué tanta pesadez ocular o jaquecas sufres al finalizar la jornada laboral?",
    subtext: "La fatiga retiniana y frontal suele delatar un exceso de procesamiento mental.",
    minLabel: "Vista fresca",
    maxLabel: "Cerebro frito",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: { protectorSilencioso: 1 } },
      { value: "4", label: "4", scoreWeight: { sobrecargado: 1 } },
      { value: "5", label: "5", scoreWeight: { sobrecargado: 2 } },
      { value: "6", label: "6", scoreWeight: { hipercontrolador: 2 } },
      { value: "7", label: "7", scoreWeight: { hipercontrolador: 3 } },
      { value: "8", label: "8", scoreWeight: { anticipador: 3, vigilante: 2 } },
      { value: "9", label: "9", scoreWeight: { vigilante: 4, anticipador: 3 } },
      { value: "10", label: "10", scoreWeight: { vigilante: 5, sobrecargado: 3 } }
    ]
  },

  // ==========================================
  // DÍA 6: ESTRATEGIAS DE EVITACIÓN Y AUTOCONSOLACIÓN (Preguntas 36-42)
  // ==========================================
  {
    id: 36,
    category: "proteccion",
    type: "emoji",
    text: "[Día 6 - Q1] ¿Cuál ha sido tu pasatiempo o refugio de evasión favorito durante esta semana?",
    subtext: "Las vías de escape enseñan mucho sobre el tipo de descanso que buscas.",
    options: [
      { value: "pantallas", label: "Maratón de series o scroll infinito en redes sociales", emoji: "📺", scoreWeight: { sobrecargado: 3, anticipador: 2 } },
      { value: "gastronomia", label: "Comida reconfortante, dulces o una copa para relajar", emoji: "🍷", scoreWeight: { sobrecargado: 4, protectorSilencioso: 1 } },
      { value: "limpieza_evasiva", label: "Ordenar frenéticamente cajones para silenciar el runrún", emoji: "🧹", scoreWeight: { hipercontrolador: 4 } },
      { value: "anestesia", label: "Aislarme en el dormitorio a dormir largas horas de día", emoji: "🛌", scoreWeight: { protectorSilencioso: 4, vigilante: 2 } }
    ]
  },
  {
    id: 37,
    category: "detonantes",
    type: "scale",
    text: "[Día 6 - Q2] ¿Cuánto te agobia la incertidumbre del curso del país, economía o salud global?",
    subtext: "1 es 'Me enfoco en lo mío' y 10 es 'Consumo noticias constantemente con pánico'.",
    minLabel: "Filósofo estoico",
    maxLabel: "Consumidor del fin del mundo",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: {} },
      { value: "4", label: "4", scoreWeight: { protectorSilencioso: 1 } },
      { value: "5", label: "5", scoreWeight: { sobrecargado: 1 } },
      { value: "6", label: "6", scoreWeight: { hipercontrolador: 2 } },
      { value: "7", label: "7", scoreWeight: { vigilante: 2 } },
      { value: "8", label: "8", scoreWeight: { vigilante: 3, anticipador: 2 } },
      { value: "9", label: "9", scoreWeight: { anticipador: 4, vigilante: 3 } },
      { value: "10", label: "10", scoreWeight: { anticipador: 5, vigilante: 4 } }
    ]
  },
  {
    id: 38,
    category: "patrones",
    type: "multiple",
    text: "[Día 6 - Q3] Cuando experimentas una oleada de ansiedad aguda, tu primer pensamiento es...",
    options: [
      { value: "que_esta_mal", label: "'¿Qué está roto en mí? ¿Por qué no puedo ser normal como los demás?'", scoreWeight: { protectorSilencioso: 4, sobrecargado: 2 } },
      { value: "que_ocurrira", label: "'¿Y si esto empeora y me da un colapso cardíaco o pierdo el control?'", scoreWeight: { anticipador: 4, vigilante: 3 } },
      { value: "como_soluciono", label: "'Tengo que buscar en Google ahora mismo los síntomas para erradicar esto.'", scoreWeight: { hipercontrolador: 4 } },
      { value: "darle_la_bienvenida", label: "'Es solo mi sistema nervioso dándome un aviso. Pasará de largo.'", scoreWeight: {} }
    ]
  },
  {
    id: 39,
    category: "activacion",
    type: "card",
    text: "[Día 6 - Q4] Para ti, permanecer 30 minutos sentado en silencio sin hacer nada se siente como...",
    subtext: "Tu amígdala aprende de la quietud o la repudia.",
    options: [
      { value: "paz_plena", label: "Un santuario increíble y reparador que agradezco.", emoji: "🧘", scoreWeight: { protectorSilencioso: 2 } },
      { value: "inquietud_motora", label: "Me da picor physical, necesito mover las piernas o pararme.", emoji: "🏃", scoreWeight: { vigilante: 4, sobrecargado: 2 } },
      { value: "bucle_sobrepensar", label: "La mente lo aprovecha para bombardearme con mil pendientes.", emoji: "💣", scoreWeight: { anticipador: 4 } },
      { value: "frustracion_tiempo", label: "Una pérdida de tiempo intolerable, necesito producir.", emoji: "⏳", scoreWeight: { hipercontrolador: 4 } }
    ]
  },
  {
    id: 40,
    category: "proteccion",
    type: "multiple",
    text: "[Día 6 - Q5] ¿Qué tipo de caricia o apoyo afectivo baja de inmediato tus barreras corporales?",
    options: [
      { value: "abrazo_fuerte", label: "Un abrazo contenedor de 20 segundos sin palabras", scoreWeight: { sobrecargado: 4, vigilante: 2 } },
      { value: "palabra_aliento", label: "Que me digan: 'Tranquilo, yo me encargo de todo hoy por ti'", scoreWeight: { hipercontrolador: 4, sobrecargado: 3 } },
      { value: "presencia_silenciosa", label: "Sentarme junto a alguien querido sin necesidad de conversar", scoreWeight: { protectorSilencioso: 4 } },
      { value: "soltar_entorno", label: "Salir a caminar sola, sabiendo que nadie me espera en casa", scoreWeight: { vigilante: 3 } }
    ]
  },
  {
    id: 41,
    category: "detonantes",
    type: "scenario",
    text: "[Día 6 - Q6] Has agendado una cita médica rutinaria. ¿Cómo procesas los días previos?",
    subtext: "Una prueba clara de anticipación diagnóstica.",
    options: [
      { value: "catastrofe_medica", label: "Investigo los peores escenarios en Google convenciéndome de lo peor.", emoji: "🏥", scoreWeight: { anticipador: 5, vigilante: 2 } },
      { value: "olvido", label: "Lo agendo y no vuelvo a pensar en ello hasta sonar el aviso.", emoji: "📅", scoreWeight: {} },
      { value: "obsesion", label: "Reviso los parámetros clínicos anteriores y preparo una lista impecable.", emoji: "📋", scoreWeight: { hipercontrolador: 4 } },
      { value: "angustia_silenciosa", label: "Siento inquietud pero evito tocar el tema con nadie.", emoji: "🤫", scoreWeight: { protectorSilencioso: 4, sobrecargado: 1 } }
    ]
  },
  {
    id: 42,
    category: "activacion",
    type: "scale",
    text: "[Día 6 - Q7] ¿Qué tan frecuente es tu respiración superior o entrecortada en momentos de reposo?",
    subtext: "El patrón de respiración es la llave maestra del nervio vago.",
    minLabel: "Respiración profunda",
    maxLabel: "Jadeo hiperventilador",
    options: [
      { value: "1", label: "1", scoreWeight: {} },
      { value: "2", label: "2", scoreWeight: {} },
      { value: "3", label: "3", scoreWeight: { protectorSilencioso: 1 } },
      { value: "4", label: "4", scoreWeight: { protectorSilencioso: 2 } },
      { value: "5", label: "5", scoreWeight: { sobrecargado: 2 } },
      { value: "6", label: "6", scoreWeight: { sobrecargado: 3 } },
      { value: "7", label: "7", scoreWeight: { hipercontrolador: 2 } },
      { value: "8", label: "8", scoreWeight: { hipercontrolador: 3, vigilante: 2 } },
      { value: "9", label: "9", scoreWeight: { vigilante: 4, anticipador: 3 } },
      { value: "10", label: "10", scoreWeight: { vigilante: 5, anticipador: 4 } }
    ]
  },

  // ==========================================
  // DÍA 7: INTEGRACIÓN Y REPARACIÓN CULMINANTE (Preguntas 43-49)
  // ==========================================
  {
    id: 43,
    category: "patrones",
    type: "scenario",
    text: "[Día 7 - Q1] Mirándote al espejo después de estos 7 días de exploración, tu relación con la ansiedad es hoy...",
    subtext: "Visualiza la evolución de tu perspectiva.",
    options: [
      { value: "mensaje", label: "Ya no la veo como enemiga, sino como un mensajero cargado de avisos.", emoji: "📬", scoreWeight: { protectorSilencioso: -1, vigilante: -1 } },
      { value: "tregua", label: "Hemos firmado una pequeña tregua, aunque sigo atento.", emoji: "🤝", scoreWeight: { vigilante: 2 } },
      { value: "combate_sigue", label: "Sigue sintiéndose como una barrera dura que deseo extinguir.", emoji: "🛡️", scoreWeight: { sobrecargado: 3, anticipador: 2 } },
      { value: "desgaste_pleno", label: "Siento desánimo y cansancio acumulado tras mirarme tanto.", emoji: "🌧️", scoreWeight: { sobrecargado: 4 } }
    ]
  },
  {
    id: 44,
    category: "detonantes",
    type: "scale",
    text: "[Día 7 - Q2] ¿Qué tanto logras frenar el impulso del sobrepensamiento cuando detectas que開始?",
    subtext: "1 es 'Me arrastra el torbellino sin remedio' y 10 es 'Tengo la capacidad mental de suspenderlo'.",
    minLabel: "Esclavo del bucle",
    maxLabel: "Observador zen",
    options: [
      { value: "1", label: "1", scoreWeight: { anticipador: 4, vigilante: 2 } },
      { value: "2", label: "2", scoreWeight: { anticipador: 3, vigilante: 2 } },
      { value: "3", label: "3", scoreWeight: { sobrecargado: 3 } },
      { value: "4", label: "4", scoreWeight: { sobrecargado: 2 } },
      { value: "5", label: "5", scoreWeight: { hipercontrolador: 2 } },
      { value: "6", label: "6", scoreWeight: { hipercontrolador: 1 } },
      { value: "7", label: "7", scoreWeight: { protectorSilencioso: 1 } },
      { value: "8", label: "8", scoreWeight: { protectorSilencioso: -1 } },
      { value: "9", label: "9", scoreWeight: { vigilante: -2 } },
      { value: "10", label: "10", scoreWeight: { anticipador: -3, vigilante: -3 } }
    ]
  },
  {
    id: 45,
    category: "activacion",
    type: "emoji",
    text: "[Día 7 - Q3] ¿Cuál ha sido el estado promedio de tus palpitaciones cardíacas al despertar hoy?",
    subtext: "Tu primer despertar revela mucho sobre el cortisol matutino.",
    options: [
      { value: "aceleradas", label: "Agitadas, despierto con un sobresalto inmediato", emoji: "💓", scoreWeight: { anticipador: 4, vigilante: 3 } },
      { value: "pesadas", label: "Lentas pero asimilando un letargo profundo y dolor", emoji: "💤", scoreWeight: { sobrecargado: 4, protectorSilencioso: 2 } },
      { value: "rigidas", label: "Normales pero con la mandíbula firmemente unida", emoji: "🦷", scoreWeight: { hipercontrolador: 4 } },
      { value: "suaves", label: "Rítmicas, calmadas y con una transición templada", emoji: "🍃", scoreWeight: { protectorSilencioso: -1 } }
    ]
  },
  {
    id: 46,
    category: "proteccion",
    type: "card",
    text: "[Día 7 - Q4] Para integrar este aprendizaje el resto del mes, te comprometes principalmente a...",
    subtext: "Tu pacto personal de autocuidado corporal.",
    options: [
      { value: "decir_no", label: "Decir un no firme a la semana para preservar mis reservas.", emoji: "🛡️", scoreWeight: { sobrecargado: 4, protectorSilencioso: 2 } },
      { value: "pausas_aire", label: "Tomar una pausa de 5 minutos al aire libre al mediodía.", emoji: "☀️", scoreWeight: { vigilante: 3, sobrecargado: 1 } },
      { value: "delegar_meta", label: "Verificar mi nivel de supervisión y delegar tareas sin culpas.", emoji: "🤝", scoreWeight: { hipercontrolador: 4 } },
      { value: "escribir_diario", label: "Dedicar 10 minutos a descargar mis fantasías de preocupación en papel.", emoji: "📝", scoreWeight: { anticipador: 4 } }
    ]
  },
  {
    id: 47,
    category: "detonantes",
    type: "multiple",
    text: "[Día 7 - Q5] Cuando te planteas el mes de cara al futuro inmediato, ¿qué fantasía te visita?",
    options: [
      { value: "proximos_problemas", label: "Un sinfín de nuevos problemas de salud, dinero o trabajo por atajar.", scoreWeight: { anticipador: 5, vigilante: 2 } },
      { value: "seguir_exigiendo", label: "Tener que seguir rindiendo a un ritmo inhumano para no fracasar.", scoreWeight: { hipercontrolador: 4, sobrecargado: 3 } },
      { value: "decepcionar", label: "La idea de que decepcionaré a los que amo si bajo la intensidad.", scoreWeight: { sobrecargado: 4, protectorSilencioso: 3 } },
      { value: "confianza_plena", label: "Siento confianza en mis recursos para resolver lo que surja.", scoreWeight: {} }
    ]
  },
  {
    id: 48,
    category: "patrones",
    type: "emoji",
    text: "[Día 7 - Q6] ¿Qué frase se siente más reconfortante y liberadora para tu sistema corporal hoy?",
    subtext: "Haz click sobre el recordatorio que más alivie tu fatiga física.",
    options: [
      { value: "valgo_por_ser", label: "'Merezco existir y descansar aunque no esté resolviendo nada.'", emoji: "🛡️", scoreWeight: { sobrecargado: 5, hipercontrolador: 2 } },
      { value: "estoy_a_salvo", label: "'Estoy a salvo aquí en este preciso instante, no hay amenaza.'", emoji: "🏠", scoreWeight: { vigilante: 4, anticipador: 3 } },
      { value: "puedo_fallar", label: "'No tengo que ser perfecta para ser amada.'", emoji: "❤️", scoreWeight: { hipercontrolador: 4, protectorSilencioso: 3 } },
      { value: "tengo_derecho", label: "'Tengo derecho a expresar mi malestar y pedir socorro.'", emoji: "🗣️", scoreWeight: { protectorSilencioso: 5, sobrecargado: 2 } }
    ]
  },
  {
    id: 49,
    category: "proteccion",
    type: "scale",
    text: "[Día 7 - Q7] ¿Cuánto ha crecido tu nivel de compasión y cariño hacia tu vulnerable niña interior hoy?",
    subtext: "1 es 'Sigo sintiendo rechazo por mi debilidad' y 10 es 'Siento un inmenso amor fraternal'.",
    minLabel: "Dureza militar",
    maxLabel: "Abrazo compasivo",
    options: [
      { value: "1", label: "1", scoreWeight: { sobrecargado: 3 } },
      { value: "2", label: "2", scoreWeight: { sobrecargado: 2 } },
      { value: "3", label: "3", scoreWeight: { hipercontrolador: 2 } },
      { value: "4", label: "4", scoreWeight: { hipercontrolador: 1 } },
      { value: "5", label: "5", scoreWeight: {} },
      { value: "6", label: "6", scoreWeight: { protectorSilencioso: -1 } },
      { value: "7", label: "7", scoreWeight: { protectorSilencioso: -2 } },
      { value: "8", label: "8", scoreWeight: { vigilante: -2 } },
      { value: "9", label: "9", scoreWeight: { vigilante: -3, anticipador: -3 } },
      { value: "10", label: "10", scoreWeight: { sobrecargado: -4, hipercontrolador: -4 } }
    ]
  }
];
