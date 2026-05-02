import type { Strings } from "../types";

const en: Strings = {
  language: {
    code: "en",
    englishName: "English",
    nativeName: "English",
  },

  app: {
    loading: "Training drought model…",
    errorPrefix: "Failed to load data:",
  },

  tabs: {
    today: "Today",
    sim: "Simulator",
    impact: "Impact",
    about: "About",
  },

  stages: {
    Normal: "Normal",
    Watch: "Watch",
    Warning: "Warning",
    Emergency: "Emergency",
  },

  stageText: {
    Normal: "Reservoir healthy. No mandatory restrictions.",
    Watch: "Voluntary 10% reduction. Monitor irrigation.",
    Warning: "Stage 2: 15% mandatory cut. Outdoor watering limits.",
    Emergency: "Stage 4: 30%+ cuts. Ag allocations slashed.",
  },

  severityHeadline: {
    Normal: "No action needed",
    Watch: "Conserve voluntarily",
    Warning: "Restrictions in effect",
    Emergency: "Emergency declared",
  },

  today: {
    location: "San Joaquin",
    aquaalertActive: "AQUAALERT · ACTIVE",
    stageHeadline: (stage) => `${stage} stage`,
    forecastSummary: ({ month, pct }) =>
      `forecasted by ${month} · reservoir at ${Math.round(pct)}%`,
    notifyAction: "Notify me when stage changes",
    notifySent: "✓ Alert sent to your phone",
    currentReservoir: "CURRENT RESERVOIR",
    forecast12mo: "12-MONTH FORECAST",
    snowpack: "SNOWPACK",
    precip: "PRECIP",
    ofNormal: "of normal",
  },

  sim: {
    title: "Simulator",
    sub: "What if conditions changed?",
    predictedIn6Mo: "PREDICTED IN 6 MONTHS",
    deltaSummary: ({ delta, stage }) => `${delta} pp from today · ${stage}`,
    historyForecast: "24 MO HISTORY · 12 MO FORECAST",
    snowpack: "Snowpack",
    precipitation: "Precipitation",
    startMonth: "Start month",
    pctOfNormal: "% of normal",
    reset: "Reset to current",
    horizons: "HORIZONS",
  },

  impact: {
    title: "Local Impact",
    sub: (pct) => `Reservoir at ${Math.round(pct)}%`,
    severityPrefix: "SEVERITY",
    household: "HOUSEHOLD",
    farmAllocation: "FARM ALLOCATION",
    reservoirs: "RESERVOIRS",
    economicImpact: "ECONOMIC IMPACT",
    gallonsPerDay: "gal/day",
    pctOfNormal: "% of normal",
    shower: "Shower",
    lawn: "Lawn",
    pool: "Pool",
    acresFallowed: "Acres fallowed",
    level: "Level",
    boating: "Boating",
    fishing: "Fishing",
    cropLoss: "CROP LOSS",
    jobsAtRisk: "JOBS AT RISK",

    householdLabel: {
      Normal: "No restrictions",
      Watch: "Voluntary 10% cut",
      Warning: "Mandatory 15% cut",
      Emergency: "Mandatory 25% cut · fines $500",
    },
    farmLabel: {
      Normal: "Full allocation",
      Watch: "20% reduction",
      Warning: "45% reduction",
      Emergency: "70% reduction",
    },
    showerVal: {
      Normal: "unlimited",
      Watch: "5 min",
      Warning: "4 min",
      Emergency: "2 min",
    },
    lawnVal: {
      Normal: "all days",
      Watch: "odd days",
      Warning: "1 day/wk",
      Emergency: "banned",
    },
    poolVal: {
      Normal: "open",
      Watch: "open",
      Warning: "no refill",
      Emergency: "closed",
    },
    reservoirLevel: {
      Normal: "High",
      Watch: "Below avg",
      Warning: "Low",
      Emergency: "Critical",
    },
    reservoirBoating: {
      Normal: "open",
      Watch: "open",
      Warning: "restricted",
      Emergency: "closed",
    },
    reservoirFishing: {
      Normal: "open",
      Watch: "open",
      Warning: "permit only",
      Emergency: "closed",
    },
  },

  about: {
    title: "About",
    sub: "Methodology & sources",
    method: "METHOD",
    methodBody:
      "Four multivariate linear regressions trained on-device, one per forecast horizon (1, 3, 6, 12 months). Features: current snowpack & precipitation (% of normal), 3-month-lagged snowpack & precipitation, plus sin/cos seasonality of month-of-year. The 12-month curve interpolates between those four anchors.",
    modelFit: "MODEL FIT (R² IN-SAMPLE)",
    horizonLabel: (m) => `+${m} mo`,
    source: "SOURCE",
    dataset: "Dataset",
    datasetValue: "H2O Hackathon Challenge",
    endpoint: "Endpoint",
    coverage: "Coverage",
    records: "Records",
    recordsValue: (n) => `${n} months`,
    region: "Region",
    regionValue: "San Joaquin County, CA",
    stageThresholds: "STAGE THRESHOLDS",
    thresholdRange: {
      Normal: "> 85% reservoir",
      Watch: "75 – 85%",
      Warning: "65 – 75%",
      Emergency: "< 65%",
    },
    disclaimer:
      "Hackathon prototype. Don't make irrigation decisions from this.",
  },

  toast: {
    brand: "DROUGHTCAST",
    nowAdv: "now",
    forecastSummary: ({ stage, pct, month }) =>
      `${stage} forecast — ${Math.round(pct)}% by ${month}`,
  },
};

export default en;
