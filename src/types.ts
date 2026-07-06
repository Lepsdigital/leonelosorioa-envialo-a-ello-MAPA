export interface QuestionOption {
  value: string;
  label: string;
  emoji?: string;
  scoreWeight: {
    vigilante?: number;
    anticipador?: number;
    hipercontrolador?: number;
    sobrecargado?: number;
    protectorSilencioso?: number;
  };
}

export type QuestionType = "multiple" | "emoji" | "scale" | "card" | "scenario";

export interface Question {
  id: number;
  category: "activacion" | "detonantes" | "patrones" | "proteccion";
  type: QuestionType;
  text: string;
  subtext?: string;
  options?: QuestionOption[];
  minLabel?: string;
  maxLabel?: string;
}

export interface QuizResponse {
  questionId: number;
  value: string; // The selected value or number
  category: string;
}

export interface LeadInfo {
  nombre: string;
  email: string;
  whatsapp: string;
}

export interface EmotionalProfile {
  id: "VIGILANTE" | "ANTICIPADOR" | "HIPERCONTROLADOR" | "SOBRECARGADO" | "PROTECTOR";
  name: string;
  avatar: string;
  subTitle: string;
  description: string;
  psychologicalInsight: string;
  activationLevel: number; // 0-100
  secondaryProfiles: { name: string; percentage: number }[];
  radarData: { name: string; A: number; B: number }[]; // for comparison / radar view
  indicators: {
    detonantes: string[];
    patrones: string[];
    proteccion: string[];
  };
  tranquilityRoute: {
    acciones: string[];
    habitos: string[];
    observar: string[];
  };
}
