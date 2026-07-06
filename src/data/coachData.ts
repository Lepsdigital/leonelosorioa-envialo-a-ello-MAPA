export interface CoachCategory {
  id: string;
  name: string;
  keywords: string[];
  response: string;
  recommendedChallenge: string;
  recommendedSound: string;
  recommendedReflection: string;
}

export const COACH_CATEGORIES: CoachCategory[] = [
  {
    id: "miedo",
    name: "Miedo",
    keywords: ["miedo", "asustado", "asustada", "pavor", "terror", "temor", "temores", "asusta", "temer"],
    response: "El miedo es una señal biológica que intenta protegerte, no un enemigo. Reconocerlo en tu cuerpo es el primer paso para indicarle a tu amígdala cerebral que estás a salvo en este preciso momento.",
    recommendedChallenge: "Práctica de Anclaje 5-4-3-2-1: Nombra 5 cosas a tu alrededor para recordar que el presente es seguro.",
    recommendedSound: "432 Hz - Armonía Natural (🌿 Jardín de Paz)",
    recommendedReflection: "Sentir miedo no me hace débil, me recuerda que soy humano y que puedo elegir actuar con autocompasión."
  },
  {
    id: "ansiedad",
    name: "Ansiedad",
    keywords: ["ansiedad", "ansioso", "ansiosa", "angustia", "intranquilo", "intranquila", "desesperado", "desesperada", "desesperacion", "desesperación", "alterado", "alterada"],
    response: "La ansiedad es energía acumulada buscando una salida. No intentes luchar contra ella o reprimirla; recíbela como una ola que, así como sube, inevitablemente volverá a bajar.",
    recommendedChallenge: "Respiración Somática Equitativa: Realiza 5 ciclos de inhalación y exhalación de 5 segundos cada uno.",
    recommendedSound: "528 Hz - Reparación y Paz (🌿 Jardín de Paz)",
    recommendedReflection: "Este estado de alerta es temporal. Mi cuerpo sabe cómo volver a su equilibrio natural."
  },
  {
    id: "sobrepensamiento",
    name: "Sobrepensamiento",
    keywords: ["sobrepensamiento", "sobrepensando", "mente no para", "rumia", "rumiando", "vueltas", "pensando mucho", "pensamientos", "maquinar", "maquinando", "cabeza no para"],
    response: "Pensar demasiado crea tormentas donde solo hay viento. Tu mente intenta resolver un problema del futuro que aún no existe. Traigamos la atención de vuelta hacia el único lugar real: el presente.",
    recommendedChallenge: "Escribir y soltar rumiaciones: Escribe tus preocupaciones en un papel durante 2 minutos y luego deséchalo mentalmente.",
    recommendedSound: "136.1 Hz - Frecuencia de la Tierra (🌿 Jardín de Paz)",
    recommendedReflection: "No tengo que resolver toda mi vida hoy. Elijo enfocarme únicamente en mi siguiente respiración."
  },
  {
    id: "palpitaciones",
    name: "Palpitaciones",
    keywords: ["palpitaciones", "corazon latiendo", "corazón latiendo", "taquicardia", "pecho apretado", "corazon rapido", "corazón rápido", "latidos", "pecho", "presion en el pecho", "presión en el pecho"],
    response: "Es completamente normal sentir que tu corazón se acelera ante una alerta emocional. Es tu sistema cardiovascular preparándose. Tu corazón es fuerte y sabe cómo autorregularse cuando respiras con calma.",
    recommendedChallenge: "Estiramiento Somático y exhalaciones largas: Expande tu pecho al inhalar y exhala por la boca el doble de lento.",
    recommendedSound: "136.1 Hz - Frecuencia de la Tierra / Estimulación Vagal",
    recommendedReflection: "Mi corazón late para darme vida. Le agradezco su fuerza y lo acompaño respirando pausadamente."
  },
  {
    id: "insomnio",
    name: "Insomnio",
    keywords: ["insomnio", "no puedo dormir", "desvelo", "sin sueno", "sin sueño", "despierto", "despierta", "dormir", "madrugada", "desvelado", "desvelada", "pesadilla"],
    response: "El insomnio suele ser el resultado de un sistema nervioso que no se siente lo suficientemente seguro para apagarse. Permítete soltar la exigencia de dormir y enfócate únicamente en descansar tu cuerpo con amabilidad.",
    recommendedChallenge: "Escaneo corporal recostado: Recorre mentalmente tu cuerpo soltando tensiones desde la frente hasta los dedos de los pies.",
    recommendedSound: "136.1 Hz - Vibración Profunda de Descanso",
    recommendedReflection: "Incluso si no concilio el sueño de inmediato, mi cuerpo se beneficia del descanso consciente y de mi presencia amable."
  },
  {
    id: "estres",
    name: "Estrés",
    keywords: ["estres", "estrés", "estresado", "estresada", "abrumado", "abrumada", "saturado", "saturada", "presion", "presión", "agotado", "agotada", "cansado", "cansada", "explotar"],
    response: "El estrés es la brecha entre lo que percibimos que se nos exige y nuestra energía actual. Honra tu cansancio. No eres una máquina; eres un ser vivo que necesita ciclos naturales de carga y descarga.",
    recommendedChallenge: "Desconexión Digital Saludable: Tómate 10 minutos para caminar o contemplar tu entorno sin pantallas ni notificaciones.",
    recommendedSound: "432 Hz - Armonía Natural / Alivio de Tensión Cognitiva",
    recommendedReflection: "Hago lo que puedo con el amor y la energía que tengo hoy. Mi valor como persona no depende de mi nivel de productividad."
  },
  {
    id: "incertidumbre",
    name: "Incertidumbre",
    keywords: ["incertidumbre", "no se que pasara", "no sé qué pasará", "futuro", "duda", "dudas", "que va a pasar", "qué va a pasar", "inseguridad", "mañana", "manana"],
    response: "La incertidumbre nos confronta con la ilusión de que podemos controlarlo todo. No necesitas conocer el final de todo el camino para dar el primer paso con seguridad, autocompasión y confianza.",
    recommendedChallenge: "Escribir un límite de control: Clasifica tus preocupaciones actuales entre 'Lo que puedo hacer hoy' y 'Lo que debo soltar'.",
    recommendedSound: "528 Hz - Reparación y Paz / Claridad Mental",
    recommendedReflection: "Confío en mi capacidad para adaptarme y responder a lo que traiga el mañana, un día a la vez."
  },
  {
    id: "soledad",
    name: "Soledad",
    keywords: ["soledad", "solo", "sola", "aislado", "aislada", "nadie", "vacio", "vacío", "incomprendido", "incomprendida", "abandonado", "abandonada"],
    response: "Sentirse solo es un recordatorio humano de nuestro profundo deseo de conexión. Aunque en este instante no haya alguien a tu lado, estás conectado con millones que experimentan este mismo anhelo en este mismo segundo.",
    recommendedChallenge: "Conexión de Soporte Social: Envía un mensaje corto de agradecimiento o saludo amable a alguien de tu entorno.",
    recommendedSound: "528 Hz - Reparación y Paz / Conexión de Corazón",
    recommendedReflection: "Soy mi propio compañero constante. Elijo tratarme con la misma calidez y el respeto que le daría a un gran amigo."
  },
  {
    id: "culpa",
    name: "Culpa",
    keywords: ["culpa", "culpable", "falle", "fallé", "deberia haber", "debería haber", "error", "errores", "arrepentido", "arrepentida", "remordimiento"],
    response: "La culpa mira hacia el pasado con la sabiduría de hoy, lo cual es profundamente injusto. Hiciste lo mejor que pudiste con el nivel de consciencia, recursos y madurez emocional que tenías en ese momento.",
    recommendedChallenge: "Anclaje de Autocompasión: Escríbete una breve nota de perdón reconociendo tu innegable humanidad.",
    recommendedSound: "432 Hz - Armonía Natural / Liberación y Sanación",
    recommendedReflection: "Me libero de la carga de las expectativas pasadas. Aprendo de mis experiencias, me perdono y elijo avanzar con ligereza."
  },
  {
    id: "tristeza",
    name: "Tristeza",
    keywords: ["triste", "tristeza", "llorar", "llanto", "pena", "dolor", "nostalgia", "desanimo", "desánimo", "deprimido", "deprimida", "melancolia", "melancolía"],
    response: "La tristeza es el proceso natural por el cual el alma asimila una pérdida, un cambio o un anhelo insatisfecho. Permítete sentirla sin juzgarla. Las lágrimas limpian la mirada y abren espacio para sanar.",
    recommendedChallenge: "Escaneo Somático y abrazo de contención: Cruza tus brazos sobre el pecho y date un suave golpeteo alternado para calmarte.",
    recommendedSound: "136.1 Hz - Frecuencia de la Tierra (🌿 Jardín de Paz)",
    recommendedReflection: "Acepto mis sentimientos como parte de mi proceso de sanación. Mi tristeza merece ser escuchada con ternura."
  },
  {
    id: "control",
    name: "Necesidad de control",
    keywords: ["control", "controlar", "perfeccionismo", "perfeccion", "perfección", "tiene que ser", "exigencia", "desespera", "desesperar", "impaciencia", "impaciente", "no soporto"],
    response: "La necesidad de control suele ser el miedo a la incertidumbre disfrazado de orden y rigidez. Querer controlarlo todo es una carga pesada que agota tu sistema nervioso. Intenta abrir las manos y dejar fluir.",
    recommendedChallenge: "Ejercicio de apertura física: Abre y cierra las manos lentamente 10 veces, sincronizándolas con tu respiración somática.",
    recommendedSound: "432 Hz - Armonía Natural / Fluidez Neural",
    recommendedReflection: "Suelto la necesidad de controlarlo todo. Confío en el fluir natural de la vida y me permito descansar en el ahora."
  },
  {
    id: "panico",
    name: "Ataque de pánico",
    keywords: ["ataque de panico", "ataque de pánico", "panico", "pánico", "me muero", "no puedo respirar", "me falta el aire", "ahogo", "descontrol", "me vuelvo loco", "me vuelvo loca"],
    response: "Aunque sientas una tormenta inmensa en el cuerpo, estás a salvo. Esto es una alarma de supervivencia temporal que alcanzará su punto máximo y luego se disipará. Tu cuerpo está diseñado para resistir esto y recuperar su equilibrio.",
    recommendedChallenge: "Botón de Pánico inmediato: Activa la guía de respiración 4-4-4 (Caja) y concéntrate firmemente en sentir la planta de tus pies en el suelo.",
    recommendedSound: "136.1 Hz - Frecuencia de la Tierra / Estabilidad Somática Profunda",
    recommendedReflection: "Estoy a salvo en este preciso instante. Mi cuerpo sabe perfectamente cómo recuperar la paz y esta ola pasará."
  },
  {
    id: "autoestima",
    name: "Autoestima",
    keywords: ["autoestima", "inseguro", "insegura", "no valgo", "no sirvo", "insuficiente", "comparo", "fracaso", "feo", "fea", "inutil", "inútil", "malo", "mala"],
    response: "Tu valor personal no es algo que se gane, se demuestre o dependa del juicio externo de otros. Es intrínseco e inalterable. Eres digno de amor, paz y bienestar simplemente por el hecho de existir.",
    recommendedChallenge: "Semillas de Paz: Elige un pensamiento anclaje de autocompasión, escríbelo en el Jardín de Paz y repítelo con afecto.",
    recommendedSound: "528 Hz - Reparación y Paz / Resonancia de Auto-valor",
    recommendedReflection: "Soy suficiente tal como soy en este momento. Merezco mi propio cuidado, respeto y amabilidad incondicional."
  },
  {
    id: "esperanza",
    name: "Esperanza",
    keywords: ["esperanza", "fe", "ilusion", "ilusión", "mejorar", "saldre adelante", "saldré adelante", "confio", "confío", "optimismo", "futuro mejor", "adelante"],
    response: "La esperanza es una luz sutil pero sumamente poderosa. Mantenerla activa alimenta tu resiliencia neural y le indica a tu mente subconsciente que vale la pena seguir dando pasos amables en tu proceso.",
    recommendedChallenge: "Registro de avance amable: Escribe una pequeña meta o acción amable para el día de mañana que te traiga paz.",
    recommendedSound: "528 Hz - Reparación y Paz / Frecuencia de la Renovación",
    recommendedReflection: "Detrás de las nubes más densas, el sol sigue brillando. Elijo creer en mi capacidad única para sanar y florecer."
  },
  {
    id: "gratitud",
    name: "Gratitud",
    keywords: ["gratitud", "agradecido", "agradecida", "gracias", "afortunado", "afortunada", "bendecido", "bendecida", "agradecer", "valorar", "valoro"],
    response: "La gratitud es una herramienta poderosa para reconfigurar las redes neuronales hacia el bienestar. Al agradecer, sintonizas de inmediato tu mente con la paz y la abundancia de la vida cotidiana.",
    recommendedChallenge: "Frasco de Agradecimiento: Escribe en la sección de Retos Activos 3 cosas sencillas que agradezcas de tu día.",
    recommendedSound: "432 Hz - Armonía Natural (🌿 Jardín de Paz)",
    recommendedReflection: "Agradezco el valioso regalo de respirar, de sentir y de tener una mente consciente con poder para transformarse."
  }
];

