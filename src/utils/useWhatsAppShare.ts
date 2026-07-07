import { useCallback } from "react";

export type ShareVariant = 
  | "logro" 
  | "perfil" 
  | "boton_panico" 
  | "reto_premium" 
  | "milestone" 
  | "reward";

export interface ShareOptions {
  variant: ShareVariant;
  day?: number | string;
  perfilName?: string;
  badgeName?: string;
  rewardTitle?: string;
}

export const FUNNEL_URL = "https://quizmapa.tupodermental.club/";

/**
 * Hook de React para gestionar y construir los mensajes persuasivos de WhatsApp 
 * y disparar la compartición nativa o copia como fallback para el embudo de ventas.
 */
export const useWhatsAppShare = () => {
  
  /**
   * Genera el texto persuasivo de acuerdo a la variante y parámetros especificados
   */
  const getShareText = useCallback((options: ShareOptions): string => {
    const { variant, day, perfilName, badgeName, rewardTitle } = options;

    switch (variant) {
      case "logro":
        return `¡No puedo creer lo que descubrí hoy sobre mí en mi M.A.P.A.™! Acabo de completar mi día ${day || "X"} y por fin entiendo de dónde viene mi cansancio y cómo proteger mi calma. 🧠✨ Si tú también vives con estrés o sobrepensamiento, haz este test de 3 minutos, te va a cambiar la vida: ${FUNNEL_URL}`;

      case "perfil":
        const name = perfilName || "Mente Creativa con Sobrecarga";
        return `Mi perfil emocional M.A.P.A.™ reveló que tengo la alerta de '${name}' activa. 😮 Ahora todo tiene sentido... Si quieres descubrir qué mensaje te está intentando dar tu ansiedad, haz este escaneo inteligente aquí: ${FUNNEL_URL}`;

      case "boton_panico":
        return `🚨 Utilicé el Botón de Pánico "Necesito Calmarme Ahora" de M.A.P.A.™ y logré regular mi activación nerviosa en solo 2 minutos de forma científica.\n\nPrueba gratis estas herramientas de re-entrenamiento cognitivo realizando el test inicial:\n👉 ${FUNNEL_URL}`;

      case "reto_premium":
        return `💡 Hoy completé mi reto diario de Fortaleza Mental enfocado en la Desconexión Digital con M.A.P.A.™ Mujer. Cuidar de tu atención es cuidar de tu paz.\n\nConoce tu diagnóstico clínico cerebral gratis hoy mismo en:\n👉 ${FUNNEL_URL}`;

      case "milestone":
        return `🏆 ¡Desbloqueé la Insignia "${badgeName || "Constancia de Calma"}" de ${day || "3"} Días en M.A.P.A.™ Mujer! Estoy construyendo las bases sólidas para una mente más equilibrada.\n\nDescubre tu perfil de reactividad emocional gratis hoy mismo:\n👉 ${FUNNEL_URL}`;

      case "reward":
        return `🌸 ¡He desbloqueado mi "${rewardTitle || "Audio de Tranquilidad"}" de M.A.P.A.™ Mujer! Un recurso precioso con la voz de nuestra mentora, Clara, para serenar el sistema nervioso. Comienza tu propio viaje y desbloquea tus herramientas gratuitas aquí: ${FUNNEL_URL}`;

      default:
        return `¡Hola! Te recomiendo mucho realizar el escaneo inteligente de M.A.P.A.™ Mujer para descubrir de dónde proviene tu estrés y sobrepensamiento y cómo calmar tu sistema nervioso: ${FUNNEL_URL}`;
    }
  }, []);

  /**
   * Devuelve la URL para compartir en WhatsApp (wa.me o api.whatsapp.com)
   */
  const getWhatsAppLink = useCallback((options: ShareOptions): string => {
    const text = getShareText(options);
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }, [getShareText]);

  /**
   * Abre directamente la aplicación de WhatsApp con el mensaje seleccionado
   */
  const shareToWhatsApp = useCallback((options: ShareOptions) => {
    const link = getWhatsAppLink(options);
    window.open(link, "_blank", "noopener,noreferrer");
  }, [getWhatsAppLink]);

  /**
   * Intenta usar la Web Share API nativa si está disponible; de lo contrario, copia al portapapeles.
   */
  const shareWithFallback = useCallback(async (options: ShareOptions): Promise<{ success: boolean; method: "share" | "clipboard" }> => {
    const text = getShareText(options);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "M.A.P.A.™ Mujer",
          text: text,
          url: FUNNEL_URL
        });
        return { success: true, method: "share" };
      } catch (err) {
        console.warn("Navigator share cancelado o fallido, procediendo a copiar:", err);
      }
    }

    // Fallback: Clipboard
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: "clipboard" };
    } catch (err) {
      console.error("No se pudo copiar el texto al portapapeles:", err);
      return { success: false, method: "clipboard" };
    }
  }, [getShareText]);

  return {
    getShareText,
    getWhatsAppLink,
    shareToWhatsApp,
    shareWithFallback
  };
};
