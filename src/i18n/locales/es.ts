import type { Strings } from "../types";

const es: Strings = {
  language: {
    code: "es",
    englishName: "Spanish",
    nativeName: "Español",
  },

  app: {
    loading: "Entrenando modelo de sequía…",
    errorPrefix: "No se pudieron cargar los datos:",
  },

  tabs: {
    today: "Hoy",
    sim: "Simulador",
    impact: "Impacto",
    settings: "Ajustes",
  },

  roles: {
    label: {
      farmer: "Agricultor",
      resident: "Residente",
      school: "Escuela",
      business: "Negocio",
      planner: "Planificador urbano",
    },
    sub: {
      farmer: "Riego y planificación de cultivos",
      resident: "Uso doméstico del agua",
      school: "Operaciones del campus",
      business: "Uso comercial del agua",
      planner: "Infraestructura pública",
    },
  },

  onboarding: {
    title: "¿Qué te describe mejor?",
    sub: "Personalizaremos las alertas y recomendaciones para tu situación.",
    cta: "Continuar",
    skip: "Saltar por ahora",
  },

  personalizedAlert: {
    eyebrow: "PARA TI",
    headline: "Recomendado esta semana",
    body: {
      farmer: "Reduce el riego un 15% esta semana.",
      resident: "Evita regar el césped.",
      school: "Pausa el riego exterior no esencial.",
      business: "Revisa equipos que usen agua por fugas.",
      planner: "Se recomienda conservar el embalse.",
    },
  },

  recommendedActions: {
    title: "Acciones recomendadas",
    sub: "Pasos con mayor impacto ante un riesgo elevado.",
    items: {
      drip: "Cambia a riego por goteo",
      delayWatering: "Posterga el riego no esencial",
      checkLeaks: "Revisa si hay fugas",
      reduceOutdoor: "Reduce el uso exterior",
    },
  },

  stages: {
    Normal: "Normal",
    Watch: "Vigilancia",
    Warning: "Advertencia",
    Emergency: "Emergencia",
  },

  stageText: {
    Normal: "Embalse saludable. Sin restricciones obligatorias.",
    Watch: "Reducción voluntaria del 10%. Vigila el riego.",
    Warning:
      "Etapa 2: recorte obligatorio del 15%. Límites al riego exterior.",
    Emergency:
      "Etapa 4: recortes del 30% o más. Fuerte recorte a la agricultura.",
  },

  severityHeadline: {
    Normal: "No se requiere acción",
    Watch: "Conserva voluntariamente",
    Warning: "Restricciones en vigor",
    Emergency: "Emergencia declarada",
  },

  today: {
    location: "San Joaquín",
    aquaalertActive: "AQUAALERT · ACTIVO",
    stageHeadline: (stage) => `Etapa ${stage}`,
    forecastSummary: ({ month, pct }) =>
      `previsto para ${month} · embalse al ${Math.round(pct)}%`,
    notifyAction: "Avísame cuando cambie la etapa",
    notifySent: "✓ Alerta enviada a tu teléfono",
    currentReservoir: "EMBALSE ACTUAL",
    forecast12mo: "PRONÓSTICO DE 12 MESES",
    snowpack: "MANTO DE NIEVE",
    precip: "LLUVIA",
    ofNormal: "de lo normal",
  },

  sim: {
    title: "Simulador",
    sub: "¿Y si cambian las condiciones?",
    predictedIn6Mo: "PREVISTO EN 6 MESES",
    deltaSummary: ({ delta, stage }) =>
      `${delta} pp respecto a hoy · ${stage}`,
    historyForecast: "24 M HISTORIAL · 12 M PRONÓSTICO",
    snowpack: "Manto de nieve",
    precipitation: "Precipitación",
    startMonth: "Mes inicial",
    pctOfNormal: "% de lo normal",
    reset: "Restablecer al actual",
    horizons: "HORIZONTES",
  },

  impact: {
    title: "Impacto local",
    sub: (pct) => `Embalse al ${Math.round(pct)}%`,
    severityPrefix: "SEVERIDAD",
    household: "HOGAR",
    farmAllocation: "ASIGNACIÓN AGRÍCOLA",
    reservoirs: "EMBALSES",
    economicImpact: "IMPACTO ECONÓMICO",
    gallonsPerDay: "gal/día",
    pctOfNormal: "% de lo normal",
    shower: "Ducha",
    lawn: "Césped",
    pool: "Piscina",
    acresFallowed: "Acres en barbecho",
    level: "Nivel",
    boating: "Navegación",
    fishing: "Pesca",
    cropLoss: "PÉRDIDA DE COSECHAS",
    jobsAtRisk: "EMPLEOS EN RIESGO",

    householdLabel: {
      Normal: "Sin restricciones",
      Watch: "Recorte voluntario del 10%",
      Warning: "Recorte obligatorio del 15%",
      Emergency: "Recorte obligatorio del 25% · multas $500",
    },
    farmLabel: {
      Normal: "Asignación completa",
      Watch: "Reducción del 20%",
      Warning: "Reducción del 45%",
      Emergency: "Reducción del 70%",
    },
    showerVal: {
      Normal: "ilimitada",
      Watch: "5 min",
      Warning: "4 min",
      Emergency: "2 min",
    },
    lawnVal: {
      Normal: "todos los días",
      Watch: "días impares",
      Warning: "1 día/sem",
      Emergency: "prohibido",
    },
    poolVal: {
      Normal: "abierta",
      Watch: "abierta",
      Warning: "sin rellenar",
      Emergency: "cerrada",
    },
    reservoirLevel: {
      Normal: "Alto",
      Watch: "Bajo el promedio",
      Warning: "Bajo",
      Emergency: "Crítico",
    },
    reservoirBoating: {
      Normal: "abierta",
      Watch: "abierta",
      Warning: "restringida",
      Emergency: "cerrada",
    },
    reservoirFishing: {
      Normal: "abierta",
      Watch: "abierta",
      Warning: "solo con permiso",
      Emergency: "cerrada",
    },
  },

  settings: {
    title: "Ajustes",
    sub: "Personaliza DroughtCast",
    languageSection: "IDIOMA",
    profileSection: "SOY UN(A)…",
    profileHint: "Ajusta las alertas y recomendaciones que ves.",
    methodSection: "MÉTODO",
    sourceSection: "FUENTE",
    thresholdsSection: "UMBRALES DE ETAPA",
    methodBody:
      "Cuatro regresiones lineales multivariadas entrenadas en el dispositivo, una por horizonte de pronóstico (1, 3, 6 y 12 meses). Variables: manto de nieve y precipitación actuales (% de lo normal), manto y precipitación con desfase de 3 meses, y estacionalidad sin/cos del mes del año.",
    horizonLabel: (m) => `+${m} mes`,
    dataset: "Conjunto de datos",
    datasetValue: "H2O Hackathon Challenge",
    endpoint: "Endpoint",
    coverage: "Cobertura",
    records: "Registros",
    recordsValue: (n) => `${n} meses`,
    region: "Región",
    regionValue: "Condado de San Joaquín, CA",
    thresholdRange: {
      Normal: "> 85% del embalse",
      Watch: "75 – 85%",
      Warning: "65 – 75%",
      Emergency: "< 65%",
    },
    disclaimer:
      "Prototipo de hackatón. No tomes decisiones de riego basadas en esto.",
  },

  toast: {
    brand: "DROUGHTCAST",
    nowAdv: "ahora",
    forecastSummary: ({ stage, pct, month }) =>
      `Pronóstico ${stage} — ${Math.round(pct)}% para ${month}`,
  },
};

export default es;