export const GENERIC_SUPPORT_RESPONSE = {
  response: "Te agradezco mucho que te permitas expresar libremente lo que estás transitando. En la filosofía M.A.P.A.™ sostenemos que 'Comprender es el primer paso para transformar'. Sigue liberando tu sentir; cada palabra escrita disminuye la carga acumulada en tu sistema nervioso y te ayuda a regular tus emociones de forma segura.",
  recommendedChallenge: "Explora la Guía de Respiración Somática en el '🌿 Jardín de Paz' para estabilizar tu pulso.",
  recommendedSound: "Frecuencia de 136.1 Hz - Frecuencia de la Tierra",
  recommendedReflection: "Me permito sentir, pausar y transformar mi experiencia emocional con absoluta paciencia y respeto."
};

/**
 * Matches a user message against the preconfigured categories.
 * Returns the matched category or undefined if no match was found.
 */
export function analyzeUserMessage(message: string): CoachCategory | undefined {
  const normalized = message.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents
  
  for (const cat of COACH_CATEGORIES) {
    for (const kw of cat.keywords) {
      // Normalize keyword too just in case
      const normKw = kw.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      
      // Match whole words or substrings depending on length
      if (normalized.includes(normKw)) {
        return cat;
      }
    }
  }
  return undefined;
}
